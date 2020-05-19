const crypto = require('crypto');

module.exports = {
  generateId() {
    const id = crypto.randomBytes(5).toString('HEX');

    return id;
  },
};
