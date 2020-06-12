const multer = require('multer');
const path = require('path');
const crypto = require('crypto');

module.exports = {
  dest: path.resolve(__dirname, '..', '..', 'tmp', 'csv'),
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, path.resolve(__dirname, '..', '..', 'tmp', 'csv'));
    },
    filename: (req, file, cb) => {
      crypto.randomBytes(5, (err, hash) => {
        if (err) cb(err);
        const timestamp = Date.now();
        const extension = path.extname(file.originalname);

        const filename = `${hash.toString('HEX')}-${timestamp}${extension}`;

        cb(null, filename);
      });
    },
  }),
  fileFilter: (req, file, cb) => {
    const allowedMimes = ['text/csv'];
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type.'));
    }
  },
};
