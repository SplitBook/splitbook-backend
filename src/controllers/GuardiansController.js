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

  async get(req, res) {
    const { id } = req.params;

    const guardian = await knex('guardians')
      .select('guardians.*')
      .where('id', id)
      .whereNull('guardians.deleted_at')
      .first();

    if (guardian) {
      const students = await knex('school_enrollments')
        .select('students.*')
        .distinct()
        .where('school_enrollments.guardian_id', id)
        .innerJoin('students', 'students.id', 'school_enrollments.student_id')
        .whereNull('school_enrollments.deleted_at');

      guardian.students = students;

      return res.json(guardian);
    }

    return res.status(404).json({ error: 'Guardian not found.' });
  },

  async store(req, res, next) {
    const { name, user_id } = req.body;

    try {
      const [guardian] = await knex('guardians')
        .insert({ name, user_id })
        .returning('*');

      return res.json(guardian);
    } catch (err) {
      return res.status(406).json(err);
    }
  },

  async update(req, res) {
    const { id } = req.params;
    const { name, user_id, active } = req.body;

    try {
      const { statusCode, data } = await softUpdate('guardians', id, {
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

    return res.status(await softDelete('guardians', id)).send();
  },
};
