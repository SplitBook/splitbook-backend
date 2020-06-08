const knex = require('../database');
const { softDelete, softUpdate } = require('../utils/DatabaseOperations');
const Config = require('../utils/ConfigUtils');
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
        'requisitions',
        { search, page, limit },
        {
          orderBy: orderBy || 'requisitions.created_at',
          desc: orderBy ? desc : true,
          selects: [
            'requisitions.*',
            'students.id as student_id',
            'students.name as student_name',
            'students.number as student_number',
            'guardians.name as guardian_name',
            'guardians.id as guardian_id',
            'general_classes.class',
            'school_years.school_year',
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
            [
              'school_enrollments',
              'requisitions.school_enrollment_id',
              'school_enrollments.id',
            ],
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

    const requisition = await knex('requisitions')
      .select(
        'requisitions.*',
        'students.id as student_id',
        'students.name as student_name',
        'students.number as student_number',
        'guardians.name as guardian_name',
        'guardians.id as guardian_id',
        'general_classes.class',
        'school_years.school_year',
        'requisition_states.state'
      )
      .where('requisitions.id', id)
      .whereNull('requisitions.deleted_at')
      .innerJoin(
        'school_enrollments',
        'requisitions.school_enrollment_id',
        'school_enrollments.id'
      )
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
        'requisition_states',
        'requisition_states.id',
        'requisitions.state_id'
      )
      .first();

    if (requisition) {
      requisition.book_requisitions = await knex('book_requisitions')
        .select(
          'book_requisitions.*',
          'books.isbn',
          'books.cover',
          'books.subject_id',
          'school_subjects.school_subject',
          'books.name',
          'requisitions_physical_book.delivery_date',
          'requisitions_physical_book.return_date'
        )
        .where('book_requisitions.requisition_id', id)
        .whereNull('book_requisitions.deleted_at')
        .whereNull('requisitions_physical_book.deleted_at')
        .innerJoin(
          'adopted_books',
          'adopted_books.id',
          'book_requisitions.adopted_book_id'
        )
        .innerJoin('books', 'books.isbn', 'adopted_books.book_isbn')
        .leftJoin('school_subjects', 'school_subjects.id', 'books.subject_id')
        .leftJoin(
          'requisitions_physical_book',
          'requisitions_physical_book.book_requisition_id',
          'book_requisitions.id'
        )
        .orderBy('books.subject_id', 'books.name');

      return res.json(requisition);
    }

    return res.status(404).json({ error: 'Requisition not found.' });
  },

  async store(req, res, next) {
    const { school_enrollment_id, state_id } = req.body;

    const defaultStateId = parseInt(
      await Config.getConfig(
        Config.EnumConfigs.DEFAULT_REQUISITION_STATE_ID.key
      )
    );

    try {
      const [requisition] = await knex('requisitions')
        .insert({
          school_enrollment_id,
          state_id: state_id || defaultStateId,
        })
        .returning('*');

      return res.json(requisition);
    } catch (err) {
      return res.status(406).json(err);
    }
  },

  async update(req, res) {
    const { id } = req.params;
    const { school_enrollment_id, state_id, active } = req.body;

    try {
      const { statusCode, data } = await softUpdate('requisitions', id, {
        school_enrollment_id,
        state_id,
        active,
      });

      return res.status(statusCode).json(data);
    } catch (err) {
      return res.status(406).json(err);
    }
  },

  async delete(req, res) {
    const { id } = req.params;

    return res.status(await softDelete('requisitions', id)).send();
  },
};
