const knex = require('../database');
const PDF = require('../utils/pdf');
const IpUtils = require('../utils/IpUtils');
const fs = require('fs');

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
      return res.status(406).json(err);
    }
  },

  async generateQRCodes(req, res) {
    const { codes } = req.query;

    const stream = await PDF.generateQRCodes(
      codes.split(',').map((code) => code.trim())
    );

    const path = stream.path;

    res.setHeader('content-type', 'application/pdf');

    return stream.pipe(res).on('finish', () => {
      fs.unlinkSync(path);
    });
  },
};
