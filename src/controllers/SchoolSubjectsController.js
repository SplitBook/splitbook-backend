const knex = require('../database');
const { softDelete, softUpdate } = require('../utils/DatabaseOperations');

module.exports = {
  async index(req, res, next) {
    const school_subjects = await knex('school_subjects')
      .select('*')
      .whereNull('deleted_at')
      .orderBy('school_subject');

    return res.json(school_subjects);
  },

  async store(req, res, next) {
    const { school_subject } = req.body;

    try {
      await knex('school_subjects').insert({ school_subject });
      return res.status(201).send();
    } catch (err) {
      return res.status(406).json(err);
    }
  },

  async update(req, res) {
    const { id } = req.params;
    const { school_subject, active } = req.body;

    return res
      .status(
        await softUpdate('school_subjects', id, { school_subject, active })
      )
      .send();
  },

  async delete(req, res) {
    const { id } = req.params;

    return res.status(await softDelete('school_subjects', id)).send();
  },
};
