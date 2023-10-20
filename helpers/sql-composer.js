function queryParameterComposer(data) {
  const result = []

  for (let element of data) {
    const keys = element.keys.map(({ key }) => key)
    const fieldsMask = Array.from(keys.keys()).map(i => `\$${i + 2}:name`).join(', ')
    const valuesMask = Array.from(keys.keys()).map(i => `\$${i + 2 + keys.length}`).join(', ')
    const template = `INSERT INTO $1:name (${ fieldsMask }) VALUES (${ valuesMask })`
    result.push({
      template,
      params: [element.table, ...element.keys, ...element.values]
    })
  }

  return result
}

module.exports = {
  queryParameterComposer,
}