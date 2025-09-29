const { Activity, Submission, User } = require('../models');
const { AppError } = require('../utils/errorHandler');

const activitiesController = {
    // Obtener actividades según el rol del usuario
    async getActivities(req, res, next) {
        try {
            const { role, id, groupId } = req.user;
            let activities;

            switch (role) {
                case 'docente':
                    // Docente ve sus actividades creadas
                    activities = await Activity.findAll({
                        where: { teacherId: id },
                        include: [{
                            model: Submission,
                            include: [{
                                model: User,
                                as: 'student',
                                attributes: ['id', 'name', 'email']
                            }]
                        }]
                    });
                    break;

                case 'estudiante':
                    // Estudiante ve actividades de su grupo
                    activities = await Activity.findAll({
                        where: { groupId },
                        include: [{
                            model: Submission,
                            where: { studentId: id },
                            required: false
                        }]
                    });
                    break;

                default:
                    throw new AppError('Rol no autorizado', 403);
            }

            res.json(activities);
        } catch (error) {
            next(error);
        }
    },

    // Obtener actividad por ID
    async getActivityById(req, res, next) {
        try {
            const activity = await Activity.findByPk(req.params.id, {
                include: [{
                    model: Submission,
                    include: [{
                        model: User,
                        as: 'student',
                        attributes: ['id', 'name', 'email']
                    }]
                }]
            });

            if (!activity) {
                throw new AppError('Actividad no encontrada', 404);
            }

            if (req.user.role === 'estudiante' && activity.groupId !== req.user.groupId) {
                throw new AppError('No tienes acceso a esta actividad', 403);
            }

            res.json(activity);
        } catch (error) {
            next(error);
        }
    },

    // Crear nueva actividad (solo docentes)
    async createActivity(req, res, next) {
        try {
            const { role, id, groupId } = req.user;
            
            if (role !== 'docente') {
                throw new AppError('Solo los docentes pueden crear actividades', 403);
            }

            const activity = await Activity.create({
                ...req.body,
                teacherId: id,
                groupId
            });

            res.status(201).json(activity);
        } catch (error) {
            next(error);
        }
    },

    // Actualizar actividad (solo docentes)
    async updateActivity(req, res, next) {
        try {
            if (req.user.role !== 'docente') {
                throw new AppError('Solo los docentes pueden actualizar actividades', 403);
            }

            const activity = await Activity.findOne({
                where: {
                    id: req.params.id,
                    teacherId: req.user.id
                }
            });

            if (!activity) {
                throw new AppError('Actividad no encontrada o no autorizado', 404);
            }

            await activity.update(req.body);
            res.json(activity);
        } catch (error) {
            next(error);
        }
    },

    // Eliminar actividad (solo docentes)
    async deleteActivity(req, res, next) {
        try {
            if (req.user.role !== 'docente') {
                throw new AppError('Solo los docentes pueden eliminar actividades', 403);
            }

            const activity = await Activity.findOne({
                where: {
                    id: req.params.id,
                    teacherId: req.user.id
                }
            });

            if (!activity) {
                throw new AppError('Actividad no encontrada o no autorizado', 404);
            }

            await activity.destroy();
            res.status(204).end();
        } catch (error) {
            next(error);
        }
    }
};

module.exports = activitiesController;
