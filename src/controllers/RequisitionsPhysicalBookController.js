const knex = require('../database');
const { softDelete, softUpdate } = require('../utils/DatabaseOperations');

module.exports = {
  async index(req, res, next) {
    const requisitions_physical_book = await knex('requisitions_physical_book')
      .select('*')
      .whereNull('deleted_at')
      .orderBy('created_at');

    return res.json(requisitions_physical_book);
  },

  async store(req, res, next) {
    const {
      physical_book_id,
      book_requisition_id,
      delivery_date,
      return_date,
    } = req.body;

    try {
      const [requisitionsPhysicalBook] = await knex(
        'requisitions_physical_book'
      )
        .insert({
          physical_book_id,
          book_requisition_id,
          delivery_date,
          return_date,
        })
        .returning('*');

      return res.json(requisitionsPhysicalBook);
    } catch (err) {
      return res.status(406).json(err);
    }
  },

  async update(req, res) {
    const { id } = req.params;
    const {
      physical_book_id,
      book_requisition_id,
      delivery_date,
      return_date,
      active,
    } = req.body;

    try {
      const { statusCode, data } = await softUpdate(
        'requisitions_physical_book',
        id,
        {
          physical_book_id,
          book_requisition_id,
          delivery_date,
          return_date,
          active,
        }
      );

      return res.status(statusCode).json(data);
    } catch (err) {
      return res.status(406).json(err);
    }
  },

  async delete(req, res) {
    const { id } = req.params;

    return res
      .status(await softDelete('requisitions_physical_book', id))
      .send();
  },
};
