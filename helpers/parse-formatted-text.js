const isCarriageReturn = char => char === '\r'
const isLineFeed = char => char === '\n'
const isCRLFChar = char => isCarriageReturn(char) || isLineFeed(char)

function parseFormattedText(input) {
  let results = []
  let i = 0

  while (i < input.length) {
    let lineBreakCount = 0, spaceCount = 0, lineText = ''

    while (isCRLFChar(input[i])) {
      lineBreakCount += !isLineFeed(input[i]) ? 1 : 0
      i++
    }
    while (input[i] === ' ') {
      spaceCount++
      i++
    }
    while (i < input.length && !isCRLFChar(input[i])) {
      lineText += input[i]
      i++
    }

    if (lineText) {
      results.push([lineBreakCount, spaceCount / 2, lineText])
    }
  }

  return results
}

module.exports = parseFormattedText