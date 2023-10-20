const isDecCode = c => (0x30/* 0 */ <= c) && (c <= 0x39/* 9 */)

function resolveInteger(data) {
  if (data === null) return false

  let index = 0, hasDigits = false
  const max = data.length

  if (!max) return false

  for (; index < max; index++) {
    if (!isDecCode(data.charCodeAt(index))) {
      return false
    }
    hasDigits = true
  }

  return hasDigits
}

const constructInteger = data => parseInt(data, 10)

module.exports = {
  type     : 'int',
  resolve  : resolveInteger,
  construct: constructInteger,
}
