const knex = require('../database')
const { softDelete, softUpdate } = require('../utils/DatabaseOperations')
const { createPagination } = require('../utils/PaginatorUtils')
const IpUtils = require('../utils/IpUtils')

module.exports = {
  /**
   * Search by:
   * Name
   * Email
   * Phone
   * Username
   */
  async index(req, res, next) {
    const { search, page, limit, orderBy, desc } = req.query

    try {
      let pagination = await createPagination(
        'guardians',
        { search, page, limit },
        {
          orderBy: orderBy || 'guardians.name',
          desc,
          selects: [
            'guardians.*',
            'users.email',
            'users.phone',
            'users.born_date',
            'users.photo',
            'users.username'
          ],
          searchColumns: [
            'name',
            'users.email',
            'users.phone',
            'users.username'
          ],
          leftJoins: [['users', 'users.id', 'guardians.user_id']]
        }
      )

      pagination.data = pagination.data.map(guardian => {
        guardian.photo = IpUtils.getImagesAddress(guardian.photo)
        return guardian
      })

      return res.json(pagination)
    } catch (err) {
      return res.status(406).json(err)
    }
  },

  async get(req, res) {
    const { id } = req.params

    let guardian = await knex('guardians')
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
      .first()

    if (guardian) {
      guardian.photo = IpUtils.getImagesAddress(guardian.photo)

      let students = await knex('school_enrollments')
        .select(
          'students.*',
          'school_enrollments.id as school_enrollment_id',
          'school_enrollments.class_id',
          'general_classes.class'
        )
        .distinct()
        .where('school_enrollments.school_year_id', req.school_year_id)
        .where('school_enrollments.guardian_id', id)
        .innerJoin('students', 'students.id', 'school_enrollments.student_id')
        .innerJoin(
          'general_classes',
          'general_classes.id',
          'school_enrollments.class_id'
        )
        .whereNull('school_enrollments.deleted_at')

      students = students.map(student => {
        student.photo = IpUtils.getImagesAddress(student.photo)

        return student
      })

      guardian.students = students

      return res.json(guardian)
    }

    return res.status(404).json({ error: 'Guardian not found.' })
  },

  async store(req, res, next) {
    const { name, user_id } = req.body

    try {
      const [guardian] = await knex('guardians')
        .insert({ name, user_id })
        .returning('*')

      return res.json(guardian)
    } catch (err) {
      return res.status(406).json(err)
    }
  },

  async update(req, res) {
    const { id } = req.params
    const { name, user_id, active } = req.body

    try {
      const { statusCode, data } = await softUpdate('guardians', id, {
        name,
        user_id,
        active
      })

      return res.status(statusCode).json(data)
    } catch (err) {
      return res.status(406).json(err)
    }
  },

  async delete(req, res) {
    const { id } = req.params

    return res.status(await softDelete('guardians', id)).send()
  }
}
