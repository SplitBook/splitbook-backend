const Sequelize = require('sequelize');
const dbConfig = require('../config/database');

const Handbook = require('../models/Handbook');

const connection = new Sequelize(dbConfig);

Handbook.init(connection);

module.exports = connection;