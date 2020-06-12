const knex = require('../database');
const { softDelete, softUpdate } = require('../utils/DatabaseOperations');

module.exports = {
  // async index(req, res, next) {
  //   const returns = await knex('returns')
  //     .select('*')
  //     .whereNull('deleted_at')
  //     .orderBy('created_at');

  //   return res.json(returns);
  // },

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
    const { book_state_id } = req.body;

    try {
      const report = await knex('returns')
        .select('reports.*')
        .where('returns.id', id)
        .whereNull('returns.deleted_at')
        .innerJoin('reports', 'reports.id', 'returns.report_id');

      if (!report) {
        return res.status(404).json({ error: 'Return not found' });
      }

      if (report.is_file_signed) {
        return res.status(403).json({
          error: 'Report cannot be changed, because was already signed',
        });
      }

      const { statusCode, data } = await softUpdate('deliveries', id, {
        book_state_id,
      });

      return res.status(statusCode).json(data);
    } catch (err) {
      return res.status(406).json(err);
    }
  },

  // async delete(req, res) {
  //   const { id } = req.params;

  //   return res.status(await softDelete('returns', id)).send();
  // },
};
