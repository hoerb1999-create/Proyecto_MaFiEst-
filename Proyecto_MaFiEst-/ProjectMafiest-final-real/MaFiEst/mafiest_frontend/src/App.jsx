// App.jsx
import React from 'react';
import { useAuth } from './context/AuthContext';
import AppRoutes from './routes/AppRoutes';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Landing from './pages/Landing';
import './styles/global.css';

const App = () => {
  const { user } = useAuth();

  // Si no hay usuario, mostramos el Landing (contiene login/registro)
  if (!user) {
    return <Landing />;
  }

  // Usuario autenticado -> layout con navbar + sidebar + rutas protegidas
  return (
    <div className="app-container">
      <Navbar />
      <div className="app-layout">
        <Sidebar />
        <main className="main-content">
          <AppRoutes />
        </main>
      </div>
    </div>
  );
};

export default App;