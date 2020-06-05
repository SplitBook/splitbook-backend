const knex = require('../database');
const { softDelete, softUpdate } = require('../utils/DatabaseOperations');

module.exports = {
  async index(req, res, next) {
    const { search, page, limit } = req.query;

    let teachers = await knex
      .select(
        'teachers.*',
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
      .whereNull('teachers.deleted_at')
      .from('teachers')
      .leftJoin('users', 'users.id', 'teachers.user_id')
      .limit(limit)
      .offset((page - 1) * limit)
      .orderBy('teachers.name');

    const { total_count: totalCount } = await knex('teachers')
      .count('*', { as: 'total_count' })
      .whereNull('deleted_at')
      .first();

    return res.json({
      data: teachers,
      page,
      length: teachers.length,
      limit,
      totalCount,
    });
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
