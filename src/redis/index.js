const redis = require('redis');
const redisConfig = require('../config/redisConfig');

const client = redis.createClient(redisConfig.port, redisConfig.host, { password: redisConfig.password });

module.exports = client;
