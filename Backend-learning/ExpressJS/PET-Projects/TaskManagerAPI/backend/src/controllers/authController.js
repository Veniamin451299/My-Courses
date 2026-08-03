// path: backend/src/controllers/authController.js
const authService = require('../services/authService');
const {BadRequestError, NotFoundError, UnauthorizedError, InternalServerError} = require('../middleware/errorHandler');
const HashIdHelper = require('../utils/hashid');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

class AuthController {
    /** Registration
    * @route POST /api/auth/register
    * @description Register a new user
    * @access Public
    */
   async register(req, res, next) { 
        try {
            const {email, password} = req.body;

            // Cheking if the email is taken
            const existingUser = await authService.getUserByEmail(email);
            if (existingUser) return next(new BadRequestError(`Email ${email} is already taken!`));

            // Hashing password
            const hashedPassword = await bcrypt.hash(password, 10);

            // Save user in database
            const newUser = await authService.createUser(email, hashedPassword);

            // Masking ID for safety
            newUser.id = HashIdHelper.generateHash(newUser.id);

            // Deleting password from response
            delete newUser.password;

            res.status(201).json({ message: 'User registered successfully', data: newUser });
        } catch (err) {
            next(new InternalServerError(`Registration error: ${err.message}`));
        }
    }

    /** Login
    * @route POST /api/auth/login
    * @description Login a user
    * @access Public
    */
   async login(req, res, next) { 
    try {
        const {email, password} = req.body;

        // Finding user by email
        const user = await authService.getUserByEmail(email);
         if (!user) return next(new UnauthorizedError(`Invalid email or password!`));
        // Checking password by bcrypt
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) return next(new UnauthorizedError(`Invalid email or password!`));

        // If everything is ok, we create a token
        const token = jwt.sign(
            { id: user.id },      // Hidden real database ID token
            process.env.JWT_SECRET, 
            { expiresIn: '24h' }
        );

        // Provide the client with a masked ID and token
        res.status(200).json({
            message: 'User logged in successfully',
            data: {
                id: HashIdHelper.generateHash(user.id),
                email: user.email,
                token: token // The frontend will store this token and send it back to us
            }
        });

    } catch (err) {
        next(new InternalServerError(`Login error: ${err.message}`));
    }
  }

  /** Get user by ID
    * @route GET /api/auth/:id
    * @description Get a user by ID
    * @access Private
    */
   async getUserById(req, res, next) { 
    try {
        const idDecoded = HashIdHelper.decodeHash(req.params.id);
        if (!idDecoded) return next(new BadRequestError('Invalid user id'));

        const user = await authService.getUserById(idDecoded);
        if (!user) return next(new NotFoundError('User not found'));
        
        user.id = HashIdHelper.generateHash(user.id);
        res.json(user);
    } catch (error) {
        next(new InternalServerError(`Internal Server Error: ${error.message}`));
    }
  }
}

module.exports = new AuthController();