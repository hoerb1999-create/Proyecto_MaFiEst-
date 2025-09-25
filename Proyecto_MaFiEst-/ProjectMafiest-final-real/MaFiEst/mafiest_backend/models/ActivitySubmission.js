const { Model, DataTypes } = require('sequelize');
const sequelize = require('../utils/db');

class ActivitySubmission extends Model {}

ActivitySubmission.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  activityId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  studentId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  driveLink: {
    type: DataTypes.STRING,
    allowNull: true,
    validate: {
      isUrl: true
    }
  },
  status: {
    type: DataTypes.ENUM('pending', 'reviewed', 'approved', 'rejected'),
    defaultValue: 'pending',
    allowNull: false
  },
  grade: {
    type: DataTypes.FLOAT,
    allowNull: true
  },
  comment: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  sequelize,
  modelName: 'ActivitySubmission',
  tableName: 'ActivitySubmissions',
  timestamps: true
});

module.exports = ActivitySubmission;
