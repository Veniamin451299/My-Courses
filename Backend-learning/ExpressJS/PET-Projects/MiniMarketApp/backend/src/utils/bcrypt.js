// path: backend/src/utils/bcrypt.js
const bcrypt = require('bcrypt');
const saltRounds = 10;

// Hash a password
async function hash(password) {
    if (!password) return null;
    return await bcrypt.hash(password, saltRounds);
}

// Compare a password with a hash
async function compare(password, hash) {
    if (!password || !hash) return null;
    return await bcrypt.compare(password, hash);
}


module.exports = { hash, compare };