const FLOAT_PATTERN = new RegExp(
  // 2.5e4, 2.5 and integers
  '^[\\-+]?(?:[0-9][0-9]*)(?:\\.[0-9]*)?(?:[eE][\\-+]?[0-9]+)?$' +
  // .2e4, .2
  // special case, seems not from spec
  '|^\\.[0-9]+(?:[eE][\\-+]?[0-9]+)?$'
)

const resolveFloat = data => data !== null && FLOAT_PATTERN.test(data)

const constructFloat = data => parseFloat(data, 10)

module.exports = {
  type     : 'float',
  resolve  : resolveFloat,
  construct: constructFloat,
}
