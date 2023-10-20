const resolveAndCastValue = require('./resolve-and-cast-value')

const isSection = line => line !== undefined && /^[A-Z]/.test(line.trim())
const isProperty = line => line.indexOf(':') !== -1

function parsePropertyLine(line) {
  const [key, value] = line.split(':')

  return { key, value: resolveAndCastValue(value.trim()) }
}

function addDataToStructure(dataTree, levels, prevLevel, line = null) {
  let currentObj = dataTree

  for (const [index, level] of levels.entries()) {
    const { section } = level

    if (!(section in currentObj)) {
      currentObj[section] = getConstruct(levels)()
    }

    currentObj = currentObj[section]

    if (Array.isArray(currentObj)) {
      if (
        !line
        && (prevLevel.indent !== level.indent || prevLevel.indent === level.indent && section === prevLevel.section)
        && index === levels.length - 1
      ) {
        currentObj.push({})
      }

      currentObj = currentObj[currentObj.length - 1]
    }
  }

  if (!line) {
    return
  }

  const { key, value } = parsePropertyLine(line)

  currentObj[key] = value
}

const arrayConstruct = () => []
const objectConstruct = () => ({})
const getConstruct = levels => {
  const prevLevel = levels[levels.length - 2]
  const level = levels[levels.length - 1]
  const shouldUseObjectConstruct = (
    !(level?.precedingCRCount === 3 && level?.indent > 0)
    && (levels.length === 1 || prevLevel.hasProperties)
  )
  return shouldUseObjectConstruct ? objectConstruct : arrayConstruct
}

function adjustLevels(levels, indent, line) {
  while (indent < levels.length) {
    levels.pop()
  }

  const lastLevel = levels[levels.length - 1]
  if (levels.length > 0 && indent === lastLevel.indent && line !== lastLevel.section) {
    levels.pop()
  }

  return levels
}

function handleSection(dataTree, levels, prevLevel, line, indent, precedingCRCount) {
  const { prev: _, ...nextPrevLevel } = prevLevel
  const prev = prevLevel.indent === indent ? nextPrevLevel : null
  levels.push({ section: line, precedingCRCount, indent, hasProperties: false, prev })

  addDataToStructure(dataTree, levels, prevLevel)
  return levels[levels.length - 1]
}

function handleProperty(dataTree, levels, prevLevel, line) {
  levels[levels.length - 1].hasProperties = true
  addDataToStructure(dataTree, levels, prevLevel, line)
}

function convertToObject(data) {
  let dataTree = {}
  let levels = []
  let prevLevel = {}

  for (let [_, [precedingCRCount, indent, line]] of data.entries()) {
    levels = adjustLevels(levels, indent, line)

    if (isSection(line)) {
      prevLevel = handleSection(dataTree, levels, prevLevel, line, indent, precedingCRCount)
    } else if (isProperty(line)) {
      handleProperty(dataTree, levels, prevLevel, line)
    }
  }

  return dataTree
}

module.exports = convertToObject