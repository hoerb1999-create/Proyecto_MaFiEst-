const { Model, DataTypes } = require('sequelize');
const sequelize = require('../utils/db');

class Activity extends Model {}

Activity.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  dueDate: {
    type: DataTypes.DATE,
    allowNull: false
  },
  teacherId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id'
    }
  },
  groupId: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, {
  sequelize,
  modelName: 'Activity',
  timestamps: true
});

module.exports = Activity;