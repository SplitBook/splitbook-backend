const knex = require('../database');
const { softDelete, softUpdate } = require('../utils/DatabaseOperations');

module.exports = {
  async index(req, res, next) {
    const adopted_books = await knex('adopted_books')
      .select('*')
      .whereNull('deleted_at')
      .orderBy('created_at');

    return res.json(adopted_books);
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
