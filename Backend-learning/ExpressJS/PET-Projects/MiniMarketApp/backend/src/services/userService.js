// path: backend/src/services/userService.js
const prisma = require('../config/prisma');
const cache = require('../utils/cache');
const logger = require('../config/logger');

class UserService {
    // GET: find user by email
    async findByEmail(email) {
        return await prisma.user.findUnique({ where: {email: email } });
    }

    // GET: find user by id
    async findUserById(id) {
        return await prisma.user.findUnique({ where: {id: id } });
    }

    // POST: create user
    async createUser(email, hashedPassword) {
        return await prisma.user.create({ data: { email: email, passwordHash: hashedPassword } });
    }

    // Save refresh token
    async saveRefreshToken(userId, refreshToken) {
        try {
            await cache.set(`refresh:${userId}`, refreshToken, 7 * 24 * 60 * 60 );
        } catch (redisErr) {
            logger.error({error: redisErr}, 'Redis SET error in saveRefreshToken');
        }
    }

    // Get refresh token
    async getRefreshToken(userId) {
        try {
            return await cache.get(`refresh:${userId}`);
        } catch (redisErr) {
            logger.error({error: redisErr}, 'Redis GET error in getRefreshToken');
            return null;
        }
    }

    // Delete refresh token
    async deleteRefreshToken(userId) {
        try {
            await cache.del(`refresh:${userId}`);
        } catch (redisErr) {
            logger.error({error: redisErr}, 'Redis DEL error in deleteRefreshToken');
        }
    }
}

module.exports = new UserService();