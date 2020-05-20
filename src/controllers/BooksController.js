const knex = require('../database');
const { softDelete, softUpdate } = require('../utils/DatabaseOperations');

module.exports = {
  async index(req, res, next) {
    const books = await knex('books')
      .select('*')
      .whereNull('deleted_at')
      .orderBy('name');

    return res.json(books);
  },

  async store(req, res, next) {
    const { name, isbn, publishing_company, subject_id } = req.body;
    const cover = req.file ? req.file.filename : undefined;

    try {
      await knex('books').insert({
        name,
        isbn,
        publishing_company,
        subject_id,
        cover,
      });

      return res.status(201).send();
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
      return res
        .status(
          await softUpdate(
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
          )
        )
        .send();
    } catch (err) {
      return res.status(406).json(err);
    }
  },

  async delete(req, res) {
    const { isbn } = req.params;

    return res.status(await softDelete('books', isbn, 'isbn')).send();
  },
};
