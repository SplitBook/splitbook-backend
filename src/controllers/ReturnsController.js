const knex = require('../database');
const { softDelete, softUpdate } = require('../utils/DatabaseOperations');

module.exports = {
  async index(req, res, next) {
    const returns = await knex('returns')
      .select('*')
      .whereNull('deleted_at')
      .orderBy('created_at');

    return res.json(returns);
  },

  async store(req, res, next) {
    const { requisition_physical_book_id, book_state_id } = req.body;

    try {
      const [returnObject] = await knex('returns')
        .insert({
          requisition_physical_book_id,
          book_state_id,
        })
        .returning('*');

      return res.json(returnObject);
    } catch (err) {
      return res.status(406).json(err);
    }
  },

  async update(req, res) {
    const { id } = req.params;
    const { requisition_physical_book_id, book_state_id, active } = req.body;

    try {
      const { statusCode, data } = await softUpdate('returns', id, {
        requisition_physical_book_id,
        book_state_id,
        active,
      });

      return res.status(statusCode).json(data);
    } catch (err) {
      return res.status(406).json(err);
    }
  },

  async delete(req, res) {
    const { id } = req.params;

    return res.status(await softDelete('returns', id)).send();
  },
};
