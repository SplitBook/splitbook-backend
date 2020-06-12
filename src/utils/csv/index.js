const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');

const readCSV = (filename) => {
  let results = [];
  const filePath = path.resolve(
    __dirname,
    '..',
    '..',
    '..',
    'tmp',
    'csv',
    filename
  );

  return new Promise((resolve, reject) => {
    fs.createReadStream(filePath)
      .pipe(csv({ separator: ';' }))
      .on('data', (row) => {
        results.push(row);
      })
      .on('finish', () => {
        fs.unlinkSync(filePath);
        return resolve(results);
      })
      .on('error', (err) => reject(err));
  });
};

module.exports = { readCSV };
