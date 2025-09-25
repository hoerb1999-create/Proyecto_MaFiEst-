const { User, Activity, ActivitySubmission, Recording } = require('../models');
const { Op } = require('sequelize');

class EstudianteService {
    async submitActivity(submissionData, studentId) {
        const student = await User.findByPk(studentId);
        if (student.rol !== 'Estudiante') {
            throw new Error('Solo los estudiantes pueden entregar actividades');
        }

        const activity = await Activity.findOne({
            where: {
                id: submissionData.actividadId
            }
        });        if (!activity) {
            throw new Error('Actividad no encontrada o no pertenece a tu grupo');
        }

        return await ActivitySubmission.create({
            ...submissionData,
            studentId,
            estado: 'pendiente'
        });
    }

    async getMySubmissions(studentId) {
        return await ActivitySubmission.findAll({
            where: { studentId },
            include: [{
                model: Activity,
                attributes: ['titulo', 'descripcion', 'fechaLimite']
            }]
        });
    }

    async getAvailableActivities(studentId) {
        const student = await User.findByPk(studentId);
        return await Activity.findAll({
            include: [{
                model: User,
                attributes: ['nombreUsuario'],
                as: 'docente'
            }]
        });
    }

    async getAccessibleRecordings(studentId) {
        const student = await User.findByPk(studentId);
        return await Recording.findAll({
            where: {
                tipo: 'general'
            },
            include: [{
                model: User,
                attributes: ['nombreUsuario'],
                as: 'creador'
            }]
        });
    }

    async getSubmissionDetails(submissionId, studentId) {
        const submission = await ActivitySubmission.findOne({
            where: {
                id: submissionId,
                studentId
            },
            include: [{
                model: Activity,
                attributes: ['titulo', 'descripcion', 'fechaLimite']
            }]
        });

        if (!submission) {
            throw new Error('Entrega no encontrada');
        }

        return submission;
    }
}

module.exports = new EstudianteService();
