import { Redis } from '@upstash/redis';

const globalForRedis = globalThis as unknown as {
  redis: Redis | undefined;
};

function createRedisClient(): Redis {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (!url || !token) {
    throw new Error('Missing Upstash Redis environment variables');
  }

  return new Redis({
    url,
    token,
    enableAutoPipelining: true,
  });
}

export const redis = globalForRedis.redis ?? createRedisClient();

if (process.env.NODE_ENV !== 'production') {
  globalForRedis.redis = redis;
}

export async function getCache<T>(key: string): Promise<T | null> {
  try {
    const data = await redis.get<T>(key);
    return data;
  } catch (error) {
    console.error('Redis GET error:', error);
    return null;
  }
}

export async function setCache<T>(key: string, value: T, ttl?: number): Promise<void> {
  try {
    if (ttl) {
      await redis.setex(key, ttl, value);
    } else {
      await redis.set(key, value);
    }
  } catch (error) {
    console.error('Redis SET error:', error);
  }
}

export async function deleteCache(key: string): Promise<void> {
  try {
    await redis.del(key);
  } catch (error) {
    console.error('Redis DEL error:', error);
  }
}

export async function incrementCounter(key: string): Promise<number> {
  try {
    return await redis.incr(key);
  } catch (error) {
    console.error('Redis INCR error:', error);
    return 0;
  }
}

export async function publishMessage(channel: string, message: string): Promise<void> {
  try {
    await redis.publish(channel, message);
  } catch (error) {
    console.error('Redis PUBLISH error:', error);
  }
}

export default redis;
