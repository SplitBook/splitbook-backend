const redis = require('redis');

const REDIS_HOST = process.env.REDIS_HOST || 'localhost';
const REDIS_PORT = process.env.REDIS_PORT || 6379;

const client = redis.createClient(REDIS_PORT, REDIS_HOST);

module.exports = client;
