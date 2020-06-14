const knex = require('../database');
const { softDelete, softUpdate } = require('../utils/DatabaseOperations');
const { createPagination } = require('../utils/PaginatorUtils');
const IpUtils = require('../utils/IpUtils');

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
    const { search, page, limit, orderBy, desc } = req.query;
    try {
      let pagination = await createPagination(
        'teachers',
        { search, page, limit },
        {
          orderBy: orderBy || 'teachers.name',
          desc,
          selects: [
            'teachers.*',
            'users.email',
            'users.phone',
            'users.born_date',
            'users.photo',
            'users.username',
          ],
          searchColumns: [
            'name',
            'users.email',
            'users.born_date',
            'users.username',
          ],
          leftJoins: [['users', 'users.id', 'teachers.user_id']],
        }
      );

      pagination.data = pagination.data.map((teacher) => {
        teacher.photo = IpUtils.getImagesAddress(teacher.photo);
        return teacher;
      });

      return res.json(pagination);
    } catch (err) {
      return res.status(406).send(err);
    }
  },

  async get(req, res) {
    const { id } = req.params;

    let teacher = await knex('teachers')
      .select(
        'teachers.*',
        'users.email',
        'users.phone',
        'users.born_date',
        'users.photo',
        'users.username'
      )
      .where('teachers.id', id)
      .whereNull('teachers.deleted_at')
      .leftJoin('users', 'users.id', 'teachers.user_id')
      .first();

    if (teacher) {
      teacher.photo = IpUtils.getImagesAddress(teacher.photo);

      teacher.classes = await knex('classes')
        .select(
          'classes.*',
          'school_years.school_year',
          'general_classes.class'
        )
        .where('classes.head_class_id', id)
        .where('school_years.id', req.school_year_id)
        .whereNull('classes.deleted_at')
        .innerJoin('school_years', 'school_years.id', 'classes.school_year_id')
        .innerJoin('general_classes', 'general_classes.id', 'classes.class_id');

      return res.json(teacher);
    }

    return res.status(404).json({ error: 'Teacher not found.' });
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
