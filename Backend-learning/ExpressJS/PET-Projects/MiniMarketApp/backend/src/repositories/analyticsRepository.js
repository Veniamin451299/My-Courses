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
                p.name as productName,
                p.price as productPrice
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
      let dateFilter;
      switch (period) {
        case 'day': dateFilter = "NOW() - INTERVAL '1 day'"; break;
        case 'week': dateFilter = "NOW() - INTERVAL '7 days'"; break;
        case 'month': dateFilter = "NOW() - INTEVAL '30 days"; break;
        case 'year': dateFilter = "NOW() - INTERVAL '365 days'"; break;
        default: dateFilter = "NOW() - INTERVAL '30 days'";
      }  
      return await client.$queryRaw`
         SELECT 
                DATE(o."createdAt") as date,
                COUNT(o.id) as orders_count,
                SUM(o."totalPrice") as revenue
            FROM orders o
            WHERE o.status = 'PAID' 
                AND o."createdAt" >= ${dateFilter}
            GROUP BY DATE(o."createdAt")
            ORDER BY date DESC
        `;
    };

    // GET method: user statistics
    async getUserStats(client) {
        const [totalUsers, newUsers, activeUsers] = await Promise.all([
            client.user.count(),
            client.user.cotnt({
                where: {
                    createdAt: {
                        gte: new Date(new Date() - 30 * 24 * 60 * 60 * 1000) // 30 days
                    }
                }
            }),
            client.order.groupBy({
                by: ['userId'],
                having: {
                    createdBy: {
                        gte: new Date(new Date() - 30 * 24 * 60 * 60 * 1000) // 30 days
                    }
                }
            })
        ]);
        return { 
            totalUsers, 
            newUsersLast30Days: newUsers, 
            activeUsersLast30Days: activeUsers.length 
        };
    };
}

module.exports = new AnalyticsRepository();