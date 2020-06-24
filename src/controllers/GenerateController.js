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
        .update({ file: reportFilename, updated_at: new Date() });

      return res.json({ file: IpUtils.getReportsAddress(reportFilename) });
    } catch (err) {
      return res.status(406).json(err);
    }
  },

  async generateQRCodes(req, res) {
    const { codes } = req.query;

    const splittedCodes = codes.split(',').map((code) => code.trim());

    if (splittedCodes.length > 40 || splittedCodes.length < 0) {
      return res
        .status(406)
        .json({ error: 'Invalid number of qrcodes. Min is 1 and max is 40.' });
    }

    const stream = await PDF.generateQRCodes(splittedCodes);

    const path = stream.path;

    res.setHeader('content-type', 'application/pdf');

    return stream.pipe(res).on('finish', () => {
      fs.unlinkSync(path);
    });
  },
};
