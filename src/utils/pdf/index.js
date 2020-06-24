const knex = require('../../database');
const path = require('path');
const fs = require('fs');
const pug = require('pug');
const pdf = require('html-pdf');
const EnumReportTypes = require('../enums/EnumReportTypes');
const crypto = require('crypto');

const folderReportsPath = path.resolve(
  __dirname,
  '..',
  '..',
  '..',
  'tmp',
  'reports'
);

const folderQRCodesPath = path.resolve(
  __dirname,
  '..',
  '..',
  '..',
  'tmp',
  'qr-codes'
);

const generateReport = async (report_id) => {
  let report = await knex('reports')
    .select(
      'reports.id',
      'reports.type',
      'reports.file',
      'reports.report_date',
      'reports.description',
      'students.name as student_name',
      'students.number as student_number',
      'guardians.name as guardian_name',
      'school_years.school_year',
      'reports.requisition_id'
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
    deleteReport(report.file);
  }

  const { table, column } = Object.values(EnumReportTypes).find(
    ({ type }) => type === report.type
  );

  const objectsToSign = await knex(table)
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
    .innerJoin('book_states', 'book_states.id', `${table}.book_state_id`)
    .innerJoin(
      'physical_books',
      'physical_books.id',
      'requisitions_physical_book.physical_book_id'
    )
    .innerJoin('books', 'books.isbn', 'physical_books.book_isbn')
    .leftJoin('school_subjects', 'school_subjects.id', 'books.subject_id');

  report.report_date = `${report.report_date.getDate()}-${report.report_date.getMonth()}-${report.report_date.getFullYear()}`;

  const otherObjects = await knex('book_requisitions')
    .select(
      `${table}.*`,
      'book_states.state',
      'requisitions_physical_book.physical_book_id',
      'books.name',
      `requisitions_physical_book.${column}`
    )
    .whereNull('book_requisitions.deleted_at')
    .where('book_requisitions.requisition_id', report.requisition_id)
    .innerJoin(
      'adopted_books',
      'adopted_books.id',
      'book_requisitions.adopted_book_id'
    )
    .innerJoin('books', 'books.isbn', 'adopted_books.book_isbn')
    .leftJoin(
      'requisitions_physical_book',
      'requisitions_physical_book.book_requisition_id',
      'book_requisitions.id'
    )
    .leftJoin(
      `${table}`,
      `${table}.requisition_physical_book_id`,
      'requisitions_physical_book.id'
    )
    .leftJoin('book_states', 'book_states.id', `${table}.book_state_id`);

  let objects = [];

  objectsToSign.forEach((obj) => {
    objects.push({ ...obj, signature: null });
  });

  otherObjects
    .filter(
      (obj) => !objectsToSign.find((objToFind) => objToFind.id === obj.id)
    )
    .forEach((obj) => {
      const signature = !obj.physical_book_id
        ? 'Por entregar'
        : obj[column]
        ? 'Assinado'
        : '---';

      objects.push({ ...obj, signature });
    });

  const properties = {
    objects,
    ...report,
  };

  return await generatePDF(report_id, 'ReportTemplate', properties);
};

const generateQRCodes = async (codes) => {
  const properties = { codes };
  const filename = crypto.randomBytes(5).toString('HEX');

  return fs.createReadStream(
    path.resolve(
      folderQRCodesPath,
      await generatePDF(
        filename,
        'QRCodesTemplate',
        properties,
        folderQRCodesPath
      )
    )
  );
};

const deleteReport = (filename) => {
  if (fs.existsSync(filename)) {
    fs.unlinkSync(filename);
  }
};

const generatePDF = (
  filename,
  templateName,
  properties = {},
  folderPath = folderReportsPath
) => {
  const html = pug.renderFile(
    path.resolve(__dirname, 'templates', `${templateName}.pug`),
    properties
  );

  // fs.writeFileSync('index.html', html);

  const options = { format: 'A4' };

  const filePath = path.resolve(folderPath, `${filename}.pdf`);

  return new Promise((resolve, reject) => {
    pdf.create(html, options).toFile(filePath, (err, res) => {
      if (err) return reject(`Impossible to create ${filePath}`);

      return resolve(path.basename(res.filename));
    });
  });
};

module.exports = { generateReport, generateQRCodes };
