const knex = require('../database');
const { softDelete, softUpdate } = require('../utils/DatabaseOperations');

module.exports = {
  async index(req, res, next) {
    const users = await knex('users')
      .select(
        'id, username, email, charge_id, created_at, updated_at, deleted_at, active'
      )
      .whereNull('deleted_at')
      .orderBy('id');

    return res.json(users);
  },

  async store(req, res, next) {
    const { username, email, charge_id } = req.body;

    try {
      await knex('users').insert({ username, email, charge_id });
      return res.status(201).send();
    } catch (err) {
      return res.status(406).json(err);
    }
  },

  async update(req, res) {
    const { id } = req.params;
    const { username, charge_id, active } = req.body;

    return res
      .status(
        await softUpdate('users', id, { username, email, charge_id, active })
      )
      .send();
  },

  async delete(req, res) {
    const { id } = req.params;

    return res.status(await softDelete('users', id)).send();
  },
};
