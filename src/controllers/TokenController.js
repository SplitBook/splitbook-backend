const { publicKey } = require('../config/jwtTokenConfig')

module.exports = {
  async getPublicKey(req, res, next) {
    return res.json({ publicKey })
  }
}
