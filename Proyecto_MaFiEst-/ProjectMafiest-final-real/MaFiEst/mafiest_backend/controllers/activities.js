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
    },

    // Enviar entrega de actividad (solo estudiantes)
    async submitActivity(req, res, next) {
        try {
            const { role, id } = req.user;
            const { activityId } = req.params;
            const { file } = req.body;

            if (role !== 'estudiante') {
                throw new AppError('Solo los estudiantes pueden enviar entregas', 403);
            }

            const activity = await Activity.findByPk(activityId);
            if (!activity) {
                throw new AppError('Actividad no encontrada', 404);
            }

            const submission = await Submission.create({
                activityId,
                studentId: id,
                file,
                status: 'pendiente'
            });

            res.status(201).json(submission);
        } catch (error) {
            next(error);
        }
    },

    // Calificar entrega (solo docentes)
    async gradeSubmission(req, res, next) {
        try {
            const { role } = req.user;
            const { submissionId } = req.params;
            const { status, teacherComment } = req.body;

            if (role !== 'docente') {
                throw new AppError('Solo los docentes pueden calificar entregas', 403);
            }

            const submission = await Submission.findByPk(submissionId, {
                include: [{ 
                    model: Activity,
                    where: { teacherId: req.user.id }
                }]
            });

            if (!submission) {
                throw new AppError('Entrega no encontrada o no autorizado', 404);
            }

            await submission.update({ status, teacherComment });
            res.json(submission);
        } catch (error) {
            next(error);
        }
    },

    // Obtener detalles de una entrega
    async getSubmissionDetails(req, res, next) {
        try {
            const { role, id } = req.user;
            const { submissionId } = req.params;
            let submission;

            if (role === 'estudiante') {
                submission = await Submission.findOne({
                    where: { 
                        id: submissionId,
                        studentId: id
                    }
                });
            } else if (role === 'docente') {
                submission = await Submission.findOne({
                    where: { id: submissionId },
                    include: [{
                        model: Activity,
                        where: { teacherId: id }
                    }]
                });
            }

            if (!submission) {
                throw new AppError('Entrega no encontrada o no autorizado', 404);
            }

            res.json(submission);
        } catch (error) {
            next(error);
        }
    }
};

module.exports = activitiesController;
