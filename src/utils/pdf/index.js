const knex = require('../../database');
const path = require('path');
const fs = require('fs');
const pug = require('pug');
const pdf = require('html-pdf');
const EnumReportTypes = require('../enums/EnumReportTypes');

const generateReport = async (report_id) => {
  let report = await knex('reports')
    .select(
      'reports.id',
      'reports.type',
      'reports.file',
      'reports.report_date',
      'students.name as student_name',
      'students.number as student_number',
      'guardians.name as guardian_name'
    )
    .whereNull('reports.deleted_at')
    .where('reports.id', report_id)
    .innerJoin('requisitions', 'requisitions.id', 'reports.requisition_id')
    .innerJoin(
      'school_enrollments',
      'school_enrollments.id',
      'requisitions.school_enrollment_id'
    )
    .innerJoin('students', 'students.id', 'school_enrollments.student_id')
    .innerJoin('guardians', 'guardians.id', 'school_enrollments.guardian_id')
    .innerJoin(
      'school_years',
      'school_years.id',
      'school_enrollments.school_year_id'
    )
    .first();

  if (!report) {
    throw { error: 'Report not found' };
  }

  if (report.file) {
    PDF.deleteReport(report.file);
  }

  const { table } = Object.values(EnumReportTypes).find(
    ({ type }) => type === report.type
  );

  const objects = await knex(table)
    .select(
      `${table}.*`,
      'book_states.state',
      'requisitions_physical_book.physical_book_id',
      'books.name'
    )
    .where(`${table}.report_id`, report_id)
    .whereNull(`${table}.deleted_at`)
    .innerJoin(
      'requisitions_physical_book',
      'requisitions_physical_book.id',
      `${table}.requisition_physical_book_id`
    )
    .innerJoin('book_states', 'book_states.id', `${table}.book_state_id`);

  const properties = {
    objects: objects.map((obj) => {
      return { ...obj, signature: true };
    }),
    ...report,
  };

  const html = pug.renderFile(
    path.resolve(__dirname, 'templates', `ReportTemplate.pug`),
    properties
  );

  const options = { format: 'A4' };

  const filePath = path.resolve(
    __dirname,
    '..',
    '..',
    '..',
    'tmp',
    'reports',
    `${filename}.pdf`
  );

  return new Promise((resolve, reject) => {
    pdf.create(html, options).toFile(filePath, (err, res) => {
      if (err) return reject(`Impossible to create ${filePath}`);

      return resolve(path.basename(res.filename));
    });
  });
};

const deleteReport = (filename) => {
  if (fs.existsSync(filename)) {
    fs.unlinkSync(filename);
  }
};

module.exports = { generateReport, deleteReport };
