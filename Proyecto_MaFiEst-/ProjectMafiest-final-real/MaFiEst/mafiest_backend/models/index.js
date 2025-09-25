
const sequelize = require('../utils/db');
const User = require('./User');
const Contact = require('./Contact');
const Advisory = require('./Advisory');
const Activity = require('./Activity');
const ActivitySubmission = require('./ActivitySubmission');
const Recording = require('./Recording');

// Relaciones principales
Recording.belongsTo(User, { as: 'creador', foreignKey: 'userId' });
User.hasMany(Recording, { foreignKey: 'userId' });

// Contacto
User.hasMany(Contact, { foreignKey: 'usuarioId' });
Contact.belongsTo(User, { foreignKey: 'usuarioId' });

// Asesorías
User.hasMany(Advisory, { foreignKey: 'usuarioId' });
Advisory.belongsTo(User, { foreignKey: 'usuarioId' });

// Actividades
Activity.belongsTo(User, { foreignKey: 'teacherId' });
User.hasMany(Activity, { foreignKey: 'teacherId' });

// Entregas de actividades
ActivitySubmission.belongsTo(User, { foreignKey: 'studentId' });
ActivitySubmission.belongsTo(Activity, { foreignKey: 'activityId' });
User.hasMany(ActivitySubmission, { foreignKey: 'studentId' });
Activity.hasMany(ActivitySubmission, { foreignKey: 'activityId' });

module.exports = {
    sequelize,
    models: {
        User,
        Contact,
        Advisory,
        Activity,
        ActivitySubmission,
        Recording
    }
};

