// path: backend/src/utils/bcrypt.js
const bcrypt = require('bcrypt');
const saltRounds = 10;

class BcryptService {
    // Hash a password
    async hash(password) {
        if (!password) return null;
        return await bcrypt.hash(password, saltRounds);
    }

    // Compare a password with a hash
    async compare(password, hash) {
        if (!password || !hash) return null;
        return await bcrypt.compare(password, hash);
    }
}

module.exports = new BcryptService;