// path: backend/src/services/cartService.js
const cartRepo = require('../repositories/cartRepository');
const productRepo = require('../repositories/productRepository');
const prisma = require('../config/prisma');
const { NotFoundError } = require('../middlewares/errors/errorHandler');

class CartService {

    /** GET method for get user cart
     * @param userId
     * @return {Promise<Cart>}
     * **/
    async getCart(userId) {
        const cart = await cartRepo.findCartByUserId(prisma, userId);
        if (!cart) throw new NotFoundError('Cart not found');
        return cart;
    };

    /** POST method for add item to cart
     * @param userId, 
     * @param productId,
     * @param quantity
     * @return {Promise<Cart>}
     * **/
    async addItem(userId, productId, quantity) {
        return await prisma.$transaction(async (tx) => {
            // 1. Find cart of user or create new cart
            let cart = await cartRepo.findCartByUserId(tx, userId);
            if (!cart) cart = await cartRepo.createCart(tx,userId);
           
            /** 2. Check if product exists **/
            const product = await productRepo.findById(tx, productId);
            if (!product) throw new NotFoundError('Product not found');
            // 3. Found and create cart item
            let cartItem = await cartRepo.findCartItemByProduct(tx, cart.id, productId);
            if (cartItem) {
                cartItem = await cartRepo.updateCartItem(tx, cartItem.id, cartItem.quantity + quantity);
            } else {
                cartItem = await cartRepo.createCartItem(tx, {
                    cartId: cart.id,
                    productId,
                    quantity,
                    price: product.price
                });
            }
            // 4. Recalculate total price
            const items = await tx.cartItem.findMany({ where: { cartId: cart.id } });
            const totalPrice = items.reduce((sum, item) => sum + Number(item.price) * item.quantity, 0);
            await cartRepo.updateCartTotal(tx, cart.id, totalPrice);
            // 5. Return the updated cart to the user
            return await cartRepo.findCartByUserId(tx, userId);
        });
    };

    /** PUT method for updating user item quantity
     * @param userId
     * @param cartItemId
     * @param newQuantity
     * @return {Promise<cart-item>}
     * **/
    async updateItemQuantity(userId, cartItemId, newQuantity) {
        return await prisma.$transaction(async (tx) => {
            const cart = await cartRepo.findCartByUserId(tx, userId);
            if(!cart) throw new NotFoundError('Cart not found'); 

            const cart = await cartRepo.findCartByUserId(tx, userId);
            if(!cart || cartItem.cartId !== cart.id) throw new NotFoundError('Cart not found');
            
            await cartRepo.updateCartItem(tx, cartItemId, newQuantity);
            // Recalculate total price
            const items = await tx.cartItem.findMany({ where: { cartId: cart.id } });
            const totalPrice = items.reduce((sum, item) => sum + Number(item.price) * item.quantity, 0);
            await cartRepo.updateCartTotal(tx, cart.id, totalPrice);
            return await cartRepo.findCartByUserId(tx, userId);
        });
    };

    /** DELETE method for delete user cart-item
     * @param userId
     * @return {Promise<cart-item>}
     * **/
    async deleteCartItem(userId, cartItemId) {
        return await prisma.$transaction(async (tx) => {
            const cart = await cartRepo.findCartByUserId(tx, userId);
            if(!cart || cartItem.cartId !== cart.id) throw new NotFoundError('Cart not found'); 

            const cartItem = await cartRepo.findCartItemById(tx, cartItemId);
            if(!cartItem) throw new NotFoundError('Cart item not found');

            await cartRepo.deleteCartItem(tx, cartItemId);
            // Recalculate total price
            const items = await tx.cartItem.findMany({ where: { cartId: cart.id } });
            const totalPrice = items.reduce((sum, item) => sum + Number(item.price) * item.quantity, 0);
            await cartRepo.updateCartTotal(tx, cart.id, totalPrice);
            return await cartRepo.findCartByUserId(tx, userId);
        });
    };

    /** DELETE method for clear user cart
     * @param userId
     * @return {Promise<cart>}
     * **/
    async clearCart(userId) {
        return await prisma.$transaction(async (tx) => {
            const cart = await cartRepo.findCartByUserId(tx, userId);
            if(!cart) throw new NotFoundError('Cart not found'); 
            await cartRepo.clearCartItems(tx, cart.id);
            await cartRepo.updateCartTotal(tx, cart.id, 0);
            return await cartRepo.findCartByUserId(tx, userId);
        });
    };
}

module.exports = new CartService();
