const { Recording, User } = require('../models');
const { Op } = require('sequelize');

class RecordingService {
    async createRecording(recordingData) {
        const { title, description, driveLink, type, userId } = recordingData;

        // Validate user exists
        const user = await User.findByPk(userId);
        if (!user) {
            throw new Error('Usuario no encontrado');
        }

        // Validate permissions by type
        if (type === 'general' && user.role !== 'administrador') {
            throw new Error('Solo los administradores pueden crear grabaciones generales');
        }
        if (type === 'class' && user.role !== 'docente') {
            throw new Error('Solo los docentes pueden crear grabaciones de clase');
        }

        // Create recording
        return await Recording.create({
            title,
            description,
            driveLink,
            type,
            userId
        });
    }

    async getRecording(recordingId, userId) {
        const user = await User.findByPk(userId);
        const recording = await Recording.findByPk(recordingId);

        if (!recording) {
            throw new Error('Grabación no encontrada');
        }

        // Verify access
        if (recording.type === 'class' && user.role === 'independiente') {
            throw new Error('No tienes acceso a esta grabación');
        }

        return recording;
    }

    async getGeneralRecordings() {
        return await Recording.findAll({
            where: {
                type: 'general'
            },
            include: [{
                model: User,
                attributes: ['username'],
                as: 'creator'
            }],
            order: [['createdAt', 'DESC']]
        });
    }

    async getTeacherRecordings(teacherId) {
        return await Recording.findAll({
            where: {
                userId: teacherId,
                type: 'class'
            },
            include: [{
                model: User,
                attributes: ['username'],
                as: 'creator'
            }],
            order: [['createdAt', 'DESC']]
        });
    }

    async getAccessibleRecordings(userId) {
        const user = await User.findByPk(userId);
        let whereClause = {};

        switch (user.role) {
            case 'administrador':
                // Ver todas las grabaciones
                break;
            case 'docente':
                whereClause = {
                    [Op.or]: [
                        { type: 'general' },
                        { userId } // Sus propias grabaciones
                    ]
                };
                break;
            case 'estudiante':
                whereClause = {
                    type: 'general'
                };
                break;
            case 'independiente':
                whereClause = {
                    type: 'general'
                };
                break;
            default:
                throw new Error('Rol no válido');
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

    async updateRecording(recordingId, updateData, userId) {
        const recording = await Recording.findOne({
            where: {
                id: recordingId,
                userId
            }
        });

        if (!recording) {
            throw new Error('Grabación no encontrada o no autorizado');
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
            throw new Error('Grabación no encontrada o no autorizado');
        }

        await recording.destroy();
        return { message: 'Grabación eliminada exitosamente' };
    }
}

module.exports = new RecordingService();