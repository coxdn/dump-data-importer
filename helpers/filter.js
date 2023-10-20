function uniqueRowFilter(results) {
  const uniqueQueriesParams = []
  const seenCombinations = {}

  for (const obj of results) {
    const key = `${obj.table}-${obj.entityId}`
    if (!seenCombinations[key] || obj.entityId === null) {
      seenCombinations[key] = true
      uniqueQueriesParams.push(obj)
    }
  }

  return uniqueQueriesParams
}

module.exports = {
  uniqueRowFilter,
}