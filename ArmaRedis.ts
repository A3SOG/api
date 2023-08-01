import { Redis } from 'ioredis'

const redisClient: Redis = new Redis({
  host: process.env.REDIS_HOST,
  port: Number(process.env.REDIS_PORT),
  password: process.env.REDIS_PASSWORD
})

redisClient.on("error", (e: Error) => console.log("ArmaRedis Client Error", e))
redisClient.on("connect", () => console.log("ArmaRedis Client is connected!"))

export default redisClient
