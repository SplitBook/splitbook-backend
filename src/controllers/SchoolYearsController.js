const knex = require('../database');

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
      return next(err);
    }
  },

  async update(req, res) {
    const { id } = req.params;
    const { school_year, active } = req.body;

    await knex('school_years').update({ school_year, active }).where({ id });

    return res.send();
  },
};
