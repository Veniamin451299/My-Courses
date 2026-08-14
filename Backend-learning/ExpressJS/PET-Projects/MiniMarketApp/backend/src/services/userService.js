// path: backend/src/services/userService.js
const prisma = require('../config/prisma');
const cache = require('../utils/cache');

class UserService {
    // GET: find user by email
    async findByEmail(email) {
        return await prisma.user.findUnique({ where: { email } });
    }

    // GET: find user by id
    async findUserById(id) {
        return await prisma.user.findUnique({ where: { id } });
    }

    // POST: create user
    async createUser(email, hashedPassword) {
        return await prisma.user.create({ data: { email, passwordHash: hashedPassword } });
    }

    // Save refresh token
    async saveRefreshToken(userId, refreshToken) {
        await cache.set(`refresh:${userId}`, refreshToken, 'EX', 7 * 24 * 60 * 60);
    }

    // Get refresh token
    async getRefreshToken(userId) {
        return await cache.get(`refresh:${userId}`);
    }

    // Delete refresh token
    async deleteRefreshToken(userId) {
        await cache.del(`refresh:${userId}`);
    }
}

module.exports = new UserService();