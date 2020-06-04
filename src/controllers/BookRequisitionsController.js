const knex = require('../database');
const { softDelete, softUpdate } = require('../utils/DatabaseOperations');

module.exports = {
  async index(req, res, next) {
    const book_requisitions = await knex('book_requisitions')
      .select('*')
      .whereNull('deleted_at')
      .orderBy('created_at');

    return res.json(book_requisitions);
  },

  async store(req, res, next) {
    const { adopted_book_id, requisition_id } = req.body;

    try {
      const [bookRequisition] = await knex('book_requisitions')
        .insert({
          adopted_book_id,
          requisition_id,
        })
        .returning('*');

      return res.json(bookRequisition);
    } catch (err) {
      return res.status(406).json(err);
    }
  },

  async update(req, res) {
    const { id } = req.params;
    const { adopted_book_id, requisition_id, active } = req.body;

    try {
      const { statusCode, data } = await softUpdate('book_requisitions', id, {
        adopted_book_id,
        requisition_id,
        active,
      });

      return res.status(statusCode).json(data);
    } catch (err) {
      return res.status(406).json(err);
    }
  },

  async delete(req, res) {
    const { id } = req.params;

    return res.status(await softDelete('book_requisitions', id)).send();
  },
};
