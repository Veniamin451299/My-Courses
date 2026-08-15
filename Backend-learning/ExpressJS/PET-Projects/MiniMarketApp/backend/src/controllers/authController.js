// path: backend/src/controllers/userController.js
const userService = require('../services/userService');
const JWTService = require('../utils/jwt');
const { UnauthorizedError, BadRequestError } = require('../middlewares/errors/errorHandler');
const { hash, compare } = require('../utils/bcrypt');
const hashedId = require('../utils/hashid');

class AuthController { 
    /** Register user
     * @route POST /auth/register
     * @access Public
     * **/ 
    async register(req, res, next) { 
        try {
            const { email, password } = req.body;

            const existUser = await userService.findByEmail(email);
            if (existUser) return next(new BadRequestError(`Email ${email} is already taken!`));

            const hashedPassword = await hash(password);
            const newUser = await userService.createUser(email, hashedPassword);

            const accessToken = JWTService.generateToken(newUser.id, newUser.role, '15m');
            const refreshToken = JWTService.generateToken(newUser.id, newUser.role, '7d');
            await userService.saveRefreshToken(newUser.id, refreshToken);

            newUser.id = hashedId.generateHash(newUser.id);
            delete newUser.password;

            res.status(201).json({
                message: "User registered successfully",
                data: {
                    id: newUser.id,
                    email: newUser.email,
                    accessToken,
                    refreshToken
                }
            });
        } catch (err) {
            next(new BadRequestError(`Interanl Server Error: ${err.message}`));
        }
    };

    /** Login user
     * @route POST /auth/login
     * @access Public
     * **/
    async login(req, res, next) { 
        try {
            const { email, password } = req.body;

            const user = await userService.findByEmail(email);
            if (!user) return next(new UnauthorizedError("Invalid email or password!"));

            const isPasswordValid = await compare(password, user.passwordHash);
            if (!isPasswordValid) return next(new UnauthorizedError("Invalid email or password"));

            const accessToken = JWTService.generateToken(user.id, user.role, '15m');
            const refreshToken = JWTService.generateToken(user.id, user.role, '7d');
            await userService.saveRefreshToken(user.id, refreshToken);

            res.json({
                message: "Login successfully",
                data:{
                    id: hashedId.generateHash(user.id),
                    email: user.email,
                    role: user.role,
                    accessToken,
                    refreshToken
                }
            });
        } catch (err) {
            next(new BadRequestError(`Interanl Server Error: ${err.message}`));
        }
    };

    /** Refresh token
     * @route POST /auth/refresh
     * @access Public
     * **/ 
    async refresh(req, res, next) { 
        const { refreshToken } = req.body;

        const decoded = JWTService.verifyToken(refreshToken);
        if (!decoded) return next(new UnauthorizedError("Invalid refresh token"));

        const storedToken = await userService.getRefreshToken(decoded.userId);
        if (storedToken !== refreshToken) return next(new UnauthorizedError("Invalid refresh token"));

        const newAccessToken = JWTService.generateToken(decoded.userId, decoded.role, "15m");
        const newRefreshToken = JWTService.generateToken(decoded.userId, decoded.role, "7d");
        await userService.saveRefreshToken(decoded.userId, newRefreshToken);

        res.json({
            accessToken: newAccessToken,
            refreshToken: newRefreshToken,
        });
    };

    /**logout user
     * @route POST /auth/logout
     * @access Public
     * **/
    async logout(req, res, next) { 
        try {
            await userService.deleteRefreshToken(req.user.id);
            res.status(200).json({ message: "Logout successfully" });
        } catch (err) {
            next(new BadRequestError(`Interanl Server Error: ${err.message}`));
        }
    };

    /** GET me
     * @route GET /auth/me
     * @access Private
     * **/
    async me(req, res, next) { 
        try {
            const decodedId = HashId.decodeHash(req.user.id);
            if (!decodedId) return next(new BadRequestError("Invalid user id"));

            const user = await userService.findUserById(decodedId);
            if (!user) return next(new UnauthorizedError("Invalid user"));

            res.json({
                message: "Get user successfully",
                data: {
                    id: hashedId.generateHash(user.id),
                    email: user.email,
                    role: user.role
                }
            });
        } catch (err) {
            next(new BadRequestError(`Interanl Server Error: ${err.message}`));
        }
    }
}

module.exports = new AuthController();