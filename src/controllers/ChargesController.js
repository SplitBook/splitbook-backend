const knex = require('../database');
const { softDelete, softUpdate } = require('../utils/DatabaseOperations');

module.exports = {
  async index(req, res, next) {
    const charges = await knex('charges')
      .select('*')
      .whereNull('deleted_at')
      .orderBy('charge');

    return res.json(charges);
  },

  async store(req, res, next) {
    const { charge } = req.body;

    try {
      await knex('charges').insert({ charge });
      return res.status(201).send();
    } catch (err) {
      return res.status(406).json(err);
    }
  },

  async update(req, res) {
    const { id } = req.params;
    const { charge, active } = req.body;

    try {
      return res
        .status(await softUpdate('charges', id, { charge, active }))
        .send();
    } catch (err) {
      return res.status(406).json(err);
    }
  },

  async delete(req, res) {
    const { id } = req.params;

    return res.status(await softDelete('charges', id)).send();
  },
};
