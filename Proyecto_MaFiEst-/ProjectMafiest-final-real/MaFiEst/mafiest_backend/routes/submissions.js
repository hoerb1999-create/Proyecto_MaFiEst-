const express = require('express');
const router = express.Router();
const submissionsController = require('../controllers/submissions');
const { authenticateToken } = require('../utils/middleware');

// Todas las rutas requieren autenticación
router.use(authenticateToken);

// Middleware para verificar roles
const allowRoles = (roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ error: 'Usuario no autenticado' });
        }
        if (roles.includes(req.user.role)) {
            next();
        } else {
            res.status(403).json({ error: 'No tienes permiso para realizar esta acción' });
        }
    };
};

// Rutas de submissions
router.post('/activity/:activityId/submit',
    authenticateToken,
    allowRoles(['estudiante']),
    submissionsController.submitActivity
);

router.get('/:submissionId',
    authenticateToken,
    allowRoles(['docente', 'estudiante']),
    submissionsController.getSubmissionDetails
);

router.put('/:submissionId/grade',
    authenticateToken,
    allowRoles(['docente']),
    submissionsController.gradeSubmission
);

module.exports = router;