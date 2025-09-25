const activityService = require('../services/activityService');
const teacherService = require('../services/teacherService');
const studentService = require('../services/studentService');
const { AppError } = require('../utils/errorHandler');

const activityController = {
    async getActivities(req, res, next) {
        try {
            let activities;
            
            switch (req.user.role) {
                case 'docente':
                    activities = await teacherService.getGroupActivities(req.user.id);
                    break;
                case 'estudiante':
                    activities = await studentService.getAvailableActivities(req.user.id);
                    break;
                case 'administrador':
                    activities = await activityService.getActivitiesByGroup(req.user.groupId);
                    break;
                default:
                    throw new AppError('No está autorizado para ver las actividades', 403);
            }

            res.json(activities);
        } catch (error) {
            next(error);
        }
    },

    async getActivityById(req, res, next) {
        try {
            const activity = await activityService.getActivity(req.params.id);
            if (req.user.role === 'estudiante' && activity.groupId !== req.user.groupId) {
                throw new AppError('No tienes acceso a esta actividad', 403);
            }
            res.json(activity);
        } catch (error) {
            next(error);
        }
    },

    async createActivity(req, res, next) {
        try {
            if (req.user.role !== 'docente') {
                throw new AppError('Solo los docentes pueden crear actividades', 403);
            }

            const { title, description, deadline } = req.body;
            const activity = await teacherService.createActivity(
                { title, description, deadline },
                req.user.id
            );

            res.status(201).json(activity);
        } catch (error) {
            next(error);
        }
    },

    async updateActivity(req, res, next) {
        try {
            if (req.user.role !== 'docente') {
                throw new AppError('Solo los docentes pueden actualizar actividades', 403);
            }

            const { title, description, deadline } = req.body;
            const activity = await activityService.updateActivity(
                req.params.id,
                { title, description, deadline },
                req.user.id
            );

            res.json(activity);
        } catch (error) {
            next(error);
        }
    },

    async deleteActivity(req, res, next) {
        try {
            if (req.user.role !== 'docente') {
                throw new AppError('Solo los docentes pueden eliminar actividades', 403);
            }

            await activityService.deleteActivity(req.params.id, req.user.id);
            res.status(204).end();
        } catch (error) {
            next(error);
        }
    }
};

module.exports = activityController;
