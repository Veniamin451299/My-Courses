// path: backen/src/controllers/analyticsController.js
const analyticsService = require('../services/analyticsService');
const { NotFoundError, BadRequestError } = require('../middlewares/errors/errorHandler');
const hashId = require('../utils/hashid');

class AnalyticsController {

    /** POST method
     * @description Create event analytics
     * @route POST /api/analytics/event
     * @access Private
     * **/
    async createEventAnalytics(req, res, next) {
        try {
            let data = req.body;
            if (!data) return next(new BadRequestError('Invalid data'));

            // Декодируем хэши в числа (если они есть)
            if (data.userId) {
                const decodedUserId = hashId.decodeHash(data.userId);
                if (!decodedUserId) return next(new BadRequestError('Invalid userId hash'));
                data.userId = decodedUserId;
            }
            if (data.productId) {
                const decodedProductId = hashId.decodeHash(data.productId);
                if (!decodedProductId) return next(new BadRequestError('Invalid productId hash'));
                data.productId = decodedProductId;
            }

            // Если нужно — можно добавить ip и userAgent из заголовков
            data.ip = req.ip;
            data.userAgent = req.headers['user-agent'];

            const eventAnalytics = await analyticsService.createEventAnalytics(data);
            // Если нужно закодировать ID для ответа — можно применить transform, но пока просто вернём
            return res.status(201).json({
                message: 'Event analytics created successfully',
                data: hashId.transformEvent(eventAnalytics)
            });
        } catch (error) {
            return next(new BadRequestError(`Bad request error: ${error.message}`));
        }
    };

    /** GET method
     * @description Get top products
     * @route GET /api/analytics/top-products
     * @access Private
     * **/ 
    async getTopProducts(req, res, next) { 
        try {
            const limit = parseInt(req.query.limit) || 10;
            const topProducts = await analyticsService.getTopProducts(limit);
            return res.status(200).json({
                message: 'Top products retrieved successfully',
                data: topProducts.data.map(hashId.transformTop)
            });
        } catch (error) {
            return next(new BadRequestError(`Bad request error: ${error.message}`));
        }
    };

    /** GET method
     * @description Get revenue
     * @route GET /api/analytics/revenue
     * @access Private
     * **/
     async getRevenue(req, res, next) { 
        try {
            const period = req.query.period || 'month';
            const revenue = await analyticsService.getRevenue(period);
            return res.status(200).json({
                message: 'Revenue statistics retrieved successfully',
                data: revenue
            });
        } catch (error) {
            return next(new BadRequestError(`Bad request error: ${error.message}`));
        }
     };

     /** GET method
     * @description Get user stats
     * @route GET /api/analytics/user-stats
     * @access Private
     * **/
    async getUserStats(req, res, next) { 
        try {
            const userStats = await analyticsService.getUserStats();
            return res.status(200).json({
                message: 'User statistics retrieved successfully',
                data: userStats
            });
        } catch (error) {
            return next(new BadRequestError(`Bad request error: ${error.message}`));
        }
     };
}

module.exports = new AnalyticsController();