const knex = require('../database');
const { softDelete, softUpdate } = require('../utils/DatabaseOperations');

module.exports = {
  async index(req, res, next) {
    const { search, page, limit } = req.query;
    let nextPage = false;

    let books = await knex
      .select('books.*', 'school_subjects.school_subject')
      .where('isbn', 'like', `%${search}%`)
      .orWhere('name', 'like', `%${search}%`)
      .orWhere('school_subjects.school_subject', 'like', `%${search}%`)
      .orWhere('code', 'like', `%${search}%`)
      .orWhere('books.name', 'like', `%${search}%`)
      .orWhere('books.publishing_company', 'like', `%${search}%`)
      .from('books')
      .leftJoin('school_subjects', 'school_subjects.id', 'books.subject_id')
      .limit(limit + 1)
      .offset((page - 1) * limit)
      .orderBy('books.name');

    if (books.length > limit) {
      nextPage = true;
      books = books.slice(0, limit);
    }

    return res.json({
      data: books,
      page,
      pageCount: books.length,
      limit,
      nextPage,
    });
  },

  async get(req, res) {
    const { isbn } = req.params;

    const book = await knex('books')
      .select('books.*', 'school_subjects.school_subject')
      .where('isbn', isbn)
      .whereNull('books.deleted_at')
      .leftJoin('school_subjects', 'school_subjects.id', 'books.subject_id')
      .orderBy('books.name')
      .first();

    if (book) {
      return res.json(book);
    }

    return res.status(404).json({ error: 'Book not found' });
  },

  async store(req, res, next) {
    const { name, isbn, publishing_company, subject_id, code } = req.body;
    const cover = req.file ? req.file.filename : undefined;

    try {
      const [book] = await knex('books')
        .insert({
          name,
          isbn,
          publishing_company,
          subject_id,
          cover,
          code,
        })
        .returning('*');

      return res.json(book);
    } catch (err) {
      return res.status(406).json(err);
    }
  },

  async update(req, res) {
    const { isbn } = req.params;
    const { delete_cover } = req.query;
    const { name, publishing_company, subject_id, active } = req.body;
    let cover = req.file ? req.file.filename : undefined;

    if (delete_cover && cover === undefined) cover = null;

    try {
      const { statusCode, data } = await softUpdate(
        'books',
        isbn,
        {
          name,
          publishing_company,
          cover,
          subject_id,
          active,
        },
        'isbn'
      );

      return res.status(statusCode).json(data);
    } catch (err) {
      return res.status(406).json(err);
    }
  },

  async delete(req, res) {
    const { isbn } = req.params;

    return res.status(await softDelete('books', isbn, 'isbn')).send();
  },
};
