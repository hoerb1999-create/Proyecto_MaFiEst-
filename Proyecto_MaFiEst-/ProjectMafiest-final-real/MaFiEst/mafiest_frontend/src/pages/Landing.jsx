import React, { useState } from 'react';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';
import '../styles/pages/landing.css';

const Landing = () => {
  const [tab, setTab] = useState('login'); // 'login' | 'register'

  return (
    <div className="landing-page">
      <header className="landing-header">
        <h1 className="brand">MaFiEst</h1>
        <div className="tab-buttons">
          <button onClick={() => setTab('login')} className={tab === 'login' ? 'active' : ''}>Iniciar Sesión</button>
          <button onClick={() => setTab('register')} className={tab === 'register' ? 'active' : ''}>Registrarse</button>
        </div>
      </header>

      <section className="landing-content container">
        <div className="landing-left">
          <h2>Bienvenido a MaFiEst</h2>
          <p>Accede o regístrate aquí mismo. Después te redirigiremos según tu rol.</p>
        </div>

        <div className="landing-auth" aria-live="polite">
          {tab === 'login' ? <LoginForm /> : <RegisterForm />}
        </div>
      </section>
    </div>
  );
};

export default Landing;
