const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User } = require('../models');
const config = require('../utils/config');

class UserService {
    async hashPassword(password) {
        const saltRounds = 10;
        return await bcrypt.hash(password, saltRounds);
    }

    async createUser(userData) {
        const { username, email, password, role, groupId } = userData;
        
        // Validate unique email
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            throw new Error('Email is already registered');
        }

        // Encrypt password
        const hashedPassword = await this.hashPassword(password);

        // Create user
        const user = await User.create({
            username,
            email,
            password: hashedPassword,
            role,
            groupId: groupId || null
        });

        return user;
    }

    async login(email, password) {
        // Find user
        const user = await User.findOne({ where: { email } });
        if (!user) {
            throw new Error('User not found');
        }

        // Verify password
        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) {
            throw new Error('Invalid password');
        }

        // Generate token
        const token = jwt.sign(
            { 
                id: user.id, 
                email: user.email,
                role: user.role,
                groupId: user.groupId
            },
            config.JWT_SECRET,
            { expiresIn: '24h' }
        );

        return {
            token,
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                role: user.role,
                groupId: user.groupId
            }
        };
    }

    async updateProfile(userId, updateData) {
        const user = await User.findByPk(userId);
        if (!user) {
            throw new Error('User not found');
        }

        // If password change, encrypt it
        if (updateData.password) {
            updateData.password = await this.hashPassword(updateData.password);
        }

        // Update data
        await user.update(updateData);

        return {
            id: user.id,
            username: user.username,
            email: user.email,
            role: user.role,
            groupId: user.groupId
        };
    }

    async getProfile(userId) {
        const user = await User.findByPk(userId);
        if (!user) {
            throw new Error('User not found');
        }

        return {
            id: user.id,
            username: user.username,
            email: user.email,
            role: user.role,
            groupId: user.groupId
        };
    }
}

module.exports = new UserService();
