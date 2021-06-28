type RedisConfig = {
  host: string
  port: string
  password?: string
}

export const redisConfig: RedisConfig = {
  host: process.env.REDIS_HOST || '127.0.0.1',
  port: process.env.REDIS_PORT || '6379',
  password: process.env.REDIS_PASSWORD
}
