const knex = require('../database');
const PDF = require('../utils/pdf');
const IpUtils = require('../utils/IpUtils');

module.exports = {
  async generateReport(req, res) {
    const { report_id } = req.params;

    try {
      const reportFilename = await PDF.generateReport(report_id);

      if (!reportFilename) {
        return res.status(404).json({ error: 'Report not found.' });
      }

      await knex('reports')
        .where('id', report_id)
        .update({ file: reportFilename });

      return res.json({ file: IpUtils.getReportsAddress(reportFilename) });
    } catch (err) {
      console.log(err);
      return res.status(406).json(err);
    }
  },
};
