// utils/cache.js
const redis = require('../config/redis');
const logger = require('../config/logger');

class CacheService {
  async get(key) {
    try {
      const data = await redis.get(key);
      return data ? JSON.parse(data) : null;
    } catch (redisError) {
      logger.error({error: redisError}, 'Redis GET error');
      return null;
    }
  }

  async set(key, value, ttl = 3600) {
    try {
      await redis.set(key, JSON.stringify(value), { EX: ttl });
   } catch (redisError) {
      logger.error({error: redisError}, 'Redis SET error');
    }
  }

  async del(key) {
    try {
      await redis.del(key);
    } catch (redisError) {
      logger.error({error: redisError}, 'Redis DEL error');
    }
  }

  async delPattern(pattern) {
    try {
      const keys = await redis.keys(pattern);
      if (keys.length > 0) {
        await redis.del(keys);
      }
   } catch (redisError) {
      logger.error({error: redisError}, 'Redis DEL pattern error');
    }
  }
}

module.exports = new CacheService();