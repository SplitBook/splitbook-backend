module.exports = {
  signOptions: {
    algorithm: 'RS256',
    expiresIn: '10 min'
  },
  privateKey: process.env.TOKEN_PRIVATE_KEY,
  publicKey: process.env.TOKEN_PUBLIC_KEY
}
