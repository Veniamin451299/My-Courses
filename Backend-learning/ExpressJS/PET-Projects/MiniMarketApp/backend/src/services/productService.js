// path: backend/src/services/productService.js
const productRepo = require('../repositories/productRepository');
const cache = require('../utils/cache');
const logger = require('../config/logger');
const { NotFoundError } = require('../middlewares/errors/errorHandler')

class ProductService {
    /** Method GET all products
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
        if (category) where.categoryId = parseInt(category);
        if (name) where.name = { contains: name, mode: 'insensitive' };

        // Запросы в БД
        const [products, total] = await Promise.all([
            productRepo.findAll({ skip, take, where, orderBy: { createdAt: 'desc' } }),
            productRepo.count(where)
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
    };

    /** Method GET Product by ID
     * @param {string} productId
     * @return {Promise<Product>}
     * **/
    async getProductById(productId) {
        const cacheKey = `product:${productId}`;
        let product = null;

        try {
            product = await cache.get(cacheKey);
        } catch (redisError) {
            logger.error({ error: redisError }, 'Redis (GET) product error');
        }

        if (product) return JSON.parse(product);
        product = await productRepo.findById(productId);

        if (product) {
             try {
                await cache.set(cacheKey, JSON.stringify(product), {EX: 3600});
            } catch (redisError) {
                logger.error({ error: redisError }, 'Redis (SET) product error');
            }
        }
        return product;
    };

    /** POST method creates a new product
     * @param {Object} productData - Product data
     * @returns {promise<Object>} - Product data
     * **/ 
    async createProduct (productData) {
        const createProduct = await productRepo.create(productData); 
        // Проверяем, существует ли категория
        const category = await productRepo.findById(productData.categoryId);
        if (!category) throw new NotFoundError('Category not found');
        // Инвалидация кэша
        try {
            await cache.delPattern('products:*');
        } catch (redisError) {
            logger.error({error: redisError}, 'Redis (DEL) product create error');
        }
        return createProduct;
    }

    /**
     * PUT method for update product
     * @param {string} productData.id - ID product
     * @param {Object} productData - Data for update product
     * @return {Promise<Object>} - Updated product
     * **/
    async updateProduct(productId, productData) { 
        try {
            const updatedProduct = await productRepo.update(productId, productData)
            
            // Инвалоидируем кэш
            try {
                await cache.delPattern(`products:*`); // Удаляем все списки
                await cache.del(`product:${productId}`); // Улаляем конкретный продукт
            } catch (redisError) {
                logger.error({error: redisError}, 'Redis (DEL) product update error');
            }
            return updatedProduct;
        } catch (err) {
            if (err.code === 'P2025') {
                throw new NotFoundError(`Product ${productId} not found`);
            }
            throw err;
        }
    };

    /** DEL method for delete product
     * @param {string} productId - productId
     * @returns {Promise<object>} - deleted product
     * **/ 
    async deleteProduct(productId) {
        try{
            const deletedProduct = await productRepo.delete(productId);
        
            // Инвалидируем кэш
            try {
                await cache.delPattern(`products:*`);
            } catch (redisError) {
                logger.error({error: redisError}, 'Redis DEL product delete error');
            }
            return deletedProduct;
        } catch (err) {
            if (err.code === 'P2025') {
                throw new NotFoundError(`Product ${productId} not found`);
            }
            throw err; 
        }
    };
}

module.exports = new ProductService;