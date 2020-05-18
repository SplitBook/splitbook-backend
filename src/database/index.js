const dbConfig = require('../../knexfile');

const configuration =
  process.env.NODE_ENV === 'test' ? dbConfig.test : dbConfig.development;

const knex = require('knex')(configuration);

module.exports = knex;
