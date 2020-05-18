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
    const { name, phone, photo, born_date } = req.body;

    try {
      await knex('teachers').insert({ name, phone, numero, photo, born_date });
      return res.status(201).send();
    } catch (err) {
      return res.status(406).json(err);
    }
  },

  async update(req, res) {
    const { id } = req.params;
    const { name, phone, photo, born_date, active } = req.body;

    return res
      .status(
        await softUpdate('teachers', id, {
          name,
          phone,
          photo,
          born_date,
          active,
        })
      )
      .send();
  },

  async delete(req, res) {
    const { id } = req.params;

    return res.status(await softDelete('teachers', id)).send();
  },
};
