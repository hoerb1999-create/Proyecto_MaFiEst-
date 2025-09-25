const { User } = require('../models');
const bcrypt = require('bcryptjs');
const { AppError } = require('../utils/errorHandler');

const independentService = {
    async register(userData) {
        // Verificar si el correo ya está registrado
        const existingUser = await User.findOne({ where: { email: userData.email } });
        if (existingUser) {
            throw new AppError('El correo electrónico ya está registrado', 400);
        }

        // Hash del password
        const salt = await bcrypt.genSalt(10);
        userData.password = await bcrypt.hash(userData.password, salt);

        // Crear usuario con rol independiente
        const user = await User.create({
            ...userData,
            role: 'independiente'
        });

        // Excluir password del objeto retornado
        const { password, ...userWithoutPassword } = user.toJSON();
        return userWithoutPassword;
    }
};

module.exports = independentService;