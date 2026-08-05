// path: backend/src/services/authService.js
const { PrismaPg } = require('@prisma/adapter-pg');
const { PrismaClient } = require('@prisma/client');

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

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