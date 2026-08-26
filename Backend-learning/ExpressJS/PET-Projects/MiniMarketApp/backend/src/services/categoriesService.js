// path: backend/src/services/categoriesService.js
const categoryRepo = require('../repositories/categoryRepository');
const cache = require('../utils/cache');
const {BadRequestError} = require('../middlewares/errors/errorHandler');
const prisma = require('../config/prisma');

class CategoryService {
    /** GET Method for get all categories
     * @return {Promise<Category[]>} - Category data
     * **/
    async getCategories() {
        const cacheKey = 'categories';
        let categories = await cache.get(cacheKey);

        if (!categories) {
            categories = await categoryRepo.findAll();
            if(categories && categories.length > 0) {
                await cache.set(cacheKey, categories);
            }
        }
        return categories;
    };

    /** GET Method for get category by ID
     * @param {string} categoryId - Category ID
     * @return {Promise<Category>} - Category data
     * **/
    async getCategoryById(categoryId) {
        const cacheKey = `categories:${categoryId}`;
        let category = await cache.get(cacheKey);

        if (!category) {
            category = await categoryRepo.findById(categoryId);
            if (category && category.length > 0) {
                await cache.set(cacheKey, category);
            }
        }
        return category;
    };

    /** POST method for create category
    * @param {Object} categoryData - Category data
    * @return {promise<Object>} - Category data
    * **/
    async createCategory(categoryData) {
        const cacheKey = 'categories';
        const createCategory = await categoryRepo.create(categoryData);
        await cache.del(cacheKey);
        return createCategory;
    };

    /** PUT method for update category
     * @param {string} categoryData.id - Category ID
     * @param {Object} categoryData - Category data
    * **/
    async updateCategory(categoryId, categoryData) {
        const cacheKey = 'categories';
        const updateCategory = await categoryRepo.update(categoryId, categoryData);
        await cache.del(cacheKey);
        return updateCategory;
    };

    /** DELETE method for delete category
     * @param {string} categoryId - Category ID
     * @return {Promise<object>} - Deleted category
     * **/
    async deleteCategory(categoryId) {
        const cacheKey = 'categories';
        
        // Удаляем все товары в этой категории
        const { count } = await prisma.product.deleteMany({
            where: { categoryId }
        });
        console.log(`Deleted ${count} products`);
        
        // Удаляем категорию
        const deletedCategory = await categoryRepo.delete(categoryId);
        await cache.del(cacheKey);
        return deletedCategory;
    };
}

module.exports = new CategoryService();