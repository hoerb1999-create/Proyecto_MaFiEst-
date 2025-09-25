const { Model, DataTypes } = require('sequelize');
const sequelize = require('../utils/db');

class Recording extends Model {}


Recording.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    title: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    driveLink: {
        type: DataTypes.STRING(255),
        allowNull: false,
        validate: {
            isUrl: true
        }
    },
    type: {
        type: DataTypes.ENUM('general'),
        allowNull: false
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Users',
            key: 'id'
        }
    }
}, {
    sequelize,
    modelName: 'Recording',
    tableName: 'Recordings',
    timestamps: true
});

module.exports = Recording;