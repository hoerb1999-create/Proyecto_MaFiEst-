
const sequelize = require('../utils/db');
const User = require('./User');
const Contact = require('./Contact');
const Advisory = require('./Advisory');
const Activity = require('./Activity');
const Submission = require('./Submission');
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

// Relaciones entre Activity y Submission
Activity.hasMany(Submission, { foreignKey: 'activityId' });
Submission.belongsTo(Activity, { foreignKey: 'activityId' });

// Relaciones entre User y Activity
User.hasMany(Activity, { foreignKey: 'teacherId' });
Activity.belongsTo(User, { as: 'teacher', foreignKey: 'teacherId' });

// Relaciones entre User y Submission
User.hasMany(Submission, { foreignKey: 'studentId' });
Submission.belongsTo(User, { as: 'student', foreignKey: 'studentId' });

module.exports = {
    User,
    Contact,
    Advisory,
    Activity,
    Submission,
    Recording
};

