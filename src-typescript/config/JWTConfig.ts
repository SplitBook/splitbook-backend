import assert from 'assert'
import { Secret, SignOptions } from 'jsonwebtoken'

type JWTConfig = {
  signOptions: SignOptions
  privateKey: Secret
  publicKey: Secret
}

assert(process.env.JWT_PRIVATE_KEY, 'Missing JWT Private Key')
assert(process.env.JWT_PUBLIC_KEY, 'Missing JWT Public Key')

export const JWTConfig: JWTConfig = {
  signOptions: {
    algorithm: 'RS256',
    expiresIn: '15m'
  },
  privateKey: process.env.JWT_PRIVATE_KEY,
  publicKey: process.env.JWT_PUBLIC_KEY
}
