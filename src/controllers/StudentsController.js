const knex = require('../database');
const { softDelete, softUpdate } = require('../utils/DatabaseOperations');

module.exports = {
  async index(req, res, next) {
    const students = await knex('students')
      .select('*')
      .whereNull('deleted_at')
      .orderBy('number');

    return res.json(students);
  },

  async store(req, res, next) {
    const { name, number, photo, born_date } = req.body;

    try {
      await knex('students').insert({ name, number, photo, born_date });
      return res.status(201).send();
    } catch (err) {
      return res.status(406).json(err);
    }
  },

  async update(req, res) {
    const { id } = req.params;
    const { name, photo, born_date, active } = req.body;

    return res
      .status(
        await softUpdate('students', id, {
          name,
          photo,
          born_date,
          active,
        })
      )
      .send();
  },

  async delete(req, res) {
    const { id } = req.params;

    return res.status(await softDelete('students', id)).send();
  },
};
