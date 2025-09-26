const recordingService = require('../services/recordingService');
const adminService = require('../services/adminService');
const teacherService = require('../services/teacherService');
const { AppError } = require('../utils/errorHandler');

const recordingsController = {
    async getGeneralRecordings(req, res, next) {
        try {
            const recordings = await recordingService.getGeneralRecordings();
            res.json(recordings);
        } catch (error) {
            next(error);
        }
    },

    async getTeacherRecordings(req, res, next) {
        try {
            const { teacherId } = req.params;
            const recordings = await recordingService.getTeacherRecordings(teacherId);
            res.json(recordings);
        } catch (error) {
            next(error);
        }
    },
    async createRecording(req, res, next) {
        try {
            const { title, description, driveLink, type } = req.body;
            let recording;

            switch (req.user.role) {
                case 'administrador':
                    if (type !== 'general') {
                        throw new AppError('Los administradores solo pueden crear grabaciones generales', 400);
                    }
                    recording = await adminService.createGeneralRecording({
                        title, description, driveLink
                    }, req.user.id);
                    break;

                case 'docente':
                    if (type !== 'class') {
                        throw new AppError('Los docentes solo pueden crear grabaciones de clase', 400);
                    }
                    recording = await teacherService.createRecording({
                        title, description, driveLink, type: 'class'
                    }, req.user.id);
                    break;

                default:
                    throw new AppError('Not authorized to create recordings', 403);
            }

            res.status(201).json(recording);
        } catch (error) {
            next(error);
        }
    },

    async getRecordings(req, res, next) {
        try {
            const recordings = await recordingService.getAccessibleRecordings(req.user.id);
            res.json(recordings);
        } catch (error) {
            next(error);
        }
    },

    async getRecordingById(req, res, next) {
        try {
            const recording = await recordingService.getRecording(req.params.id, req.user.id);
            res.json(recording);
        } catch (error) {
            next(error);
        }
    },

    async updateRecording(req, res, next) {
        try {
            const { title, description, driveLink } = req.body;
            const recording = await recordingService.updateRecording(
                req.params.id,
                { title, description, driveLink },
                req.user.id
            );
            res.json(recording);
        } catch (error) {
            next(error);
        }
    },

    async deleteRecording(req, res, next) {
        try {
            await recordingService.deleteRecording(req.params.id, req.user.id);
            res.status(204).end();
        } catch (error) {
            next(error);
        }
    }
};

module.exports = recordingsController;