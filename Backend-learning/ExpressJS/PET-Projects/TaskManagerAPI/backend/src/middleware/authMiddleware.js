// path: backend/src/middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
const { UnauthorizedError } = require('./errorHandler');
const HashIdHelper = require('../utils/hashid');
const hashid = require('../utils/hashid');

const authMiddleware = (req, _res, next) => { 
    try {
        // Extract Authorization header
        const authHeader = req.headers['authorization'];
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return next(new UnauthorizedError('Access denied. Tokin is missing!'));
        }
        // Strip the word "Bearer " and take the raw token string.
        const token = authHeader.split(' ')[1];
        
        // Checking token
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        
        // КРИТИЧЕСКИ ВАЖНЫЙ ШАГ: Мы прикрепляем данные пользователя к объекту ЗАПРОСА
        // Теперь в ЛЮБОМ контроллере, который стоит за этой мидлварью, 
        // нам будет доступен реальный числовой ID юзера через `req.user.id`!
        req.user = { id: decodedToken.id };
        next();
    } catch (err) {
        next(new UnauthorizedError(`Invalid or expired token`));
    }   
};

module.exports = authMiddleware;