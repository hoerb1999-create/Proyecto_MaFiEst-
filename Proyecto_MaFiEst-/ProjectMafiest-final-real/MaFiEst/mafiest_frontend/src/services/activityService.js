const { Activity, User } = require('../models');

class ActivityService {
    async createActivity(activityData) {
        const { titulo, descripcion, docenteId, groupId, fechaLimite } = activityData;

        const docente = await User.findOne({
            where: { 
                id: docenteId,
                rol: 'Docente',
                groupId
            }
        });

        if (!docente) {
            throw new Error('Docente no encontrado o no autorizado para este grupo');
        }

        return await Activity.create({
            titulo,
            descripcion,
            docenteId,
            groupId,
            fechaLimite
        });
    }

    async getActivity(activityId) {
        const activity = await Activity.findByPk(activityId, {
            include: [{
                model: User,
                attributes: ['nombreUsuario'],
                as: 'docente'
            }]
        });

        if (!activity) {
            throw new Error('Actividad no encontrada');
        }

        return activity;
    }

    async updateActivity(activityId, updateData, docenteId) {
        const activity = await Activity.findOne({
            where: {
                id: activityId,
                docenteId
            }
        });

        if (!activity) {
            throw new Error('Actividad no encontrada o no autorizada');
        }

        await activity.update(updateData);
        return activity;
    }

    async deleteActivity(activityId, docenteId) {
        const activity = await Activity.findOne({
            where: {
                id: activityId,
                docenteId
            }
        });

        if (!activity) {
            throw new Error('Actividad no encontrada o no autorizada');
        }

        await activity.destroy();
        return { message: 'Actividad eliminada correctamente' };
    }

    async getActivitiesByGroup(groupId) {
        return await Activity.findAll({
            where: { groupId },
            include: [{
                model: User,
                attributes: ['nombreUsuario'],
                as: 'docente'
            }],
            order: [['fechaLimite', 'DESC']]
        });
    }
}

module.exports = new ActivityService();
