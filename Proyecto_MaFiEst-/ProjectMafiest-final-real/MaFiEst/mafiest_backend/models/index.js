const sequelize = require('../utils/db'); 

// Importar modelos
const User = require('./User');
const Group = require('./Group');
const Contact = require('./Contact');
const Advisory = require('./Advisory');
const Activity = require('./Activity');
const ActivityResult = require('./ActivityResult');
const ActivitySubmission = require('./ActivitySubmission');
const Recording = require('./Recording');
const Tracking = require('./Tracking');
const UserGroup = require('./UserGroup');

// =======================
// Definir relaciones
// =======================

// Grabaciones
Recording.belongsTo(User, { as: 'creador', foreignKey: 'creadoPorId' });

// Seguimiento
Tracking.belongsTo(User, { as: 'estudiante', foreignKey: 'estudianteId' });
Tracking.belongsTo(User, { as: 'docente', foreignKey: 'docenteId' });

// Grupos y Usuarios (relación N:M con tabla intermedia)
Group.belongsToMany(User, { through: UserGroup, foreignKey: 'grupoId' });
User.belongsToMany(Group, { through: UserGroup, foreignKey: 'usuarioId' });

// Contacto
User.hasMany(Contact, { foreignKey: 'usuarioId' });
Contact.belongsTo(User, { foreignKey: 'usuarioId' });

// Asesorías
User.hasMany(Advisory, { foreignKey: 'usuarioId' });
Advisory.belongsTo(User, { foreignKey: 'usuarioId' });

// Actividades
Activity.belongsTo(User, { foreignKey: 'docenteId' });
Activity.belongsTo(Group, { foreignKey: 'grupoId' });
User.hasMany(Activity, { foreignKey: 'docenteId' });
Group.hasMany(Activity, { foreignKey: 'grupoId' });

// Resultados de actividades
ActivityResult.belongsTo(User, { foreignKey: 'estudianteId' });
ActivityResult.belongsTo(Activity, { foreignKey: 'actividadId' });
User.hasMany(ActivityResult, { foreignKey: 'estudianteId' });
Activity.hasMany(ActivityResult, { foreignKey: 'actividadId' });

// Entregas de actividades
ActivitySubmission.belongsTo(User, { foreignKey: 'estudianteId' });
ActivitySubmission.belongsTo(Activity, { foreignKey: 'actividadId' });
User.hasMany(ActivitySubmission, { foreignKey: 'estudianteId' });
Activity.hasMany(ActivitySubmission, { foreignKey: 'actividadId' });

module.exports = {
    sequelize,
    models: {
        User,
        Group,
        Contact,
        Advisory,
        Activity,
        ActivityResult,
        ActivitySubmission,
        Recording,
        Tracking,
        UserGroup
    }
};

