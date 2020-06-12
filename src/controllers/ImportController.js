const knex = require('../database');
const csv = require('../utils/csv');
const Queue = require('../stack');

module.exports = {
  async importSchoolEnrollmentsByClass(req, res) {
    const { class_id, school_year_id } = req.query;
    const file = req.file ? req.file.filename : undefined;

    if (!file) {
      return res.status(404).json({ error: 'File not found.' });
    }

    const classObject = await knex('classes')
      .whereNull('classes.deleted_at')
      .where({ class_id, school_year_id: school_year_id || req.school_year_id })
      .first();

    if (!classObject) {
      return res.status(404).json({ error: 'Class not found.' });
    }

    try {
      const schoolEnrollments = await csv.readCSV(file);

      for (let idx = 0; idx < schoolEnrollments.length; idx++) {
        await Queue.add(Queue.EnumQueuesTypes.CREATE_SCHOOL_ENROLLMENT, {
          ...schoolEnrollments[idx],
          class_id,
          school_year_id: school_year_id || req.school_year_id,
        });
      }

      return res.json(schoolEnrollments);
    } catch (err) {
      return res.status(406).json(err);
    }
  },
};
