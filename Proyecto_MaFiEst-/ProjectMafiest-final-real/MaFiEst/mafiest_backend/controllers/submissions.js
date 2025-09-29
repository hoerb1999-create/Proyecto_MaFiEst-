const { Activity, Submission, User } = require('../models');
const { AppError } = require('../utils/errorHandler');

const submissionsController = {
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

module.exports = submissionsController;