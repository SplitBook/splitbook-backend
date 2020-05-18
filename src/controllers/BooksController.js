const knex = require('../database');
const { softDelete, softUpdate } = require('../utils/DatabaseOperations');

module.exports = {
  async index(req, res, next) {
    const books = await knex('books')
      .select('*')
      .whereNull('deleted_at')
      .orderBy('book');

    return res.json(books);
  },

  async store(req, res, next) {
    const { name, isbn, publishing_company, cover, subject_id } = req.body;

    try {
      await knex('books').insert({
        name,
        isbn,
        publishing_company,
        cover,
        subject_id,
      });
      return res.status(201).send();
    } catch (err) {
      return res.status(406).json(err);
    }
  },

  async update(req, res) {
    const { isbn } = req.params;
    const { name, publishing_company, cover, subject_id, active } = req.body;

    return res
      .status(
        await softUpdate('books', isbn, {
          name,
          publishing_company,
          cover,
          subject_id,
          active,
        })
      )
      .send();
  },

  async delete(req, res) {
    const { isbn } = req.params;

    return res.status(await softDelete('books', isbn)).send();
  },
};
