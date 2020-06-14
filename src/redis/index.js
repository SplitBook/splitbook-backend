const redis = require('redis');
const redisConfig = require('../config/redisConfig');

const client = redis.createClient(redisConfig.port, redisConfig.host);

module.exports = client;
