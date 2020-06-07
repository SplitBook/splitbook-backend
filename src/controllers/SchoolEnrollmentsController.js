const knex = require('../database');
const { softDelete, softUpdate } = require('../utils/DatabaseOperations');
const {
  createPagination,
  getFiltersFromObject,
} = require('../utils/PaginatorUtils');

module.exports = {
  async index(req, res, next) {
    const {
      search,
      page,
      limit,
      orderBy,
      desc,
      school_year_id,
      current_school_year,
      guardian_id,
      student_id,
      class_id,
    } = req.query;

    const filter = getFiltersFromObject({
      school_year_id: current_school_year ? req.school_year_id : school_year_id,
      guardian_id,
      student_id,
      class_id,
    });

    try {
      const pagination = await createPagination(
        'school_enrollments',
        { search, page, limit },
        {
          orderBy: orderBy || 'school_enrollments.created_at',
          desc,
          selects: [
            'school_enrollments.*',
            'students.name as student_name',
            'students.number as student_number',
            'guardians.name as guardian_name',
            'general_classes.class',
            'school_years.school_year',
          ],
          filter,
          searchColumns: [
            'students.name',
            'guardians.name',
            'students.number',
            'class',
            'school_year',
          ],
          innerJoins: [
            ['students', 'students.id', 'school_enrollments.student_id'],
            ['guardians', 'guardians.id', 'school_enrollments.guardian_id'],
            [
              'school_years',
              'school_years.id',
              'school_enrollments.school_year_id',
            ],
            [
              'general_classes',
              'general_classes.id',
              'school_enrollments.class_id',
            ],
          ],
        }
      );

      return res.json(pagination);
    } catch (err) {
      return res.status(406).json(err);
    }
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
