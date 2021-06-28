import assert from 'assert'

type NodemailerConfig = {
  host: string
  port: number
  auth: {
    user: string
    pass: string
  }
}

assert(process.env.MAIL_HOST, 'Missing Mail Host')
assert(process.env.MAIL_PORT, 'Missing Mail Port')
assert(process.env.MAIL_USER, 'Missing Mail User')
assert(process.env.MAIL_PASSWORD, 'Missing Mail Password')

export const NodemailerConfig: NodemailerConfig = {
  host: process.env.MAIL_HOST,
  port: Number(process.env.MAIL_PORT),
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASSWORD
  }
}
