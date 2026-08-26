// path: backend/src/utils/hashid.js
const HashIds = require('hashids/cjs');
const { product } = require('../config/prisma');

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

    // Функция для преобразования продукта
    transformProduct = (product) => ({
        ...product,
        id: this.generateHash(product.id),
        categoryId: this.generateHash(product.categoryId)
    });

    // Функция для преобразования корзины
    transformCart = (cart) => ({
        ...cart,
        id: this.generateHash(cart.id),
        userId: this.generateHash(cart.userId),
        items: cart.items.map(item => ({
            ...item,
            id: this.generateHash(item.id),
            cartId: this.generateHash(item.cartId),
            productId: this.generateHash(item.productId),
            product: this.transformProduct(item.product)
        }))
    });

    // Функция для преобразования заказа
    transformOrder = (order) => ({
        ...order,
        id: this.generateHash(order.id),
        userId: this.generateHash(order.userId),
        items: order.items.map(item => ({
            ...item,
            id: this.generateHash(item.id),
            productId: this.generateHash(item.productId)
        }))
    });
}

module.exports = new HashId();