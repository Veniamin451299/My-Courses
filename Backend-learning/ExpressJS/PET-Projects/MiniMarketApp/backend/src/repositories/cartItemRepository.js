// path: backend/src/repositories/cartItemRepository.js
const prisma = require('../config/prisma');

class CartItemRepository {
    // @param: client - {prisma, tx}ф

    // GET method find cart item by cart id
    async findCartItemByCartId(client, cartId) {
        return client.cartItem.findMany({ where: 
            { cartId: cartId }, include: { product: true } 
        });
    };
    // DELETE method for deleting all cart items by cartId
    async deleteCartItemByCartId(client, cartId) {
        return client.cartItem.deleteMany({
            where: { cartId: cartId }
        });
    };
}

module.exports = new CartItemRepository();