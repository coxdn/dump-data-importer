const types = require('./type')

function resolveAndCastValue(value) {
  let nextValue = value

  for (let type of types) {
    if (type.resolve(value)) {
      nextValue = type.construct(value)
      break
    }
  }

  return nextValue
}

module.exports = resolveAndCastValue