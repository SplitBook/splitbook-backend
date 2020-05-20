const dbConfig = require('../../knexfile');

const configuration =
  process.env.NODE_ENV === 'test' ? dbConfig.tests : dbConfig.development;

const knex = require('knex')(configuration);

module.exports = knex;
