// path: backend/src/controllers/productController.js
const productService = require('../services/productService');
const hashId = require('../utils/hashid');
const { NotFoundError, BadRequestError } = require('../middlewares/errors/errorHandler');

class ProductController {
    /** GET all products
     * @description Get all products by category, search, pages
     * @query category, name, page, limit
     * @route GET /api/products
     * @access Public
     * **/
    async getProducts(req, res, next) { 
        try {
            const { page, limit, category, name } = req.query;

            const products = await productService.getProducts({
                page: Number(page) || 1, 
                limit: Number(limit) || 10, 
                category, 
                name
            });
            if (!products) return next(new NotFoundError(), 'Product not found');

            const hashedProducts = products.data.map(product => ({
                ...product,
                id: hashId.generateHash(product.id),
                categoryId: hashId.generateHash(product.categoryId)
            }));
            res.status(200).json({
                message: 'Products retrieved successfully',
                data: hashedProducts
            });
        } catch (err) {
            next(new BadRequestError(`Bad request error: ${err.message}`));
        }
    };

    /** GET product by id
     * @description Get product by id
     * @route GET /products/:id
     * @access Public
     * **/
    async getProductById(req, res, next) { 
        try {
            const decodedProductId = hashId.decodeHash(req.params.id);
            if (!decodedProductId) return next(new BadRequestError('Invalid product id'));

            const product = await productService.getProductById(decodedProductId);
            if (!product) return next(new NotFoundError('Product not found'));

            product.id = hashId.generateHash(product.id);
            product.categoryId = hashId.generateHash(product.categoryId);
            res.status(200).json({
                message: 'Product retrieved successfully',
                data: product
            });
        } catch (err) {
            next(new BadRequestError(`Bad request error: ${err.message}`));
        }
    };

    /** (ADMIN) POST create product
     * @description Create a new product
     * @route POST /products
     * @access Private
     * **/
    async createProduct(req, res, next) { 
        try {
            const createdProduct = await productService.createProduct(req.body);
            if (!createdProduct) return next(new BadRequestError("Create product failed"));
            
            createdProduct.id = hashId.generateHash(createdProduct.id);
            createdProduct.categoryId = hashId.generateHash(createdProduct.categoryId);
            res.status(201).json({
                message: "Create product successfully",
                data: createdProduct
            });
        } catch (err) {
            next(new BadRequestError(`Bad request error: ${err.message}`));
        }
    };

    /** (ADMIN) PUT update product
     * @description Update product
     * @route PUT /products/:id
     * @access Private
     * **/ 
    async updateProduct(req, res, next) { 
        try {
            const decodedProductId = hashId.decodeHash(req.params.id);
            if (!decodedProductId) return next(new BadRequestError('Invalid product ID'));

            const updatedProduct = await productService.updateProduct(decodedProductId, req.body);
            if (!updatedProduct) return next(new NotFoundError('Product not found'));

            updatedProduct.id = hashId.generateHash(updatedProduct.id);
            updatedProduct.categoryId = hashId.generateHash(updatedProduct.categoryId);
            res.status(200).json({
                message: 'Update product successfully',
                data: updatedProduct
            });
        } catch (err) {
            next(new BadRequestError(`Bad request error: ${err.message}`));
        }
    };

    /** (ADMIN) DELETE product
     * @description Delete product by id
     * @route DELETE /products/:id
     * @access Private
     * **/
    async deleteProduct(req, res, next) { 
        try {
            const decodedProductId = hashId.decodeHash(req.params.id);
            if (!decodedProductId) return next(new BadRequestError('Invalid product id'));

            const deletedProduct = await productService.deleteProduct(decodedProductId);
            if (!deletedProduct) return next(new NotFoundError('Product not found'));
            
            deletedProduct.id = hashId.generateHash(deletedProduct.id);
            deletedProduct.categoryId = hashId.generateHash(deletedProduct.categoryId);
            res.status(200).json({
                message: 'Delete product successfully',
                data: deletedProduct
            });
        } catch (err) {
            next(new BadRequestError(`Bad request error: ${err.message}`));
        }
    };
}

module.exports = new ProductController();
