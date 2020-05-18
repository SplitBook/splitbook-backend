const bcrypt = require('bcrypt');

module.exports = {
  async validatePassword(password, userPassword) {
    const isValid = await bcrypt.compare(password, userPassword);

    return isValid;
  },

  async encript(password) {
    const hash = await bcrypt.hash(password, 10);

    return hash;
  },
};
