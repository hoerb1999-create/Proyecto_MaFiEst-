const { ActivitySubmission, Activity, User } = require('../models');

class ActividadSubmissionService {
    async createSubmission(submissionData) {
        const { actividadId, studentId, descripcion, linkDrive } = submissionData;

        // Verificar que la actividad existe y pertenece al grupo del estudiante
        const activity = await Activity.findByPk(actividadId);
        const student = await User.findByPk(studentId);

        if (!activity || activity.groupId !== student.groupId) {
            throw new Error('Actividad no encontrada o no pertenece a tu grupo');
        }

        // Verificar que no haya pasado la fecha límite
        if (new Date() > new Date(activity.fechaLimite)) {
            throw new Error('La fecha límite de entrega ha pasado');
        }

        return await ActivitySubmission.create({
            actividadId,
            studentId,
            descripcion,
            linkDrive,
            estado: 'pendiente'
        });
    }

    async updateSubmission(submissionId, updateData) {
        const submission = await ActivitySubmission.findByPk(submissionId);
        if (!submission) {
            throw new Error('Entrega no encontrada');
        }

        // Solo permitir actualizar si está pendiente
        if (submission.estado !== 'pendiente') {
            throw new Error('No se puede modificar una entrega ya revisada');
        }

        await submission.update(updateData);
        return submission;
    }

    async reviewSubmission(submissionId, reviewData, docenteId) {
        const { estado, nota, comentario } = reviewData;

        const submission = await ActivitySubmission.findByPk(submissionId, {
            include: [{
                model: Activity,
                where: { docenteId }
            }]
        });

        if (!submission) {
            throw new Error('Entrega no encontrada o no autorizada');
        }

        // Validar estado
        if (!['revisado', 'aprobado', 'rechazado'].includes(estado)) {
            throw new Error('Estado inválido');
        }

        // Validar nota si se proporciona
        if (nota !== null && (nota < 0 || nota > 5)) {
            throw new Error('La nota debe estar entre 0 y 5');
        }

        await submission.update({
            estado,
            nota,
            comentario
        });

        return submission;
    }

    async getSubmission(submissionId, userId, rol) {
        let submission;

        if (rol === 'Estudiante') {
            submission = await ActivitySubmission.findOne({
                where: {
                    id: submissionId,
                    studentId: userId
                }
            });
        } else if (rol === 'Docente') {
            submission = await ActivitySubmission.findOne({
                where: { id: submissionId },
                include: [{
                    model: Activity,
                    where: { docenteId: userId }
                }]
            });
        }

        if (!submission) {
            throw new Error('Entrega no encontrada o no autorizada');
        }

        return submission;
    }

    async getSubmissionsForActivity(activityId, docenteId) {
        const activity = await Activity.findOne({
            where: { 
                id: activityId,
                docenteId
            }
        });

        if (!activity) {
            throw new Error('Actividad no encontrada o no autorizada');
        }

        return await ActivitySubmission.findAll({
            where: { actividadId: activityId },
            include: [{
                model: User,
                attributes: ['nombreUsuario', 'correo']
            }]
        });
    }
}

module.exports = new ActividadSubmissionService();
