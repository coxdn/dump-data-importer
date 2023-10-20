const fs = require('fs').promises
const db = require('./db')
const parseFormattedText = require('./helpers/parse-formatted-text')
const convertToObject = require('./helpers/text-to-object')
const objectToSql = require('./helpers/object-to-sql')

const filePath = 'dump.txt'

async function main() {
  let connection

  try {
    const fileContent = await fs.readFile(filePath, 'utf8')
    const parsedContent = parseFormattedText(fileContent)
    const parsedObject = convertToObject(parsedContent)
    const sqlQueries = objectToSql(parsedObject)

    connection = await db

    await connection.query('BEGIN')

    for (const query of sqlQueries) {
      await connection.query(query.template, query.params)
    }

    await connection.query('COMMIT')

    console.log('All SQL queries executed successfully.')
  } catch (err) {
    await connection.query('ROLLBACK')

    console.error('Error:', err)
  } finally {
    if (connection) {
      await connection.$pool.end()
    }
  }
}

main()
