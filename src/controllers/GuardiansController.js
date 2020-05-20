const knex = require('../database');
const { softDelete, softUpdate } = require('../utils/DatabaseOperations');

module.exports = {
  async index(req, res, next) {
    const guardians = await knex('guardians')
      .select('*')
      .whereNull('deleted_at')
      .orderBy('id');

    return res.json(guardians);
  },

  async store(req, res, next) {
    const { name, user_id } = req.body;

    try {
      await knex('guardians').insert({ name, user_id });
      return res.status(201).send();
    } catch (err) {
      return res.status(406).json(err);
    }
  },

  async update(req, res) {
    const { id } = req.params;
    const { name, user_id, active } = req.body;

    try {
      return res
        .status(
          await softUpdate('guardians', id, {
            name,
            user_id,
            active,
          })
        )
        .send();
    } catch (err) {
      return res.status(406).json(err);
    }
  },

  async delete(req, res) {
    const { id } = req.params;

    return res.status(await softDelete('guardians', id)).send();
  },
};
