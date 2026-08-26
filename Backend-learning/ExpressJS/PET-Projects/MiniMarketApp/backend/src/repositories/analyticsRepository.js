// path: backend/src/repositories/analyticsRepository.js
const prisma = require('../config/prisma');

class AnalyticsRepository {
    // @param: client - {prisma, tx}

    // Log event fpr analytics
    async createEventAnalytics(client, data) {
        return await client.analytics.create({ data: data }); 
    };

    // GET method for top products
    async getTopProducts(client, limit = 10) {
        return await client.$queryRaw`
            SELECT 
                "productId",
                COUNT(*) as count,
                p.name as "productName",
                p.price as "productPrice"
            FROM analytics a
            LEFT JOIN products p ON a."productId" = p.id
            WHERE a.event = 'purchase' 
                AND a."productId" IS NOT NULL
            GROUP BY a."productId", p.name, p.price
            ORDER BY count DESC
            LIMIT ${limit}
        `;
    };

    // GET method: Revenue statistics 
    async getRevenue(client, period = 'month') {
        const now = new Date();
        let startDate;
        switch (period) {
            case 'day': startDate = new Date(now - 24 * 60 * 60 * 1000); break;
            case 'week': startDate = new Date(now - 7 * 24 * 60 * 60 * 1000); break;
            case 'month': startDate = new Date(now - 30 * 24 * 60 * 60 * 1000); break;
            case 'year': startDate = new Date(now - 365 * 24 * 60 * 60 * 1000); break;
            default: startDate = new Date(now - 30 * 24 * 60 * 60 * 1000);
        }

        return await client.$queryRaw`
            SELECT 
                DATE(o."createdAt") as date,
                COUNT(o.id) as orders_count,
                SUM(o."totalPrice") as revenue
            FROM orders o
            WHERE o.status = 'PAID' 
                AND o."createdAt" >= ${startDate}
            GROUP BY DATE(o."createdAt")
            ORDER BY date DESC
        `;
    };

    // GET method: user statistics
    async getUserStats(client) {
        const [totalUsers, newUsers, activeUsers, usersWithOrders] = await Promise.all([
            client.user.count(),
            client.user.count({
                where: {
                    createdAt: {
                        gte: new Date(new Date() - 30 * 24 * 60 * 60 * 1000) // 30 days
                    }
                }
            }),
            client.order.groupBy({
                by: ['userId'],
                where: {
                    createdAt: {
                        gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // 30 days
                    }
                }
            }),
            client.order.groupBy({
                by: ['userId'],
                where: { status: 'PAID' }
            })
        ]);
        return { 
            totalUsers, 
            newUsersLast30Days: newUsers, 
            activeUsersLast30Days: activeUsers.length,
            usersWithOrders: usersWithOrders.length
        };
    };
}

module.exports = new AnalyticsRepository();