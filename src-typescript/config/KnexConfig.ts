import assert from 'assert'
import { Config } from 'knex'
import path from 'path'

assert(process.env.DATABASE_HOST, 'Missing Database Host')
assert(process.env.DATABASE_USER, 'Missing Database User')
assert(process.env.DATABASE_PASSWORD, 'Missing Database Password')
assert(process.env.DATABASE_NAME, 'Missing Database Name')

const knexConfig: Config = {
  client: 'pg',
  connection: {
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME
  },
  migrations: {
    tableName: 'knex_migrations',
    directory: path.resolve(__dirname, '..', 'database', 'migrations')
  },
  seeds: {
    directory: path.resolve(__dirname, '..', 'datbase', 'seeds')
  },
  debug: process.env.NODE_ENV === 'development'
}

export default knexConfig
