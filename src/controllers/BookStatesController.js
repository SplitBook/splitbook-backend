const knex = require('../database');
const { softDelete, softUpdate } = require('../utils/DatabaseOperations');

module.exports = {
  async index(req, res, next) {
    const book_states = await knex('book_states')
      .select('*')
      .whereNull('deleted_at')
      .orderBy('state');

    return res.json(book_states);
  },

  async store(req, res, next) {
    const { state } = req.body;

    try {
      const [bookState] = await knex('book_states')
        .insert({ state })
        .returning('*');

      return res.json(bookState);
    } catch (err) {
      return res.status(406).json(err);
    }
  },

  async update(req, res) {
    const { id } = req.params;
    const { state, active } = req.body;

    try {
      const { statusCode, data } = await softUpdate('book_states', id, {
        state,
        active,
      });

      return res.status(statusCode).json(data);
    } catch (err) {
      return res.status(406).json(err);
    }
  },

  async delete(req, res) {
    const { id } = req.params;

    return res.status(await softDelete('book_states', id)).send();
  },
};
