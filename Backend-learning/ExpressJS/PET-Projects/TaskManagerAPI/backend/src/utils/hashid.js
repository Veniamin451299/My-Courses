// path: backend/src/utils/hashid.js
const Hashids = require('hashids/cjs');

class HashIdHelper {
    // Создаем экземпляр и передаем секретную соль
    hashids = new Hashids(process.env.HASHIDS_SALT, 8);

    // Функция для генерации хеша
    generateHash = (id) => {
        if (!id) return null;
        return this.hashids.encode(id);
    }

    // Функция для декодирования хеша
    decodeHash = (hash) => {
        if (!hash) return null;
        return this.hashids.decode(hash)[0];
    }
}

module.exports = new HashIdHelper;
