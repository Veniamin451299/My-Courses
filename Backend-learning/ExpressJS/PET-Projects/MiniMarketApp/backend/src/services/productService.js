// path: backend/src/services/productService.js
const prisma = require('../config/prisma');
const cache = require('../utils/cache');
const logger = require('../config/logger');

class ProductService {
    /** Method GET by category
     * @param {string} [page=1] - The page number
     * @param {string} [limit=10] - The number of products per page
     * @param {string} [category] - The category of the product
     * @param {string} [name] - The name of the product
     * @returns {Promise<Object>} - The products
     * **/
    async getProducts(page = 1, limit = 10, category, name) {
        const cacheKey = `products:${page}:${limit}:${category || 'all'}:${name || 'all'}`;
        const skip = (page - 1) * limit;
        const take = limit;

        // Проверяем кеш
        try {
            const cached = await cache.get(cacheKey);
            if (cached) return JSON.parse(cached);
        } catch (redisError) {
            logger.error({ error: redisError }, 'Redis GET error');
        }

        // Собираем фильтры
        const where = {};
        if (category) where.category = category;
        if (name) where.name = { contains: name, mode: 'insensitive' };

        // Запросы в БД
        const [products, total] = await Promise.all([
            prisma.product.findMany({ where, skip, take, orderBy: { createdAt: 'desc' } }),
            prisma.product.count({ where })
        ]);

        // Формируем ответ
        const result = {
            data: products,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit)
            }
        };

        // Сохраняем в кеш (только если есть продукты)
        if (products.length > 0) {
            try {
                await cache.set(cacheKey, JSON.stringify(result), { EX: 3600 });
            } catch (redisError) {
                logger.error({ error: redisError }, 'Redis SET error');
            }
        }

        return result;
    }
}