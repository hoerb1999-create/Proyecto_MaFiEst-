// const userService = require('../services/userService');
// const adminService = require('../services/adminService');
const { AppError } = require('../utils/errorHandler');

const userController = {
    async getAllUsers(req, res, next) {
        try {
            const users = await userService.getAllUsers();
            res.json(users);
        } catch (error) {
            next(error);
        }
    },

    async getUserById(req, res, next) {
        try {
            const user = await userService.getUserById(req.params.id);
            res.json(user);
        } catch (error) {
            next(error);
        }
    },

    async updateUser(req, res, next) {
        try {
            const updatedUser = await userService.updateUser(req.params.id, req.body);
            res.json(updatedUser);
        } catch (error) {
            next(error);
        }
    },

    async deleteUser(req, res, next) {
        try {
            await userService.deleteUser(req.params.id);
            res.status(204).end();
        } catch (error) {
            next(error);
        }
    },
    async createUser(req, res, next) {
        try {
            const { username, email, password, role, groupId } = req.body;

            if (req.user.role !== 'administrador') {
                throw new AppError('No autorizado. Solo el administrador puede crear usuarios', 403);
            }

            const user = await adminService.createTeacherOrStudent({
                username,
                email,
                password,
                role,
                groupId
            });

            res.status(201).json(user);
        } catch (error) {
            next(error);
        }
    },

    async getProfile(req, res, next) {
        try {
            const profile = await userService.getProfile(req.user.id);
            res.json(profile);
        } catch (error) {
            next(error);
        }
    },

    async updateProfile(req, res, next) {
        try {
            const { username, email, password } = req.body;
            const updatedUser = await userService.updateProfile(req.user.id, {
                username,
                email,
                password
            });
            res.json(updatedUser);
        } catch (error) {
            next(error);
        }
    },

    async getTeachers(req, res, next) {
        try {
            if (req.user.role !== 'administrador') {
                throw new AppError('Unauthorized', 403);
            }
            const teachers = await adminService.getTeachers();
            res.json(teachers);
        } catch (error) {
            next(error);
        }
    },

    async getStudents(req, res, next) {
        try {
            if (!['administrador', 'docente'].includes(req.user.role)) {
                throw new AppError('Unauthorized', 403);
            }
            const students = await adminService.getStudents();
            res.json(students);
        } catch (error) {
            next(error);
        }
    }
};

module.exports = userController;
