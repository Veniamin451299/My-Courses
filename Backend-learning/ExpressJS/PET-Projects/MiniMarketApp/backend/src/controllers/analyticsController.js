// path: backen/src/controllers/analyticsController.js
const analyticsService = require('../services/analyticsService');
const { NotFoundError, BadRequestError } = require('../middlewares/errors/errorHandler');

class AnalyticsController {

    /** POST method
     * @description Create event analytics
     * @route POST /api/analytics/event
     * @access Private
     * **/
    async createEventAnalytics(req, res, next) { 
        try {
            const data = req.body;
            const eventAnalytics = await analyticsService.createEventAnalytics(data);
            return res.status(201).json({
                message: 'Event analytics created successfully',
                data: eventAnalytics
            });
        } catch (error) {
            return next(new BadRequestError(`Internal Server Error: ${error.message}`));
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
                data: topProducts
            });
        } catch (error) {
            return next(new BadRequestError(`Internal Server Error: ${error.message}`));
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
            return next(new BadRequestError(`Internal Server Error: ${error.message}`));
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
            return next(new BadRequestError(`Internal Server Error: ${error.message}`));
        }
     };
}

module.exports = new AnalyticsController();