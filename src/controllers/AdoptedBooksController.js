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
      let pagination = await createPagination(
        'adopted_books',
        { search, page, limit },
        {
          selects: [
            'adopted_books.*',
            'books.name',
            'books.publishing_company',
            'books.cover',
            'books.code',
            'resumes.school_subject_id',
            'resumes.school_year_id',
            'resumes.class_id',
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
            'adopted_books.book_isbn',
            'books.name',
            'books.code',
            'books.publishing_company',
          ],
          innerJoins: [
            ['resumes', 'resumes.id', 'adopted_books.resume_id'],
            ['books', 'books.isbn', 'adopted_books.book_isbn'],
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

      pagination.data = pagination.data.map((adopted_book) => {
        adopted_book.cover = IpUtils.getImagesAddress(adopted_book.cover);
        return adopted_book;
      });

      return res.json(pagination);
    } catch (err) {
      return res.status(406).json(err);
    }
  },

  async get(req, res) {
    const { id } = req.params;

    let adoptedBook = await knex('adopted_books')
      .select(
        'adopted_books.*',
        'books.name',
        'books.publishing_company',
        'books.cover',
        'books.code',
        'resumes.school_subject_id',
        'resumes.school_year_id',
        'resumes.class_id',
        'school_subjects.school_subject',
        'general_classes.class',
        'school_years.school_year'
      )
      .where('adopted_books.id', id)
      .whereNull('adopted_books.deleted_at')
      .innerJoin('resumes', 'resumes.id', 'adopted_books.resume_id')
      .innerJoin('books', 'books.isbn', 'adopted_books.book_isbn')
      .innerJoin('general_classes', 'resumes.class_id', 'general_classes.id')
      .innerJoin('school_years', 'school_years.id', 'resumes.school_year_id')
      .innerJoin(
        'school_subjects',
        'school_subjects.id',
        'resumes.school_subject_id'
      )
      .first();

    if (adoptedBook) {
      adoptedBook.cover = IpUtils.getImagesAddress(adoptedBook.cover);

      return res.json(adoptedBook);
    }

    return res.status(404).json({ error: 'Adopted Book not found.' });
  },

  async store(req, res, next) {
    const { resume_id, book_isbn } = req.body;

    try {
      const [adoptedBook] = await knex('adopted_books')
        .insert({
          resume_id,
          book_isbn,
        })
        .returning('*');

      return res.json(adoptedBook);
    } catch (err) {
      return res.status(406).json(err);
    }
  },

  async update(req, res) {
    const { id } = req.params;
    const { resume_id, book_isbn, active } = req.body;

    try {
      const { statusCode, data } = await softUpdate('adopted_books', id, {
        resume_id,
        book_isbn,
        active,
      });

      return res.status(statusCode).json(data);
    } catch (err) {
      return res.status(406).json(err);
    }
  },

  async delete(req, res) {
    const { id } = req.params;

    return res.status(await softDelete('adopted_books', id)).send();
  },
};
