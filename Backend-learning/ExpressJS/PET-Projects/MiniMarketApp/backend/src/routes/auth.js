// path: backend/src/routes/auth.js
const router = require('express').Router();
const authController = require('../controllers/authController');
const { authMiddleware } = require('../middlewares/auth');
const validator = require('../middlewares/validation');
const { registerSchema, loginSchema, refreshTokenSchema } = require('../validators/authValidator');

// The first validation, then controller
router.post('/register', validator(registerSchema), authController.register);
router.post('/login', validator(loginSchema), authController.login);
router.post('/refresh', validator(refreshTokenSchema), authController.refresh);
// The first authMiddlewre, then controller
router.post('/logout', authMiddleware, authController.logout);
router.get('/me', authMiddleware, authController.me);

module.exports = router;