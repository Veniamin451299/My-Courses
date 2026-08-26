// path: backend/src/controllers/orderController.js
const orderService = require('../services/orderService');
const hashId = require('../utils/hashid');
const { NotFoundError, BadRequestError } = require('../middlewares/errors/errorHandler');

class OrderController {
    /**GET method
     * @description get all orders of user
     * @route GET /order
     * @access public
     * **/
    async getAllOrders(req, res, next) {
        try {
            const decodedUserId = hashId.decodeHash(req.user.hashedId);
            if (!decodedUserId) return next(new BadRequestError('Invalid user id'));

            const orders = await orderService.getAllOrder(decodedUserId);
            if (!orders || orders.length === 0) return next(new NotFoundError('Orders not found'));

            return res.status(200).json({ 
                message: "Get orders successfully", 
                data: orders.map(order => hashId.transformOrder(order))
            });
        } catch (error) {
            return next(new BadRequestError(`Bad request error: ${error.message}`));
        }
    };

    /** GET method
     * @description get order by id
     * @route GET /order/:orderId
     * @access public
     * **/
    async getOrderById(req, res, next) {
        try {
            const decodedOrderId = hashId.decodeHash(req.params.orderId);
            if (!decodedOrderId) return next(new BadRequestError('Invalid order id'));

            const order = await orderService.getOrderById(decodedOrderId);
            if (!order) return next(new NotFoundError('Order not found'));

            return res.status(200).json({ 
                message: "Get order successfully", 
                data: hashId.transformOrder(order) });
        } catch (error) {
            return next(new BadRequestError(`Bad request error: ${error.message}`));
        }
    };

    /** POST method
     * @description create order
     * @route POST /order
     * @access public
     * **/
    async createOrder(req, res, next) {
        try {
            const decodedUserId = hashId.decodeHash(req.user.hashedId);
            if (!decodedUserId) return next(new BadRequestError('Invalid user id'));

            const address = req.body.address;
            if (!address) return next(new BadRequestError('Address not found'));

            const order = await orderService.createOrder(decodedUserId, address);
            if (!order) return next(new NotFoundError('Order not found'));

            return res.status(201).json({ 
                message: "Create order successfully", 
                data: hashId.transformOrder(order) });
        } catch (error) {
            return next(new BadRequestError(`Bad request error: ${error.message}`));
        }
    };

    /** PUT method
     * @description update order
     * @route PUT /order/:orderId
     * @access public
     * **/
    async updateOrderStatus(req, res, next) {
        try {
            const decodedOrderId = hashId.decodeHash(req.params.orderId);
            if (!decodedOrderId) return next(new BadRequestError('Invalid order id'));

            const order = await orderService.updateOrderStatus(decodedOrderId, req.body.status);
            if (!order) return next(new NotFoundError('Order not found'));

            return res.status(200).json({ 
                message: "Update order successfully", 
                data: hashId.transformOrder(order) });
        } catch (error) {
            return next(new BadRequestError(`Bad request error: ${error.message}`));
        }
    };
}

module.exports = new OrderController();