const knex = require('../database');
const { softDelete, softUpdate } = require('../utils/DatabaseOperations');
const { createPagination } = require('../utils/PaginatorUtils');
const IpUtils = require('../utils/IpUtils');

module.exports = {
  async index(req, res, next) {
    const { search, page, limit, orderBy, desc, code, subject_id } = req.query;

    const filter = getFiltersFromObject({
      code,
      subject_id,
    });

    try {
      let pagination = await createPagination(
        'books',
        { search, page, limit },
        {
          orderBy: orderBy || 'books.name',
          desc,
          filter,
          selects: ['books.*', 'school_subjects.school_subject'],
          searchColumns: [
            'isbn',
            'name',
            'school_subjects.school_subject',
            'code',
            'books.name',
            'books.publishing_company',
          ],
          leftJoins: [
            ['school_subjects', 'school_subjects.id', 'books.subject_id'],
          ],
        }
      );

      pagination.data = pagination.data.map((book) => {
        book.cover = IpUtils.getImagesAddress(book.cover);

        return book;
      });

      return res.json(pagination);
    } catch (err) {
      return res.status(406).json(err);
    }
  },

  async get(req, res) {
    const { isbn } = req.params;

    let book = await knex('books')
      .select('books.*', 'school_subjects.school_subject')
      .where('isbn', isbn)
      .whereNull('books.deleted_at')
      .leftJoin('school_subjects', 'school_subjects.id', 'books.subject_id')
      .orderBy('books.name')
      .first();

    if (book) {
      book.cover = IpUtils.getImagesAddress(book.cover);

      return res.json(book);
    }

    return res.status(404).json({ error: 'Book not found' });
  },

  async store(req, res, next) {
    const { name, isbn, publishing_company, subject_id, code } = req.body;
    const cover = req.file ? req.file.filename : undefined;

    try {
      let [book] = await knex('books')
        .insert({
          name,
          isbn,
          publishing_company,
          subject_id,
          cover,
          code,
        })
        .returning('*');

      book.cover = IpUtils.getImagesAddress(book.cover);

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
      let { statusCode, data } = await softUpdate(
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

      data.cover = IpUtils.getImagesAddress(data.cover);

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
