const knex = require('../database');
const { softDelete, softUpdate } = require('../utils/DatabaseOperations');

module.exports = {
  async index(req, res, next) {
    const book_locations = await knex('book_locations')
      .select('*')
      .whereNull('deleted_at')
      .orderBy('location');

    return res.json(book_locations);
  },

  async store(req, res, next) {
    const { location } = req.body;

    try {
      const [bookLocation] = await knex('book_locations')
        .insert({
          location,
        })
        .returning('*');

      return res.json(bookLocation);
    } catch (err) {
      return res.status(406).json(err);
    }
  },

  async update(req, res) {
    const { id } = req.params;
    const { location, active } = req.body;

    try {
      const { statusCode, data } = await softUpdate('book_locations', id, {
        location,
        active,
      });

      return res.status(statusCode).json(data);
    } catch (err) {
      return res.status(406).json(err);
    }
  },

  async delete(req, res) {
    const { id } = req.params;

    return res.status(await softDelete('book_locations', id)).send();
  },
};
