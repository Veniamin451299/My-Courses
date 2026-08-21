// path: backend/src/utils/jwt.js
const jwt = require('jsonwebtoken');

class JWTService { 
    generateToken(userId, role, expire) {
        return jwt.sign({ id: userId, role }, process.env.JWT_SECRET, { expiresIn: expire || '7d' });
    }

    verifyToken(token) {
        try{
            return jwt.verify(token, process.env.JWT_SECRET);
        } catch (error) {
            throw new UnauthorizedError('Invalid or expired token');
        }
    }
}

module.exports = new JWTService();