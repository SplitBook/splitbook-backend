const { v4: uuid } = require('uuid');

module.exports = {
  generateId() {
    const id = uuid();

    return id;
  },
};
