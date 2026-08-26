// path: backend/src/controllers/cartController.js
const cartService = require('../services/cartService');
const { NotFoundError, BadRequestError } = require('../middlewares/errors/errorHandler');
const hashId = require('../utils/hashid');

class CartController {
    /** GET method
     * @description Get user cart
     * @route GET /cart
     * @access public
     * **/ 
    async getCart(req, res, next) {
        try {
            const decodedUserId = hashId.decodeHash(req.user.hashedId);
            if (!decodedUserId) return next(new BadRequestError('Invalid user id'));

            const cart = await cartService.getCart(decodedUserId);
            if (!cart) return next(new NotFoundError('Cart not found'));

            return res.status(200).json({ 
                message: "Get cart successfully", 
                data: hashId.transformCart(cart) }); 
        } catch (error) {
            return next(new BadRequestError(`Bad request error: ${error.message}`));
        }
    };

    /** POST method
     * @description Add product to cart
     * @route POST /cart/items/:cartItemId
     * @access public
     * **/ 
    async addItem(req, res, next) {
        try {
            const decodedUserId = hashId.decodeHash(req.user.hashedId);
            if (!decodedUserId) return next(new BadRequestError('Invalid user id'));

            const decodedProductId = hashId.decodeHash(req.body.productId);
            const quantity = req.body.quantity;

            const cart = await cartService.addItem(decodedUserId, decodedProductId, quantity);
            if (!cart) return next(new NotFoundError('Cart not found'));

            return res.status(201).json({ 
                message: "Add item to cart successfully", 
                data: hashId.transformCart(cart) });
        } catch (error) {
            return next(new BadRequestError(`Bad request error: ${error.message}`));       
        }
    };

    /** PUT method
     * @description Update product quantity in cart
     * @route PUT /cart/items/:cartItemId
     * @access public
     * **/ 
    async updateItemQuantity(req, res, next) {
        try {
            const decodedUserId = hashId.decodeHash(req.user.hashedId);
            if (!decodedUserId) return next(new BadRequestError('Invalid user id'));

            const cartItemId = hashId.decodeHash(req.params.id);
            if (!cartItemId) return next(new BadRequestError('Invalid cart item id'));
            const newQuantity = req.body.quantity;

            const updatedCart = await cartService.updateItemQuantity(decodedUserId, cartItemId, newQuantity);
            if (!updatedCart) return next(new NotFoundError('Cart not found'));

            return res.status(200).json({ 
                message: "Update item in cart successfully", 
                data: hashId.transformCart(updatedCart) });
        } catch (error) {
            return next(new BadRequestError(`Bad request error: ${error.message}`));       
        }
    };

    /** DELETE method
     * @description Remove cart item from cart
     * @route DELETE /cart/items:cartItemId
     * @access public
     * **/
    async deleteCartItem(req, res, next) {
      try{
        const decodedUserId = hashId.decodeHash(req.user.hashedId);
        if (!decodedUserId) return next(new BadRequestError('Invalid user id'));

        const cartItemId = hashId.decodeHash(req.params.id);
        if (!cartItemId) return next(new BadRequestError('Invalid cart item id'));
        
        const deletedCart = await cartService.deleteCartItem(decodedUserId, cartItemId);
        if (!deletedCart) return next(new NotFoundError('Cart not found'));

        return res.status(200).json({
            message: "Delete cart item successfully",
            data: hashId.transformCart(deletedCart)
        })
      } catch (error) {
          return next(new BadRequestError(`Bad request error: ${error.message}`));
      } 
    };

    /** DELETE method
     * @descriptionc clear user cart
     * @route DELETE /cart
     * @access public
     * **/
    async clearCart(req, res, next) {
        try {
            const decodedUserId = hashId.decodeHash(req.user.hashedId);
            if (!decodedUserId) return next(new BadRequestError('Invalid user id'));

            const clearCart = await cartService.clearCart(decodedUserId);
            if (!clearCart) return next(new NotFoundError('Cart not found'));

            return res.status(200).json({
                message: "Clear cart successfully",
                data: hashId.transformCart(clearCart)
            })
        } catch (error) {
            return next(new BadRequestError(`Bad request error: ${error.message}`));
        }
    };
}

module.exports = new CartController();