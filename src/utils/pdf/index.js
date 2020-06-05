const path = require('path');
const fs = require('fs');
const pug = require('pug');
const pdf = require('html-pdf');

const generateReport = (filename, properties = {}) => {
  const html = pug.renderFile(
    path.resolve(__dirname, 'templates', `ReportTemplate.pug`),
    properties
  );

  // fs.writeFileSync(path.resolve(__dirname, 'templates', 'index.html'), html);

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

      return resolve(filename);
    });
  });
};

module.exports = { generateReport };
