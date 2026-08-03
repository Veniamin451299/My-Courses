// path: backend/src/routes/authRouter.js
const { Router } = require('express');
const authController = require('../controllers/authController');
const { registerSchema, validator } = require('../middleware/validators/validator');

const router = Router();

    // POST /api/auth/register
    router.post('/register', validator(registerSchema), authController.register);

    // POST /api/auth/login
    router.post('/login', validator(registerSchema), authController.login);

module.exports = router;