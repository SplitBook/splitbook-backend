const knex = require('../database');
const { softDelete, softUpdate } = require('../utils/DatabaseOperations');

module.exports = {
  async index(req, res, next) {
    const teachers = await knex('teachers')
      .select('*')
      .whereNull('deleted_at')
      .orderBy('name');

    return res.json(teachers);
  },

  async store(req, res, next) {
    const { name, user_id } = req.body;

    try {
      await knex('teachers').insert({ name, user_id });
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
          await softUpdate('teachers', id, {
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

    return res.status(await softDelete('teachers', id)).send();
  },
};
