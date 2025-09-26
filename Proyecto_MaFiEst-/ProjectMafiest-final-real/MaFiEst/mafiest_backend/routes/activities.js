const express = require('express');
const router = express.Router();
const activitiesController = require('../controllers/activities');
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

router.post('/', 
    tokenExtractor,
    userExtractor,
    allowRoles(['docente']),
    activitiesController.createActivity
);

router.get('/',
    tokenExtractor,
    userExtractor,
    allowRoles(['docente', 'estudiante']),
    activitiesController.getActivities
);

router.get('/:id',
    tokenExtractor,
    userExtractor,
    allowRoles(['docente', 'estudiante']),
    activitiesController.getActivityById
);

router.put('/:id',
    tokenExtractor,
    userExtractor,
    allowRoles(['docente']),
    activitiesController.updateActivity
);

router.delete('/:id',
    tokenExtractor,
    userExtractor,
    allowRoles(['docente']),
    activitiesController.deleteActivity
);

module.exports = router;