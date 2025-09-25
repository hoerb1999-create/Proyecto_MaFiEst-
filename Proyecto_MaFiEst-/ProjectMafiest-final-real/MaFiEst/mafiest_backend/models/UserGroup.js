const { Model, DataTypes } = require('sequelize');
const sequelize = require('../utils/db');

class UserGroup extends Model {}

UserGroup.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  groupId: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, {
  sequelize,
  modelName: 'UserGroup',
  tableName: 'UserGroups',
  timestamps: false
});

module.exports = UserGroup;
