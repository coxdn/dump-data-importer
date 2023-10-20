const { uniqueRowFilter } = require('./filter')
const { queryParameterComposer } = require('./sql-composer')

function serializeObject(parentKey, parentObj, parentId) {
  let columns = []
  let serializedResults = []

  for (const key in parentObj) {
    if (Array.isArray(parentObj[key])) {
      parentObj[key].forEach(childObj => {
        serializedResults.push(...serializeObject(key, childObj, parentId || parentObj.id, parentKey))
      })
    } else if (typeof parentObj[key] === 'object') {
      if (parentObj[key].hasOwnProperty('id')) {
        serializedResults.push(...serializeObject(key, parentObj[key], undefined, parentKey))
        columns.push({
          key  : `${key.toLowerCase()}_id`,
          value: parentObj[key].id
        })
      } else {
        serializedResults.push(...serializeObject(key, parentObj[key], parentId || parentObj.id))
      }
    } else {
      columns.push({ key, value: parentObj[key] })
    }
  }

  if (parentId !== undefined) {
    columns.push({ key: 'parent_id', value: parentId })
  }

  if ((parentId !== undefined || columns.length > 0) && columns.length > 1) {
    const index = columns.findIndex(({ key }) => key === 'id')
    const entityId = index !== -1 ? columns[index].value : null
    serializedResults.push({
      table : parentKey,
      entityId,
      keys  : columns.map(({ key }) => key),
      values: columns.map(({ value }) => value)
    })
  }

  return serializedResults
}

function objectToSql(data) {
  const sqlObjectList = []

  for (const key in data) {
    sqlObjectList.push(...serializeObject(key, data[key]))
  }

  const uniqueQueriesParams = uniqueRowFilter(sqlObjectList)

  return queryParameterComposer(uniqueQueriesParams)
}

module.exports = objectToSql