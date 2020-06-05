const knex = require('../database');
const { softDelete, softUpdate } = require('../utils/DatabaseOperations');

module.exports = {
  /**
   * Search by:
   * Name
   * Email
   * Phone
   * Born Date
   * Username
   */
  async index(req, res, next) {
    const { search, page, limit } = req.query;

    let guardians = await knex
      .select(
        'guardians.*',
        'users.email',
        'users.phone',
        'users.born_date',
        'users.photo',
        'users.username'
      )
      .where('name', 'like', `%${search}%`)
      .orWhere('users.email', 'like', `%${search}%`)
      .orWhere('users.phone', 'like', `%${search}%`)
      .orWhere('users.born_date', 'like', `%${search}%`)
      .orWhere('users.username', 'like', `%${search}%`)
      .whereNull('guardians.deleted_at')
      .from('guardians')
      .leftJoin('users', 'users.id', 'guardians.user_id')
      .limit(limit)
      .offset((page - 1) * limit)
      .orderBy('guardians.name');

    const { total_count: totalCount } = await knex('guardians')
      .count('*', { as: 'total_count' })
      .whereNull('deleted_at')
      .first();

    return res.json({
      data: guardians,
      page,
      length: guardians.length,
      limit,
      totalCount,
    });
  },

  async get(req, res) {
    const { id } = req.params;

    const guardian = await knex('guardians')
      .select(
        'guardians.*',
        'users.email',
        'users.phone',
        'users.born_date',
        'users.photo',
        'username'
      )
      .where('guardians.id', id)
      .leftJoin('users', 'users.id', 'guardians.user_id')
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
