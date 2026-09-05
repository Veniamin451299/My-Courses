// path: backend/src/services/analyticsService.js
const analyticsRepo = require('../repositories/analyticsRepository');
const prisma = require('../config/prisma');
const {NotFoundError} = require('../middlewares/errors/errorHandler');

class AnalyticsService {
  /** POST method
   * @description Create event analytics
   * @param {Object} - data
   * @returns {Object} - event analytics
   * **/
    async createEventAnalytics(data) {
    const eventAnalytics = await analyticsRepo.createEventAnalytics(prisma, data);
    if (!eventAnalytics) throw new NotFoundError('Not found event analytics');
    return eventAnalytics;
  };

  /** GET method
   * @description Get top products
   * @param {Object} - limit (default = 10)
   * @returns {Object} - top products, total purchase
   * **/  
  async getTopProducts(limit) {
    const topProducts = await analyticsRepo.getTopProducts(prisma, limit);
    if (!topProducts || topProducts.length === 0) throw new NotFoundError('Not found top products');
    
    const totalPurchase = topProducts.reduce((sum, item) => sum + Number(item.count), 0);

    const productsWithRank = topProducts.map((item, index) => ({
        productId: Number(item.productId),
        productName: item.productName,
        productPrice: Number(item.productPrice),
        count: Number(item.count),
        rank: index + 1,
        percentage: totalPurchase > 0
            ? Math.round((Number(item.count) / totalPurchase) * 100) / 100
            : 0,
    }));
    
    return {
        data: productsWithRank,
        total: totalPurchase,
    };
  };

    /** GET method
   * @description Get revenue
   * @param {Object} - period (default = 30 days)
   * @returns {Object} - revenue
   * **/
    async getRevenue(period = 'month') {
        const revenue = await analyticsRepo.getRevenue(prisma, period);
        
        // Если данных нет — возвращаем пустой массив и нулевые суммы
        if (!revenue || revenue.length === 0) {
            return {
                data: [],
                summary: {
                    totalRevenue: 0,
                    totalOrders: 0,
                    averageOrderValue: 0,
                    period
                }
            };
        }

        const totalRevenue = revenue.reduce((sum, day) => sum + Number(day.revenue), 0);
        const totalOrders = revenue.reduce((sum, day) => sum + Number(day.orders_count), 0);
        const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

        const transformedRevenue = revenue.map(day => ({
            date: day.date,
            orders_count: Number(day.orders_count),
            revenue: Number(day.revenue)
        }));

        return {
            data: transformedRevenue,
            summary: {
                totalRevenue,
                totalOrders,
                averageOrderValue,
                period
            }
        };
    };

    /** GET method
   * @description Get user stats
   * @returns {Object} - Users statistics
   * **/
   async getUserStats() {
        const userStats = await analyticsRepo.getUserStats(prisma);
        if (!userStats) throw new NotFoundError('Not found user stats');

        const totalUsers = userStats.totalUsers || 0;
        const activeUsers = userStats.activeUsersLast30Days || 0;
        const newUsers = userStats.newUsersLast30Days || 0;
        
        // Расчет коэффициентов
        const retentionRate = totalUsers > 0 ? (activeUsers / totalUsers) * 100 : 0;
        const conversionRate = totalUsers > 0 ? (userStats.usersWithOrders / totalUsers) * 100 : 0;

        return {
            totalUsers,
            activeUsers,
            newUsers,
            retentionRate: Math.round(retentionRate * 100) / 100, // 2 знака
            conversionRate: Math.round(conversionRate * 100) / 100
        };
    };
}

module.exports = new AnalyticsService();