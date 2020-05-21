const jwt = require('jsonwebtoken');
const EnumTokenTypes = require('../utils/enums/EnumTokenTypes');

const SECRET = process.env.TOKEN_SECRET || 'basic_secret123';
const expiresInLogin = process.env.TOKEN_EXPIRES_IN || '5 days';

module.exports = {
  EnumTokenTypes,

  generate(
    content,
    tokenType = EnumTokenTypes.LOGIN,
    expiresIn = expiresInLogin
  ) {
    content.type = tokenType;

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
