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
      const [teacher] = await knex('teachers')
        .insert({ name, user_id })
        .returning('*');

      return res.json(teacher);
    } catch (err) {
      return res.status(406).json(err);
    }
  },

  async update(req, res) {
    const { id } = req.params;
    const { name, user_id, active } = req.body;

    try {
      const { statusCode, data } = await softUpdate('teachers', id, {
        name,
        user_id,
        active,
      });

      return res.status(statusCode).json(data);
    } catch (err) {
      return res.status(406).json(err);
    }
  },

  async delete(req, res) {
    const { id } = req.params;

    return res.status(await softDelete('teachers', id)).send();
  },
};
