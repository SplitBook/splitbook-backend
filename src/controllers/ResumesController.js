const knex = require('../database');
const { softDelete, softUpdate } = require('../utils/DatabaseOperations');
const {
  createPagination,
  getFiltersFromObject,
} = require('../utils/PaginatorUtils');
const IpUtils = require('../utils/IpUtils');

module.exports = {
  async index(req, res, next) {
    const {
      search,
      page,
      limit,
      orderBy,
      desc,
      school_subject_id,
      school_year_id,
      class_id,
      current_school_year,
    } = req.query;

    const filter = getFiltersFromObject({
      school_subject_id,
      school_year_id: current_school_year ? req.school_year_id : school_year_id,
      class_id,
    });

    try {
      const pagination = await createPagination(
        'resumes',
        { search, page, limit },
        {
          selects: [
            'resumes.*',
            'school_subjects.school_subject',
            'general_classes.class',
            'school_years.school_year',
          ],
          orderBy: orderBy || ['resumes.school_year_id', 'resumes.class_id'],
          desc: orderBy ? desc : true,
          filter,
          searchColumns: [
            'general_classes.class',
            'school_years.school_year',
            'school_subjects.school_subject',
          ],
          innerJoins: [
            ['general_classes', 'resumes.class_id', 'general_classes.id'],
            ['school_years', 'school_years.id', 'resumes.school_year_id'],
            [
              'school_subjects',
              'school_subjects.id',
              'resumes.school_subject_id',
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

    let resume = await knex('resumes')
      .select(
        'resumes.*',
        'school_subjects.school_subject',
        'general_classes.class',
        'school_years.school_year'
      )
      .where('resumes.id', id)
      .whereNull('resumes.deleted_at')
      .innerJoin('general_classes', 'resumes.class_id', 'general_classes.id')
      .innerJoin('school_years', 'school_years.id', 'resumes.school_year_id')
      .innerJoin(
        'school_subjects',
        'school_subjects.id',
        'resumes.school_subject_id'
      )
      .first();

    if (resume) {
      resume.adopted_books = await knex('adopted_books')
        .select(
          'adopted_books.*',
          'books.name',
          'books.publishing_company',
          'books.cover',
          'books.code',
          'books.subject_id',
          'school_subjects.school_subject'
        )
        .where('adopted_books.resume_id', id)
        .whereNull('adopted_books.deleted_at')
        .innerJoin('books', 'books.isbn', 'adopted_books.book_isbn')
        .innerJoin('school_subjects', 'school_subjects.id', 'books.subject_id');

      resume.adopted_books = resume.adopted_books.map((adoptedBook) => {
        adoptedBook.cover = IpUtils.getImagesAddress(adoptedBook.cover);
        return adoptedBook;
      });

      return res.json(resume);
    }

    return res.status(404).json({ error: 'Resume not found.' });
  },

  async store(req, res, next) {
    const { school_subject_id, class_id, school_year_id } = req.body;

    try {
      const [resume] = await knex('resumes')
        .insert({
          school_subject_id,
          class_id,
          school_year_id: school_year_id || req.school_year_id,
        })
        .returning('*');

      return res.json(resume);
    } catch (err) {
      return res.status(406).json(err);
    }
  },

  async update(req, res) {
    const { id } = req.params;
    const { active, school_subject_id, class_id, school_year_id } = req.body;

    try {
      const { statusCode, data } = await softUpdate('resumes', id, {
        active,
        school_subject_id,
        class_id,
        school_year_id,
      });

      return res.status(statusCode).json(data);
    } catch (err) {
      return res.status(406).json(err);
    }
  },

  async delete(req, res) {
    const { id } = req.params;

    return res.status(await softDelete('resumes', id)).send();
  },
};
