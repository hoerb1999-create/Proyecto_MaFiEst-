// Middlewares de autorización por rol en MaFiEst

const isAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== 'administrador') {
    return res.status(403).json({ error: 'Acceso denegado: solo administradores' });
  }
  next();
};

const isTeacher = (req, res, next) => {
  if (!req.user || req.user.role !== 'docente') {
    return res.status(403).json({ error: 'Acceso denegado: solo docentes' });
  }
  next();
};

const isStudent = (req, res, next) => {
  if (!req.user || req.user.role !== 'estudiante') {
    return res.status(403).json({ error: 'Acceso denegado: solo estudiantes' });
  }
  next();
};


module.exports = {
  isAdmin,
  isTeacher,
  isStudent,
};
