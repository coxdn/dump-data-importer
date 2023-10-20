const fs = require('fs').promises
const db = require('./db')
const yaml = require('js-yaml')
const convertToYAML = require('./helpers/convert-to-yaml')
const objectToSql = require('./helpers/object-to-sql')

const filePath = 'dump.txt'

async function main() {
  let connection

  try {
    const fileContent = await fs.readFile(filePath, 'utf8')
    const yamlContent = convertToYAML(fileContent)
    const parsedObject = yaml.load(yamlContent)
    const sqlQueries = objectToSql(parsedObject)

    connection = await db

    await connection.query('BEGIN')

    for (const query of sqlQueries) {
      await connection.query(query.template, query.params)
    }

    await connection.query('COMMIT');

    console.log('All SQL queries executed successfully.')
  } catch (err) {
    await connection.query('ROLLBACK')

    console.error('Error:', err)
  } finally {
    if (connection) {
      await connection.$pool.end();
    }
  }
}

main()
