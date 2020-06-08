const knex = require('../database');
const { softDelete, softUpdate } = require('../utils/DatabaseOperations');
const {
  createPagination,
  getFiltersFromObject,
} = require('../utils/PaginatorUtils');

module.exports = {
  /**
   * Search by:
   * Student Name
   * Guardian Name
   * Student Number
   * Class
   * School Year
   * Requisition State
   */
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
      state_id,
    } = req.query;

    const filter = getFiltersFromObject({
      school_year_id: current_school_year ? req.school_year_id : school_year_id,
      guardian_id,
      student_id,
      class_id,
      state_id,
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
            'requisitions.id as requisition_id',
            'requisitions.state_id',
            'requisition_states.state',
          ],
          filter,
          searchColumns: [
            'students.name',
            'guardians.name',
            'students.number',
            'class',
            'school_year',
            'requisition_states.state',
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
          leftJoins: [
            [
              'requisitions',
              'requisitions.school_enrollment_id',
              'school_enrollments.id',
            ],
            [
              'requisition_states',
              'requisition_states.id',
              'requisitions.state_id',
            ],
          ],
        }
      );

      return res.json(pagination);
    } catch (err) {
      return res.status(406).json(err);
    }
  },

  async get(req, res) {
    const { id } = req.params;

    const schoolEnrollment = await knex('school_enrollments')
      .select(
        'school_enrollments.*',
        'students.name as student_name',
        'students.number as student_number',
        'guardians.name as guardian_name',
        'general_classes.class',
        'school_years.school_year',
        'requisitions.id as requisition_id',
        'requisitions.state_id',
        'requisition_states.state'
      )
      .where('school_enrollments.id', id)
      .whereNull('school_enrollments.deleted_at')
      .innerJoin('students', 'students.id', 'school_enrollments.student_id')
      .innerJoin('guardians', 'guardians.id', 'school_enrollments.guardian_id')
      .innerJoin(
        'school_years',
        'school_years.id',
        'school_enrollments.school_year_id'
      )
      .innerJoin(
        'general_classes',
        'general_classes.id',
        'school_enrollments.class_id'
      )
      .leftJoin(
        'requisitions',
        'requisitions.school_enrollment_id',
        'school_enrollments.id'
      )
      .leftJoin(
        'requisition_states',
        'requisition_states.id',
        'requisitions.state_id'
      )
      .first();

    if (schoolEnrollment) {
      schoolEnrollment.book_requisitions = [];

      if (schoolEnrollment.requisition_id) {
        schoolEnrollment.book_requisitions = await knex('book_requisitions')
          .select(
            'book_requisitions.*',
            'books.isbn',
            'books.cover',
            'books.subject_id',
            'school_subjects.school_subject',
            'books.name'
          )
          .where(
            'book_requisitions.requisition_id',
            schoolEnrollment.requisition_id
          )
          .whereNull('book_requisitions.deleted_at')
          .innerJoin(
            'adopted_books',
            'adopted_books.id',
            'book_requisitions.adopted_book_id'
          )
          .innerJoin('books', 'books.isbn', 'adopted_books.book_isbn')
          .leftJoin('school_subjects', 'school_subjects.id', 'books.subject_id')
          .orderBy('books.subject_id', 'books.name');
      }

      return res.json(schoolEnrollment);
    }

    return res.status(404).json({ error: 'School Enrollment not found.' });
  },

  async store(req, res, next) {
    const { student_id, guardian_id, school_year_id, class_id } = req.body;

    try {
      const [schoolEnrollment] = await knex('school_enrollments')
        .insert({
          student_id,
          guardian_id,
          school_year_id: school_year_id || req.school_year_id,
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
