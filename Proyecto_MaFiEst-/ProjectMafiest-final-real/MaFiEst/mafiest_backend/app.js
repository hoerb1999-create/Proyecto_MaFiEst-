const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const middleware = require('./utils/middleware');

// Rutas
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const contactRoutes = require('./routes/contacts');
const advisoryRoutes = require('./routes/advisories');
const activityRoutes = require('./routes/activities');
const submissionRoutes = require('./routes/submissions');
const recordingRoutes = require('./routes/recordings');

const app = express();

// Middlewares globales
app.use(morgan('dev'));
app.use(cors());
app.use(express.json());

// Rutas públicas
app.use('/api/auth', authRoutes);

// Aplicar tokenExtractor para rutas protegidas
app.use(middleware.tokenExtractor);

// Rutas protegidas
app.use('/api/users', userRoutes);
app.use('/api/contacts', contactRoutes);
app.use('/api/advisories', advisoryRoutes);
app.use('/api/activities', activityRoutes);
app.use('/api/submissions', submissionRoutes);
app.use('/api/recordings', recordingRoutes);

// Health check
app.get('/', (req, res) => res.json({ ok: true }));

// Manejo de errores
app.use(middleware.errorHandler);

module.exports = app;
