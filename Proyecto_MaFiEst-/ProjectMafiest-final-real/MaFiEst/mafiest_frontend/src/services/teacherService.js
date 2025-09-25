const { User, Activity, ActivitySubmission } = require('../models');
const recordingService = require('./recordingService');
const activityService = require('./activityService');

class DocenteService {
    async createActivity(activityData, docenteId) {
        const docente = await User.findByPk(docenteId);
        if (docente.rol !== 'Docente') {
            throw new Error('Solo los docentes pueden crear actividades');
        }

        return await activityService.createActivity({
            ...activityData,
            docenteId,
            groupId: docente.groupId
        });
    }

    async createGroupRecording(recordingData, docenteId) {
        const docente = await User.findByPk(docenteId);
        if (docente.rol !== 'Docente') {
            throw new Error('Solo los docentes pueden crear grabaciones de grupo');
        }

        return await recordingService.createRecording({
            ...recordingData,
            tipo: 'grupo',
            userId: docenteId,
            groupId: docente.groupId
        });
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

        await submission.update({
            estado,
            nota,
            comentario
        });

        return submission;
    }

    async getGroupActivities(docenteId) {
        const docente = await User.findByPk(docenteId);
        return await Activity.findAll({
            where: { 
                docenteId,
                groupId: docente.groupId
            }
        });
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
            where: { activityId },
            include: [{
                model: User,
                attributes: ['id', 'nombreUsuario', 'correo']
            }]
        });
    }
}

module.exports = new DocenteService();
