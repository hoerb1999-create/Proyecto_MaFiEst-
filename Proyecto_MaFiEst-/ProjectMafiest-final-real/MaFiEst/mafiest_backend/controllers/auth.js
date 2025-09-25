const userService = require('../services/userService');
const independentService = require('../services/independentService');
const { AppError } = require('../utils/errorHandler');

const authController = {
    async register(req, res, next) {
        try {
            const { username, email, password } = req.body;

            if (!username || !email || !password) {
                throw new AppError('All fields are required', 400);
            }

            const user = await independentService.register({
                username,
                email,
                password
            });

            res.status(201).json({
                message: 'User registered successfully',
                user: {
                    id: user.id,
                    username: user.username,
                    email: user.email,
                    role: user.role
                }
            });
        } catch (error) {
            next(error);
        }
    },

    async login(req, res, next) {
        try {
            const { email, password } = req.body;

            if (!email || !password) {
                throw new AppError('Email and password are required', 400);
            }

            const result = await userService.login(email, password);

            res.json(result);
        } catch (error) {
            next(error);
        }
    },

    logout(req, res) {
        // Token is handled client-side
        res.json({ message: 'Session successfully closed' });
    }
};

module.exports = authController;
