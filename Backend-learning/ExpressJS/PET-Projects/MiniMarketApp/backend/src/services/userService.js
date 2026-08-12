// path: backend/src/services/userService.js
const prisma = require('../config/prisma');

class UserService {
    async findByEmail(email) {
        return await prisma.user.findUnique({ where: { email } });
    }
}