// path: backend/src/services/authService.js
const {PrismaClient} = require('@prisma/client');
const prisma = new PrismaClient();

class AuthService {
    // GET: find user by email
    async getUserByEmail(email) {
        return await prisma.user.findUnique({ where: { email } });
    }

    // GET: find user by id
    async getUserById(id) {
        return await prisma.user.findUnique({ where: { id: Number(id) } });
    }

    // POST: create user
    async createUser(email, hashedPassword) {
        return await prisma.user.create({ data: { email, password: hashedPassword } });
    }
}

module.exports = new AuthService();