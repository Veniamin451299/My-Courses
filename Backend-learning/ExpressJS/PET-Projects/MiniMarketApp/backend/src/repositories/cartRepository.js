// path: backend/src/repositories/cartRepository.js
const prisma = require('../config/prisma');

class CartRepository {
    // @param: client - {prisma, tx}
    // GET method cart of user
    async findCartByUserId(client, userId) {
        return client.cart.findUnique({ where: { userId: userId }, 
            include: { items: { include: { product: true } } } });
    };

    // GET method find cart item by product
    async findCartItemByProduct(client, cartId, productId) {
        return client.cart.findUnique({ where: { cartId_productId: { cartId, productId } } });
    };

    // GET method fund cart item by id
    async findCartItemById(client, cartItemId) {
        return client.cartItem.findUnique({ where: { id: cartItemId } });
    };

    // POST method for create cart
    async createCart(client, userId) {
        return client.cart.create({ data: userId });
    }

    // POST method for create cart-item in cart
    async createCartItem(client, data) {
        return client.cartItem.create({ data: data});
    };

    // PUT method for update quentity :productID in cart-item
    async updateCartItem(client, cartItemId, quantity) {
        return client.cartItem.update({ where: { id: cartItemId }, data: { quantity: quantity } });
    };

    // PUT method for updating total price
    async updateCartTotal(client, cartId, total) {
        return client.cart.update({
            where: { id: cartId },
            data: { totalPrice: total }
        });
    }

    // DELETE method for deleting cart item by cardItemId
    async deleteCartItem(client, cartItemId) {
        return client.cartItem.delete({ where: { id: cartItemId } });
    } 

    // DELETE method for deleting all cart items by cartId
    async clearCartItems(client, cartId) {
        return client.cartItem.deleteMany({
            where: { cartId: cartId }
        });
    }
    
}

module.exports = new CartRepository();