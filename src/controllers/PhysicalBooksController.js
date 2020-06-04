const knex = require('../database');
const { softDelete, softUpdate } = require('../utils/DatabaseOperations');
const { generateCode } = require('../utils/PhysicalBookUtils');

module.exports = {
  async index(req, res, next) {
    const physical_books = await knex('physical_books')
      .select('*')
      .whereNull('deleted_at')
      .orderBy('created_at');

    return res.json(physical_books);
  },

  async store(req, res, next) {
    const {
      book_isbn,
      available,
      state_id,
      location_id,
      description,
    } = req.body;

    const [{ code }] = await knex('books')
      .select('code')
      .where('isbn', book_isbn)
      .whereNull('deleted_at');

    if (code) {
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
    } else {
      return res.status(406).json({ error: 'Book not found.' });
    }
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
