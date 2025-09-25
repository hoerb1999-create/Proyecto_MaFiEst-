import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { login as apiLogin } from '../services/authService';

const LoginForm = () => {
  const { login: authLogin } = useAuth();
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const creds = { email: fd.get('email'), password: fd.get('password') };

    try {
      const data = await apiLogin(creds);
      authLogin(data.user, data.token); // asegúrate que AuthContext tiene esta firma
    } catch (err) {
      setError(err.message || 'Login error');
    }
  };

  return (
    <div className="auth-card">
      <h3>Login</h3>
      {error && <div className="error">{error}</div>}
      <form onSubmit={handleSubmit}>
        <label>Email</label>
        <input name="email" type="email" required />
        <label>Password</label>
        <input name="password" type="password" required />
        <button type="submit" className="btn">Enter</button>
      </form>
    </div>
  );
};

export default LoginForm;