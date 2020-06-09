const knex = require('../database');
const { softDelete, softUpdate } = require('../utils/DatabaseOperations');
const {
  createPagination,
  getFiltersFromObject,
} = require('../utils/PaginatorUtils');
const IpUtils = require('../utils/IpUtils');

module.exports = {
  async index(req, res, next) {
    const { school_enrollment_id, school_year_id, class_id } = req.query;

    if (!school_enrollment_id && !class_id) {
      return res.status(400).json({
        error:
          'Invalid query parameters. Please provide school_enrollment_id or class_id (and school_year_id).',
      });
    }

    let filter = {
      school_year_id: !school_enrollment_id
        ? school_year_id || req.school_year_id
        : undefined,
      class_id: school_enrollment_id ? undefined : class_id,
    };

    try {
      if (school_enrollment_id) {
        const schoolEnrollment = await knex('school_enrollments')
          .select('class_id', 'school_year_id')
          .whereNull('deleted_at')
          .where({ id: school_enrollment_id })
          .first();

        if (!schoolEnrollment) {
          return res
            .status(404)
            .json({ error: 'School Enrollment not found.' });
        }

        filter = {
          class_id: schoolEnrollment.class_id,
          school_year_id: schoolEnrollment.school_year_id,
        };
      }

      let resumes = await knex('resumes')
        .select(
          'resumes.*',
          'school_subjects.school_subject',
          'general_classes.class',
          'school_years.school_year'
        )
        .whereNull('resumes.deleted_at')
        .innerJoin('general_classes', 'resumes.class_id', 'general_classes.id')
        .innerJoin('school_years', 'school_years.id', 'resumes.school_year_id')
        .innerJoin(
          'school_subjects',
          'school_subjects.id',
          'resumes.school_subject_id'
        )
        .where(filter);

      for (let i = 0; i < resumes.length; i++) {
        resumes[i].adopted_books = await knex('adopted_books')
          .select(
            'adopted_books.*',
            'books.name',
            'books.publishing_company',
            'books.cover',
            'books.code',
            'books.subject_id',
            'school_subjects.school_subject'
          )
          .where('adopted_books.resume_id', resumes[i].id)
          .whereNull('adopted_books.deleted_at')
          .innerJoin('books', 'books.isbn', 'adopted_books.book_isbn')
          .innerJoin(
            'school_subjects',
            'school_subjects.id',
            'books.subject_id'
          );

        resumes[i].adopted_books = resumes[i].adopted_books.map(
          (adoptedBook) => {
            adoptedBook.cover = IpUtils.getImagesAddress(adoptedBook.cover);
            return adoptedBook;
          }
        );
      }

      return res.json(resumes);
    } catch (err) {
      return res.status(406).json(err);
    }
  },
};
