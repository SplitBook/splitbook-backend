const crypto = require('crypto');

module.exports = {
  generateCode() {
    const code = crypto.randomBytes(3).toString('HEX');

    return code;
  },
};
