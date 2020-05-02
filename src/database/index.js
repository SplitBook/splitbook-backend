const dbConfig = require('../../knexfile');
const knex = require('sequelize')(dbConfig['development']);

module.exports = knex;
