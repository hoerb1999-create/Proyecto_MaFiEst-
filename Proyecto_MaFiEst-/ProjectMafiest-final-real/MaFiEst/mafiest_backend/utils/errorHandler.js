// Middleware de manejo de errores global
const errorHandler = (err, req, res, next) => {
    console.error(err);

    // Errores de validación de Sequelize
    if (err.name === 'SequelizeValidationError') {
        return res.status(400).json({
            error: 'Error de validación',
            details: err.errors.map(e => ({
                field: e.path,
                message: e.message
            }))
        });
    }

    // Errores de JWT
    if (err.name === 'JsonWebTokenError') {
        return res.status(401).json({
            error: 'Token inválido o expirado'
        });
    }

    // Errores personalizados de la aplicación
    if (err.isCustom) {
        return res.status(err.statusCode || 400).json({
            error: err.message
        });
    }

    // Error por defecto
    return res.status(500).json({
        error: 'Error interno del servidor'
    });
};

// Custom error class
class AppError extends Error {
    constructor(message, statusCode = 400) {
        super(message);
        this.statusCode = statusCode;
        this.isCustom = true;
    }
}

module.exports = {
    errorHandler,
    AppError
};