// path: backend/src/services/orderService.js
const orderRepo = require('../repositories/orderRepository');
const cartRepo = require('../repositories/cartRepository');
const cartItemRepo = require('../repositories/cartItemRepository');
const productRepo = require('../repositories/productRepository');
const { NotFoundError, BadRequestError } = require('../middlewares/errors/errorHandler');
const prisma = require('../config/prisma');
const analyticsRepo = require('../repositories/analyticsRepository');

class OrderService {
    /** GET method
     * @description get all orders for user history
     * @param userId - user id
     * @return {Promise<Order>}
     * **/
    async getAllOrder(userId) {
        const order = await orderRepo.findOrdersByUserId(prisma, userId);
        if (!order || order.length === 0) throw new NotFoundError('Order not found');
        return order;
    };

    /** GET method
     * @description get order of user by id
     * @param orderId - order id
     * @return {Promise<Order>}
     * **/
    async getOrderById(orderId) {
        const order = await orderRepo.findOrderById(prisma, orderId);
        if (!order) throw new NotFoundError('Order not found');
        return order;
    };

    /** POST method
     * @description create order 
     * @param userId - user id
     * @return {Promise<Order>}
     * **/
    async createOrder(userId, address) {
      return await prisma.$transaction(async (tx) => {
         // 1. get user cart
        const cart = await cartRepo.findCartByUserId(tx, userId);
        if(!cart?.items.length) throw new BadRequestError('Cart is empty');

        // 2, Check if availability of products
        for (const item of cart.items) {
            if (item.product.stock < item.quantity) {
                throw new BadRequestError(`Not enough stock for ${item.product.name}`);
            }
        }

        // 3. Decriment stock
        for (const item of cart.items) await productRepo.decrimentStock(tx, item.productId,
             item.quantity);
        
        // 4. Create order
        const order = await orderRepo.createOrder(tx, {
            userId,
            items: {
                create: cart.items.map(item => ({
                   productId: item.productId,
                   quantity: item.quantity,
                   price: item.price
                }))
            },
            totalPrice: cart.totalPrice,
            address: address
        });

        // 5. Clear cart
        await cartItemRepo.deleteCartItemByCartId(tx, cart.id);
        await cartRepo.updateCartTotal(tx, cart.id, 0);


        // 6. Log event
        for (const item of cart.items) {
             await analyticsRepo.createEventAnalytics(tx, {
                event: 'purchase',
                userId,
                productId: item.productId,
                sessionId: 'temporary-session-id', // или req.body.sessionId
                metadata: {
                    orderId: order.id,
                    quantity: item.quantity,
                    price: item.price
                }
            });
        }
       
        return order;
      });
    };

    /** (ADMIN) PUT method
     * @description update status of order
     * @param orderId - order id
     * @param status - order status
     * @return {Promise<Order>}
     * **/
    async updateOrderStatus(orderId, status) {
        const order = await orderRepo.updateOrderStatus(prisma, orderId, status);
        if (!order) throw new NotFoundError('Order not found');
        return order;
    };
}

module.exports = new OrderService();