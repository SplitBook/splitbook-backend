const knex = require('../database');
const { softDelete, softUpdate } = require('../utils/DatabaseOperations');

module.exports = {
  async index(req, res, next) {
    const schoolYears = await knex('school_years')
      .select('*')
      .whereNull('deleted_at')
      .orderBy('school_year');

    return res.json(schoolYears);
  },

  async store(req, res, next) {
    const { school_year } = req.body;

    try {
      await knex('school_years').insert({ school_year });
      return res.status(201).send();
    } catch (err) {
      return res.status(406).json(err);
    }
  },

  async update(req, res) {
    const { id } = req.params;
    const { school_year, active } = req.body;

    try {
      return res
        .status(await softUpdate('school_years', id, { school_year, active }))
        .send();
    } catch (err) {
      return res.status(406).json(err);
    }
  },

  async delete(req, res) {
    const { id } = req.params;

    return res.status(await softDelete('school_years', id)).send();
  },
};
