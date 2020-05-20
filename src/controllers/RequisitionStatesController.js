const knex = require('../database');
const { softDelete, softUpdate } = require('../utils/DatabaseOperations');

module.exports = {
  async index(req, res, next) {
    const requisition_states = await knex('requisition_states')
      .select('*')
      .whereNull('deleted_at')
      .orderBy('state');

    return res.json(requisition_states);
  },

  async store(req, res, next) {
    const { state } = req.body;

    try {
      await knex('requisition_states').insert({ state });
      return res.status(201).send();
    } catch (err) {
      return res.status(406).json(err);
    }
  },

  async update(req, res) {
    const { id } = req.params;
    const { state, active } = req.body;

    try {
      return res
        .status(await softUpdate('requisition_states', id, { state, active }))
        .send();
    } catch (err) {
      return res.status(406).json(err);
    }
  },

  async delete(req, res) {
    const { id } = req.params;

    return res.status(await softDelete('requisition_states', id)).send();
  },
};
