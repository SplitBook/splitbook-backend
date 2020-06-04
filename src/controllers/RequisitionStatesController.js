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
      const [requisitionState] = await knex('requisition_states')
        .insert({ state })
        .returning('*');

      return res.json(requisitionState);
    } catch (err) {
      return res.status(406).json(err);
    }
  },

  async update(req, res) {
    const { id } = req.params;
    const { state, active } = req.body;

    const { statusCode, data } = await softUpdate('requisition_states', id, {
      state,
      active,
    });

    try {
      return res.status(statusCode).json(data);
    } catch (err) {
      return res.status(406).json(err);
    }
  },

  async delete(req, res) {
    const { id } = req.params;

    return res.status(await softDelete('requisition_states', id)).send();
  },
};
