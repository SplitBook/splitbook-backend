const knex = require('../database');
const { softDelete, softUpdate } = require('../utils/DatabaseOperations');

module.exports = {
  async index(req, res, next) {
    const resumes = await knex('resumes')
      .select('*')
      .whereNull('deleted_at')
      .orderBy('id');

    return res.json(resumes);
  },

  async store(req, res, next) {
    const { school_subject_id, class_id, school_year_id } = req.body;

    try {
      const [resume] = await knex('resumes')
        .insert({ school_subject_id, class_id, school_year_id })
        .returning('*');

      return res.json(resume);
    } catch (err) {
      return res.status(406).json(err);
    }
  },

  async update(req, res) {
    const { id } = req.params;
    const { active } = req.body;

    try {
      const { statusCode, data } = await softUpdate('resumes', id, {
        active,
      });

      return res.status(statusCode).json(data);
    } catch (err) {
      return res.status(406).json(err);
    }
  },

  async delete(req, res) {
    const { id } = req.params;

    return res.status(await softDelete('resumes', id)).send();
  },
};
