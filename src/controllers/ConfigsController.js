const knex = require('../database');
const Config = require('../utils/ConfigUtils');

module.exports = {
  async index(req, res) {
    const configs = await knex('configs').select('*');

    return res.json(configs);
  },

  async update(req, res) {
    let { key, value } = req.body;

    const configKeys = Object.values(Config.EnumConfigs).map(
      ({ key: keyValue }) => keyValue
    );

    console.log('config Keys', configKeys);

    key = configKeys.find((elm) => elm === key);

    if (!key) {
      return res.status(404).json({ error: 'Config not found.' });
    }

    try {
      Config.setConfig(key, value);

      return res.status(204).send();
    } catch (err) {
      return res.status(406).json(err);
    }
  },
};
