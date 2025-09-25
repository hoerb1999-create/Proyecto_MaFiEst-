const { Recording, User } = require('../models');
const { Op } = require('sequelize');

class RecordingService {
    async createRecording(recordingData) {
        const { title, description, driveLink, type, groupId, userId } = recordingData;

        // Validate permissions by type
        const user = await User.findByPk(userId);
        if (type === 'general' && user.role !== 'administrator') {
            throw new Error('Only administrators can create general recordings');
        }
        if (type === 'group' && user.role !== 'teacher') {
            throw new Error('Only teachers can create group recordings');
        }

        // Validate group for group recordings
        if (type === 'group' && !groupId) {
            throw new Error('Group recordings require a groupId');
        }

        // Create recording
        return await Recording.create({
            title,
            description,
            driveLink,
            type,
            groupId,
            userId
        });
    }

    async getRecording(recordingId, userId) {
        const user = await User.findByPk(userId);
        const recording = await Recording.findByPk(recordingId);

        if (!recording) {
            throw new Error('Recording not found');
        }

        // Verify access
        if (recording.type === 'group') {
            if (user.role === 'independent' || 
               (user.role === 'student' && user.groupId !== recording.groupId)) {
                throw new Error('You do not have access to this recording');
            }
        }

        return recording;
    }

    async updateRecording(recordingId, updateData, userId) {
        const recording = await Recording.findOne({
            where: {
                id: recordingId,
                userId
            }
        });

        if (!recording) {
            throw new Error('Recording not found or unauthorized');
        }

        await recording.update(updateData);
        return recording;
    }

    async deleteRecording(recordingId, userId) {
        const recording = await Recording.findOne({
            where: {
                id: recordingId,
                userId
            }
        });

        if (!recording) {
            throw new Error('Recording not found or unauthorized');
        }

        await recording.destroy();
        return { message: 'Recording successfully deleted' };
    }

    async getAccessibleRecordings(userId) {
        const user = await User.findByPk(userId);
        let whereClause = {};

        switch (user.role) {
            case 'administrator':
                // See all recordings
                break;
            case 'teacher':
                whereClause = {
                    [Op.or]: [
                        { type: 'general' },
                        { groupId: user.groupId }
                    ]
                };
                break;
            case 'student':
                whereClause = {
                    [Op.or]: [
                        { type: 'general' },
                        { groupId: user.groupId }
                    ]
                };
                break;
            case 'independent':
                whereClause = {
                    type: 'general'
                };
                break;
        }

        return await Recording.findAll({
            where: whereClause,
            include: [{
                model: User,
                attributes: ['username'],
                as: 'creator'
            }],
            order: [['createdAt', 'DESC']]
        });
    }
}

module.exports = new RecordingService();
