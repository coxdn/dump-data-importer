const fs = require('fs')
const initQueries = fs.readFileSync('init-queries.sql', 'utf8')
const copyConfig = () => {
  if (!fs.existsSync('config.json')) {
    const exampleConfig = fs.readFileSync('config.example.json', 'utf8')
    fs.writeFileSync('config.json', exampleConfig, 'utf8')
  }
}

const config = require('./config')

const runInitQueries = async () => {
  const pgp = require('pg-promise')()
  const connection = {
    host: config.db.host,
    port: config.db.port,
    user: config.db.user,
    password: config.db.password,
    database: config.db.database
  }

  const db = pgp(connection)

  try {
    await db.none(initQueries)
    console.log('Initialization queries executed successfully.')
  } catch (error) {
    console.error('Error executing initialization queries:', error)
  } finally {
    pgp.end()
  }
}

copyConfig()
runInitQueries()
