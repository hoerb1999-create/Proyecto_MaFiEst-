const { Model, DataTypes } = require('sequelize');
const sequelize = require('../utils/db');

class Contact extends Model {}

Contact.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isEmail: true,
    },
  },
  message: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
}, {
  sequelize,
  modelName: 'Contact',
  tableName: 'Contacts',
  timestamps: true,
});

module.exports = Contact;
