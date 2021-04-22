const dbConfig = require('../../knexfile')

const configuration = dbConfig.development

const knex = require('knex')(configuration)

module.exports = knex
