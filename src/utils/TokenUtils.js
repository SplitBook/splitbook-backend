const jwt = require('jsonwebtoken');

const SECRET = process.env.TOKEN_SECRET || 'basic_secret123';
const expiresIn = process.env.TOKEN_EXPIRES_IN || '5 days';

module.exports = {
  generate(content) {
    return jwt.sign(content, SECRET, {
      expiresIn,
    });
  },

  decode(token) {
    try {
      const content = jwt.verify(token, SECRET);

      return content;
    } catch (err) {
      return null;
    }
  },
};
