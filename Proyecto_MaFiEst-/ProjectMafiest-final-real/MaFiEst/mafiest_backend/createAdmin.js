
const bcrypt = require('bcrypt');
const sequelize = require('./utils/db');
const User = require('./models/User');

(async () => {
  try {
    // Ajustar estructura de tablas (agrega columnas faltantes)
    await sequelize.sync({ alter: true });
    console.log('✔ Tablas sincronizadas correctamente');

    // Verificar si ya existe un administrador
  const existingAdmin = await User.findOne({ where: { role: 'administrador' } });
    if (existingAdmin) {
      console.log('⚠ Ya existe un administrador:', existingAdmin.email);
      process.exit(0);
    }

    // Crear admin por defecto
    const hashedPassword = await bcrypt.hash('admin123', 10);
    const admin = await User.create({
      name: 'Super Admin',
      email: 'admin@mafiest.com',
      password: hashedPassword,
  role: 'administrador',
    });

    console.log('✅ Administrador creado con éxito:', admin.email);
    process.exit(0);
  } catch (error) {
    console.error('❌ Error creando administrador:', error);
    process.exit(1);
  }
})();