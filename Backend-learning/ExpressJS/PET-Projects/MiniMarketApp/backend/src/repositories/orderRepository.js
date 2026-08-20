// path: backend/src/repositories/orderRepository.js
const prisma = require('../config/prisma');

class OrderRepository {
    // @param: client - {prisma, tx}

    // GET metgod all orders of user
    async findOrdersByUserId(client, userId) {
        return client.order.findMany({ where: { userId: userId },
            include: { items: { include: { product: true } },
                        orderBy: { createdAt: 'desc' } } });
    };

    // GET method find order by id
    async findOrderById(client, orderId) {
        return client.order.findUnique({ where: { id: orderId },
            include: { items: { include: { product: true } } } });
    };

    // POST method create order
    async createOrder(client, data) {
        return client.order.create({ data: data });
    };

    // PUT method update status order
    async updateOrderStatus(client, orderId, status) {
        return client.order.update({ where: { id: orderId }, data: { status: status } });
    };
}

module.exports = new OrderRepository();