const addIndentFirst = line => line.replace(/^\s*/, '$&- ')
const addIndent = line => line.replace(/^\s*/, '$&  ')
const calcIndent = line => line.match(/^[\s\-]*/)[0].length / 2
const isSection = line => line !== undefined && /^[A-Z]/.test(line.trim())
const isProperty = line => line.indexOf(':') !== -1
const isEmpty = line => line !== undefined && line.trim() === ''

function convertToYAML(data) {
  let lines = data
    .split('\n')
    .map(line => line.trimEnd())
  const [maxIndent] = lines
    .map(calcIndent)
    .sort((a, b) => b - a)

  const processLines = (startIndent) => {
    let i = 0
    const newLines = []

    while (i < lines.length) {
      const line = lines[i]
      let indent = calcIndent(line)

      const initialPropertyCondition = (
        indent === startIndent
        && isProperty(line)
        && isSection(lines[i - 1])
        && (isSection(lines[i - 3]) || isEmpty(lines[i - 3]))
      )

      if (initialPropertyCondition) {
        let section = lines[i - 1].trim()
        newLines.push(addIndentFirst(line))

        i++
        while (i < lines.length) {
          const nextLine = lines[i]
          let nextIndent = calcIndent(nextLine)

          const lineIsEmpty = isEmpty(nextLine)
          if (lineIsEmpty || nextIndent >= indent) {
            newLines.push(lineIsEmpty ? nextLine : addIndent(nextLine))
            i++
          } else if (nextIndent < indent && nextLine.trim() === section) {
            i += 2
            newLines.push(addIndentFirst(lines[i - 1]))
          } else {
            break
          }
        }
      } else {
        newLines.push(line)
        i++
      }
    }

    return { newLines }
  }

  for (let indent = maxIndent; indent > 0; indent--) {
    let { newLines } = processLines(indent)
    lines = newLines
  }

  lines = lines.map(line => isSection(line) ? line + ':' : line)

  return lines
    .filter(line => line !== '')
    .join('\n')
}


module.exports = convertToYAML