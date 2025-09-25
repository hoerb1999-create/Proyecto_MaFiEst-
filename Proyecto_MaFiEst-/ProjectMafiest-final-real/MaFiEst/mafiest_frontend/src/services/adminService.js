const { User } = require('../models');
const recordingService = require('./recordingService');

class AdminService {
    async createTeacherOrStudent({ username, email, password, role, groupId }) {
        if (!['teacher', 'student'].includes(role)) {
            throw new Error('Invalid role. Can only create teachers or students');
        }

        // Use userService to create user
        const userService = require('./userService');
        return await userService.createUser({
            username,
            email,
            password,
            role,
            groupId
        });
    }

    async createGeneralRecording(recordingData, adminId) {
        const admin = await User.findByPk(adminId);
        if (admin.role !== 'administrator') {
            throw new Error('Only administrators can create general recordings');
        }

        return await recordingService.createRecording({
            ...recordingData,
            type: 'general',
            userId: adminId,
            groupId: null
        });
    }

    async getTeachers() {
        return await User.findAll({
            where: { role: 'teacher' },
            attributes: ['id', 'username', 'email', 'groupId']
        });
    }

    async getStudents() {
        return await User.findAll({
            where: { role: 'student' },
            attributes: ['id', 'username', 'email', 'groupId']
        });
    }

    async updateUserRole(userId, newRole) {
        const user = await User.findByPk(userId);
        if (!user) {
            throw new Error('User not found');
        }

        if (!['teacher', 'student'].includes(newRole)) {
            throw new Error('Invalid role');
        }

        await user.update({ role: newRole });
        return user;
    }

    async assignGroup(userId, groupId) {
        const user = await User.findByPk(userId);
        if (!user) {
            throw new Error('User not found');
        }

        if (!['teacher', 'student'].includes(user.role)) {
            throw new Error('Groups can only be assigned to teachers and students');
        }

        await user.update({ groupId });
        return user;
    }
}

module.exports = new AdminService();
