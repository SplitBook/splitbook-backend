const redis = require('../redis');
const knex = require('../database');
const EnumConfigs = require('./enums/EnumConfigs');

function getConfig(key) {
  return new Promise((resolve, reject) => {
    redis.get(key, (err, data) => {
      if (err) throw reject(err);

      if (data) {
        return resolve(convertToArray(data, key));
      }

      knex('configs')
        .select('value')
        .where({ key })
        .first()
        .then((config) => {
          if (config) {
            redis.setex(key, 3600, config.value);
            return resolve(convertToArray(config.value, key));
          }

          throw 'Config not found';
        })
        .catch((err) => reject(err));
    });
  });
}

function convertToArray(data, key = '') {
  const values = String(data)
    .split(',')
    .map((value) => {
      value = value.trim();
      return value.match(/^\d*$/) ? parseInt(value) : value;
    });

  return values.length > 1 ||
    Object.values(EnumConfigs).find((conf) => conf.key === key).array
    ? values
    : values[0];
}

async function setConfig(key, value) {
  await knex('configs')
    .where({ key })
    .update({ value: String(value) });
  redis.setex(key, 3600, value);
  return value;
}

module.exports = { getConfig, setConfig, EnumConfigs };
