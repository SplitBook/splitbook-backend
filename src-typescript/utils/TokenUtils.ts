import { sign, verify } from 'jsonwebtoken'

import { JWTConfig } from '../config/JWTConfig'
import { TokenTypesEnum } from './enums/TokenTypesEnum'

type LoginTokenData = {
  type: TokenTypesEnum.LOGIN
  email: string
}

type EmailTokenData = {
  type: TokenTypesEnum.EMAIL
  email: string
}

function generateLoginToken(data: Omit<LoginTokenData, 'type'>): string {
  return sign(
    { ...data, type: TokenTypesEnum.LOGIN },
    JWTConfig.privateKey,
    JWTConfig.signOptions
  )
}

function generateEmailToken(data: Omit<EmailTokenData, 'type'>): string {
  return sign(
    { ...data, type: TokenTypesEnum.EMAIL },
    JWTConfig.privateKey,
    JWTConfig.signOptions
  )
}

function decodeLoginToken(token: string): LoginTokenData {
  try {
    return verify(
      token,
      JWTConfig.publicKey,
      JWTConfig.signOptions
    ) as LoginTokenData
  } catch (err) {
    throw new Error('Invalid token')
  }
}

function decodeEmailToken(token: string): EmailTokenData {
  try {
    return verify(
      token,
      JWTConfig.publicKey,
      JWTConfig.signOptions
    ) as EmailTokenData
  } catch (err) {
    throw new Error('Invalid token')
  }
}

export {
  decodeEmailToken,
  decodeLoginToken,
  generateEmailToken,
  generateLoginToken
}
