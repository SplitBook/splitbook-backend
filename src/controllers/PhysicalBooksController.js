const knex = require('../database');
const { softDelete, softUpdate } = require('../utils/DatabaseOperations');
const { generateCode } = require('../utils/PhysicalBookUtils');

module.exports = {
  /*
   * Search By:
   * ISBN
   * Physical Book Id (Code)
   * State
   * Name
   * Publishing Company
   */
  async index(req, res, next) {
    const { search, page, limit } = req.query;
    let nextPage = false;

    let physicalBooks = await knex
      .select(
        'physical_books.*',
        'book_locations.location',
        'book_states.state',
        'books.name',
        'books.publishing_company'
      )
      .where('book_isbn', 'like', `%${search}%`)
      .orWhere('book_locations.location', 'like', `%${search}%`)
      .orWhere('physical_books.id', 'like', `%${search}%`)
      .orWhere('book_states.state', 'like', `%${search}%`)
      .orWhere('books.name', 'like', `%${search}%`)
      .orWhere('books.publishing_company', 'like', `%${search}%`)
      .whereNull('physical_books.deleted_at')
      .from('physical_books')
      .leftJoin(
        'book_locations',
        'book_locations.id',
        'physical_books.location_id'
      )
      .leftJoin('book_states', 'book_states.id', 'physical_books.state_id')
      .leftJoin('books', 'books.isbn', 'physical_books.book_isbn')
      .limit(limit + 1)
      .offset((page - 1) * limit)
      .orderBy('physical_books.created_at');

    if (physicalBooks.length > limit) {
      nextPage = true;
      physicalBooks = physicalBooks.slice(0, limit);
    }

    return res.json({
      data: physicalBooks,
      page,
      pageCount: physicalBooks.length,
      limit,
      nextPage,
    });
  },

  async store(req, res, next) {
    const {
      book_isbn,
      available,
      state_id,
      location_id,
      description,
    } = req.body;

    const book = await knex('books')
      .select('code')
      .where('isbn', book_isbn)
      .whereNull('deleted_at')
      .first();

    if (book) {
      const { code } = book;

      const id = `${code}-${generateCode()}`;

      try {
        const [physicalBook] = await knex('physical_books')
          .insert({
            id,
            book_isbn,
            available,
            state_id,
            location_id,
            description,
          })
          .returning('*');

        return res.json(physicalBook);
      } catch (err) {
        return res.status(406).json(err);
      }
    }

    return res.status(406).json({ error: 'Book not found.' });
  },

  async update(req, res) {
    const { id } = req.params;
    const { available, state_id, location_id, description } = req.body;

    try {
      const { statusCode, data } = await softUpdate('physical_books', id, {
        available,
        state_id,
        location_id,
        description,
      });

      return res.status(statusCode).json(data);
    } catch (err) {
      return res.status(406).json(err);
    }
  },

  async delete(req, res) {
    const { id } = req.params;

    return res.status(await softDelete('physical_books', id)).send();
  },
};
