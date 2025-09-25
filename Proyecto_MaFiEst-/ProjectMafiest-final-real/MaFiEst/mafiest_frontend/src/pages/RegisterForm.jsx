import React, { useState } from 'react';
import { register as apiRegister } from '../services/authService';

const RegisterForm = () => {
  const [msg, setMsg] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const user = { name: fd.get('name'), email: fd.get('email'), password: fd.get('password') };

    try {
      const data = await apiRegister(user);
      setMsg(data.message || 'Registrado correctamente. Inicia sesión.');
      setError(null);
    } catch (err) {
      setError(err.message || 'Error al registrar');
      setMsg(null);
    }
  };

  return (
    <div className="auth-card">
      <h3>Registrarse</h3>
      {msg && <div className="success">{msg}</div>}
      {error && <div className="error">{error}</div>}
      <form onSubmit={handleSubmit}>
        <label>Nombre</label>
        <input name="name" type="text" required />
        <label>Email</label>
        <input name="email" type="email" required />
        <label>Contraseña</label>
        <input name="password" type="password" required />
        <button type="submit" className="btn">Crear cuenta</button>
      </form>
    </div>
  );
};

export default RegisterForm;