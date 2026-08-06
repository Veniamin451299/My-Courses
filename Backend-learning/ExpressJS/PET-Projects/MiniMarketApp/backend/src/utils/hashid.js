// path: backend/src/utils/hashid.js
const HashIds = require('hashids/cjs');

class HashId { 
    // Создаем экземпляр и передаем секретную соль
    hashids = new HashIds(process.env.HASHID_SALT, 8);

    // Функция для генерации хэша
    generateHash = (id) => {
        if(!id) return null;
        return this.hashids.encode(id);
    }

    // Функция для декодирования хэша
    decodeHash = (hash) => {
        if(!hash) return null;
        return this.hashids.decode(hash)[0];
    }
}

module.exports = new HashId();