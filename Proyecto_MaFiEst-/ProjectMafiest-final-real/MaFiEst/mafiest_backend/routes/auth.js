const express = require('express');
const router = express.Router();
const auth = require('../controllers/auth');

// Enmascarar email en logs, no imprimir body completo
router.post('/login', async (req, res) => {
  try {
    const email = req.body?.email;
    console.log('POST /api/auth/login for:', email ? `${email.split('@')[0]}***@${email.split('@')[1]}` : 'unknown');
    await auth.login(req, res);
  } catch (err) {
    console.error('Route /login error:', err.message);
    res.status(500).json({ message: 'Error interno en /login' });
  }
});

router.post('/register', async (req, res) => {
  try {
    const email = req.body?.email;
    console.log('POST /api/auth/register for:', email ? `${email.split('@')[0]}***@${email.split('@')[1]}` : 'unknown');
    await auth.register(req, res);
  } catch (err) {
    console.error('Route /register error:', err.message);
    res.status(500).json({ message: 'Error interno en /register' });
  }
});

router.post('/logout', async (req, res) => {
  try {
    await auth.logout(req, res);
  } catch (err) {
    console.error('Route /logout error:', err.message);
    res.status(500).json({ message: 'Error interno en /logout' });
  }
});


module.exports = router;
