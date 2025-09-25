const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { User } = require("../models").models;

const authController = {
  // Registro de usuarios independientes
  async register(req, res) {
    try {
      const { name, email, password } = req.body;

      // Verificar si el usuario ya existe
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        return res.status(400).json({ message: "El email ya está registrado" });
      }

      // Crear nuevo usuario
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await User.create({
        name,
        email,
        password: hashedPassword,
        role: 'estudiante'
      });

      res.status(201).json({
        message: "Usuario registrado exitosamente",
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role
        }
      });
    } catch (error) {
      console.error("Register error:", error);
      res.status(500).json({ message: "Error en el servidor" });
    }
  },

  // Inicio de sesión
  async login(req, res) {
    console.log("[LOGIN] Solicitud recibida");
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        console.log("[LOGIN] Faltan credenciales");
        return res.status(400).json({ message: "Email y contraseña requeridos" });
      }

      const user = await User.findOne({ where: { email } });
      if (!user) {
        console.log("[LOGIN] Usuario no encontrado");
        return res.status(401).json({ message: "Credenciales inválidas" });
      }

      // bcrypt.compare puede quedarse colgado si el hash es inválido, por eso log previo
      console.log("[LOGIN] Usuario encontrado, verificando contraseña...");
      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) {
        console.log("[LOGIN] Contraseña incorrecta");
        return res.status(401).json({ message: "Credenciales inválidas" });
      }

      // Generar token JWT
      console.log("[LOGIN] Contraseña válida, generando token...");
      let token;
      try {
        token = jwt.sign(
          { id: user.id, email: user.email, role: user.role },
          process.env.JWT_SECRET || "devsecret",
          { expiresIn: "1h" }
        );
      } catch (err) {
        console.error("[LOGIN] Error generando token:", err);
        return res.status(500).json({ message: "Error generando token" });
      }

      console.log("[LOGIN] Login exitoso, enviando respuesta");
      return res.json({
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role
        }
      });
    } catch (error) {
      console.error("[LOGIN] Error inesperado:", error);
      return res.status(500).json({ message: "Error en el servidor" });
    }
  },

  // Cierre de sesión
  logout(req, res) {
    res.json({ message: "Sesión cerrada exitosamente" });
  }
};

module.exports = authController;
