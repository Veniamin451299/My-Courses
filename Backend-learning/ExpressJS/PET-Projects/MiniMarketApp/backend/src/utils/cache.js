// utils/cache.js
const redis = require('../config/redis');

class CacheService {
  async get(key) {
    try {
      const data = await redis.get(key);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Redis GET error:', error);
      return null;
    }
  }

  async set(key, value, ttl = 3600) {
    try {
      await redis.set(key, JSON.stringify(value), { EX: ttl });
    } catch (error) {
      console.error('Redis SET error:', error);
    }
  }

  async del(key) {
    try {
      await redis.del(key);
    } catch (error) {
      console.error('Redis DEL error:', error);
    }
  }

  async delPattern(pattern) {
    try {
      const keys = await redis.keys(pattern);
      if (keys.length > 0) {
        await redis.del(keys);
      }
    } catch (error) {
      console.error('Redis DEL pattern error:', error);
    }
  }
}

module.exports = new CacheService();