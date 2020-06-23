const knex = require('../database');
const {
  createPagination,
  getFiltersFromObject,
} = require('../utils/PaginatorUtils');

module.exports = {
  /**
   * Search by:
   * School Year
   * Class
   */
  async index(req, res, next) {
    const {
      search,
      page,
      limit,
      orderBy,
      desc,
      school_year_id,
      class_id,
      current_school_year,
    } = req.query;

    const filter = getFiltersFromObject({
      school_year_id: current_school_year ? req.school_year_id : school_year_id,
      class_id,
    });

    try {
      const pagination = await createPagination(
        'classes',
        { search, page, limit },
        {
          orderBy: orderBy || ['school_year', 'class'],
          desc,
          filter,
          selects: [
            'classes.*',
            'school_years.school_year',
            'general_classes.class',
            'teachers.name',
          ],
          searchColumns: ['general_classes.class', 'school_years.school_year'],
          innerJoins: [
            ['school_years', 'school_years.id', 'classes.school_year_id'],
            ['general_classes', 'general_classes.id', 'classes.class_id'],
          ],
          leftJoins: [['teachers', 'teachers.id', 'classes.head_class_id']],
        }
      );

      return res.json(pagination);
    } catch (err) {
      return res.status(406).json(err);
    }
  },

  async get(req, res) {
    const { school_year_id, class_id } = req.params;

    const classObject = await knex('classes')
      .select(
        'classes.*',
        'school_years.school_year',
        'general_classes.class',
        'teachers.name'
      )
      .where('classes.school_year_id', school_year_id)
      .where('classes.class_id', class_id)
      .whereNull('classes.deleted_at')
      .innerJoin('school_years', 'school_years.id', 'classes.school_year_id')
      .innerJoin('general_classes', 'general_classes.id', 'classes.class_id')
      .leftJoin('teachers', 'teachers.id', 'classes.head_class_id')
      .first();

    if (classObject) {
      const students = await knex('students')
        .select(
          'school_enrollments.id as school_enrollment_id',
          'students.*',
          'guardians.id as guardian_id',
          'guardians.name as guardian_name'
        )
        .innerJoin(
          'school_enrollments',
          'school_enrollments.student_id',
          'students.id'
        )
        .innerJoin(
          'guardians',
          'guardians.id',
          'school_enrollments.guardian_id'
        )
        .whereNull('school_enrollments.deleted_at')
        .where('school_enrollments.school_year_id', school_year_id)
        .where('school_enrollments.class_id', class_id);

      const resumes = await knex('resumes')
        .select('resumes.*', 'school_subjects.school_subject')
        .innerJoin(
          'school_subjects',
          'resumes.school_subject_id',
          'school_subjects.id'
        )
        .where('resumes.class_id', class_id)
        .where('resumes.school_year_id', school_year_id)
        .whereNull('resumes.deleted_at')
        .orderBy('school_subjects.school_subject');

      return res.json({ ...classObject, resumes, students });
    }

    return res.status(404).json({ error: 'Class not found.' });
  },

  async store(req, res, next) {
    const { class_id, school_year_id, head_class_id } = req.body;

    try {
      const [classObject] = await knex('classes')
        .insert({
          class_id,
          school_year_id: school_year_id || req.school_year_id,
          head_class_id,
        })
        .returning('*');

      return res.json(classObject);
    } catch (err) {
      return res.status(406).json(err);
    }
  },

  async update(req, res) {
    const { head_class_id } = req.body;
    const { class_id, school_year_id } = req.params;
    let result;

    try {
      const [data] = await knex('classes')
        .update({ head_class_id, updated_at: new Date() })
        .where({ class_id, school_year_id })
        .whereNull('deleted_at')
        .returning('*');

      if (data) {
        result = 202;
      } else {
        result = 404;
      }
      return res.status(result).json(data);
    } catch (err) {
      return res.status(406).json(err);
    }
  },

  async delete(req, res) {
    const { class_id, school_year_id } = req.params;

    try {
      const result = await knex('classes')
        .del()
        // .update({ deleted_at: new Date() })
        .where({ class_id, school_year_id });
      // .whereNull('deleted_at');

      if (result > 0) {
        result = 204;
      } else {
        result = 404;
      }
      return res.status(result).send();
    } catch (err) {
      return res.status(406).send();
    }
  },
};
