const config = require('./config')

const pgp = require('pg-promise')()

const db = pgp(config.db)

module.exports = db