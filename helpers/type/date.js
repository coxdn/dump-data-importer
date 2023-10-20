const DATE_PATTERN = new RegExp(
  // day of week
  '^(Sun|Mon|Tue|Wed|Thu|Fri|Sat) ' +
  // month
  '(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec) ' +
  // day and year
  '(0[1-9]|[12][0-9]|3[01]) \\d{4}$'
)

const resolveDate = data => DATE_PATTERN.test(data)

function constructDate(data) {
  const dateComponents = data.split(' ')

  const inputDate = new Date(dateComponents[1] + " " + dateComponents[2] + ", " + dateComponents[3])

  const day = inputDate.getDate().toString().padStart(2, '0')
  const month = (inputDate.getMonth() + 1).toString().padStart(2, '0')
  const year = inputDate.getFullYear()

  return `${year}-${month}-${day}`
}

module.exports = {
  type: 'date',
  resolve: resolveDate,
  construct: constructDate,
}