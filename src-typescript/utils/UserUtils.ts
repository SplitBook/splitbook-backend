import bcrypt from 'bcrypt'

function encryptPassword(password: string): string {
  const hash = bcrypt.hashSync(password, 10)

  return hash
}

function validatePassword(password: string, passwordHashed: string): boolean {
  const isValid = bcrypt.compareSync(password, passwordHashed)

  return isValid
}

export { encryptPassword, validatePassword }
