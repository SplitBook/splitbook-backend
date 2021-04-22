const jwt = require('jsonwebtoken')
const EnumTokenTypes = require('../utils/enums/EnumTokenTypes')
const {
  signOptions,
  privateKey,
  publicKey
} = require('../config/jwtTokenConfig')

module.exports = {
  EnumTokenTypes,

  generate(
    content,
    tokenType = EnumTokenTypes.LOGIN,
    expiresIn = signOptions.expiresIn
  ) {
    content.type = tokenType

    return jwt.sign(content, privateKey, { ...signOptions, expiresIn })
  },

  decode(token) {
    try {
      const content = jwt.verify(token, publicKey, signOptions)

      return content
    } catch (err) {
      return null
    }
  }
}
