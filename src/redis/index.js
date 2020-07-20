const redis = require('redis');
const redisConfig = require('../config/redisConfig');

try {
  const client = redis.createClient(redisConfig.port, redisConfig.host);
  module.exports = client;
} catch {
  module.exports = null;
}
