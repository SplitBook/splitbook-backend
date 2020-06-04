const knex = require('../database');
const { softDelete, softUpdate } = require('../utils/DatabaseOperations');

module.exports = {
  async index(req, res, next) {
    const school_enrollments = await knex('school_enrollments')
      .select('*')
      .whereNull('deleted_at')
      .orderBy('created_at');

    return res.json(school_enrollments);
  },

  async store(req, res, next) {
    const { student_id, guardian_id, school_year_id, class_id } = req.body;

    try {
      const [schoolEnrollment] = await knex('school_enrollments')
        .insert({
          student_id,
          guardian_id,
          school_year_id,
          class_id,
        })
        .returning('*');

      return res.json(schoolEnrollment);
    } catch (err) {
      return res.status(406).json(err);
    }
  },

  async update(req, res) {
    const { id } = req.params;
    const {
      student_id,
      guardian_id,
      school_year_id,
      class_id,
      active,
    } = req.body;

    try {
      const { statusCode, data } = await softUpdate('school_enrollments', id, {
        student_id,
        guardian_id,
        school_year_id,
        class_id,
        active,
      });

      return res.status(statusCode).json(data);
    } catch (err) {
      return res.status(406).json(err);
    }
  },

  async delete(req, res) {
    const { id } = req.params;

    return res.status(await softDelete('school_enrollments', id)).send();
  },
};
