const redis = require('../redis');
const knex = require('../database');

function getConfig(key) {
  return new Promise((resolve, reject) => {
    redis.get(key, (err, data) => {
      if (err) throw reject(err);

      if (data) {
        return resolve(data);
      }

      knex('configs')
        .select('value')
        .where({ key })
        .first()
        .then(({ value }) => {
          redis.setex(key, 3600, value);
          return resolve(value);
        })
        .catch((err) => reject(err));
    });
  });
}

async function setConfig(key, value) {
  await knex('configs').update({ key, value });
  redis.setex(key, 3600, value);
  return value;
}

module.exports = { getConfig, setConfig };
