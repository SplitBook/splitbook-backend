const knex = require('../database');
const { softDelete, softUpdate } = require('../utils/DatabaseOperations');

module.exports = {
  async store(req, res) {
    const { requisition_physical_book_id, book_state_id, report_id } = req.body;

    try {
      const report = await knex('reports')
        .select('reports.*')
        .where('reports.id', report_id)
        .whereNull('reports.deleted_at');

      if (!report) {
        return res.status(404).json({ error: 'Report not found' });
      }

      if (report.is_file_signed) {
        return res.status(403).json({
          error: 'Report cannot be changed, because was already signed',
        });
      }

      const [delivery] = await knex('deliveries')
        .insert({ requisition_physical_book_id, book_state_id, report_id })
        .returning('*');

      return res.json(delivery);
    } catch (err) {
      return res.status(406).json(err);
    }
  },

  async update(req, res) {
    const { id } = req.params;
    const { book_state_id } = req.body;

    try {
      const report = await knex('deliveries')
        .select('reports.*')
        .where('deliveries.id', id)
        .whereNull('deliveries.deleted_at')
        .innerJoin('reports', 'reports.id', 'deliveries.report_id');

      if (!report) {
        return res.status(404).json({ error: 'Delivery not found' });
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

  async delete(req, res) {
    const { id } = req.params;

    try {
      const report = await knex('deliveries')
        .select('reports.*')
        .where('deliveries.id', id)
        .whereNull('deliveries.deleted_at')
        .innerJoin('reports', 'reports.id', 'deliveries.report_id');

      if (!report) {
        return res.status(404).json({ error: 'Delivery not found' });
      }

      if (report.is_file_signed) {
        return res.status(403).json({
          error: 'Report cannot be changed, because was already signed',
        });
      }

      const { statusCode, data } = await softDelete('deliveries', id);

      return res.status(statusCode).json(data);
    } catch (err) {
      return res.status(406).json(err);
    }
  },
};
