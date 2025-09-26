const { Model, DataTypes } = require('sequelize');
const sequelize = require('../utils/db');

class Submission extends Model {}

Submission.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  activityId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Activities',
      key: 'id'
    }
  },
  studentId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id'
    }
  },
  file: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },
  teacherComment: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  status: {
    type: DataTypes.ENUM('pendiente', 'aprobado', 'rechazado'),
    allowNull: false,
    defaultValue: 'pendiente'
  }
}, {
  sequelize,
  modelName: 'Submission',
  timestamps: true
});

module.exports = Submission;