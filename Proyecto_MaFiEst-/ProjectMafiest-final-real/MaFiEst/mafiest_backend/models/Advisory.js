const { Model, DataTypes } = require('sequelize');
const sequelize = require('../utils/db');

class Advisory extends Model {}

Advisory.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id',
    },
  },
  message: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
}, {
  sequelize,
  modelName: 'Advisory',
  tableName: 'Advisories',
  timestamps: true,
});

module.exports = Advisory;
