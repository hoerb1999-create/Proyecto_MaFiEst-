require('dotenv').config();
const { sequelize } = require('./models');
const logger = require('./utils/logger');
const app = require('./app');

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  try {
    await sequelize.authenticate();
    logger.info('✅ Database connection established successfully.');

    // Solo sincronizar en desarrollo
    if (process.env.NODE_ENV === 'development') {
      await sequelize.sync({ alter: true }); // 🔥 acá toda la sync
      logger.info('🛠 Database synced (development mode)');
    }

    // Sincronizar modelos con la base de datos
    sequelize.sync({ force: false }) // force: true borrará y recreará las tablas
      .then(() => {
        console.log('✅ Tablas sincronizadas');
        // Iniciar el servidor después de sincronizar
        app.listen(PORT, () => {
          console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
        });
      })
      .catch(error => {
        console.error('❌ Error sincronizando tablas:', error);
      });
  } catch (error) {
    logger.error('❌ Unable to connect to the database:', error);
    process.exit(1);
  }
};

startServer();