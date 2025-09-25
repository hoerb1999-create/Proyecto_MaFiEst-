import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/components/sidebar.css';

const Sidebar = ({ role: roleProp }) => {
  const { user, logout } = useAuth();
  const role = roleProp || user?.role;
  const [open, setOpen] = useState(false);
  const ddRef = useRef(null);

  useEffect(() => {
    const onClick = (e) => {
      if (ddRef.current && !ddRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, []);

  const initials = (name = '') =>
    name
      .split(' ')
      .map((s) => s[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();

  return (
    <aside className="sidebar">
      <div className="sidebar-top">
        <h2 className="brand">MaFiEst</h2>

        <div className="user-panel" ref={ddRef}>
          <button
            className="user-button"
            onClick={() => setOpen((s) => !s)}
            aria-expanded={open}
            aria-haspopup="true"
          >
            <div className="user-avatar">{initials(user?.name || 'U')}</div>
            <div className="user-info">
              <span className="user-name">{user?.name || 'Invitado'}</span>
              <span className="user-role">{role || '—'}</span>
            </div>
            <span className="chev">{open ? '▴' : '▾'}</span>
          </button>

          {open && (
            <div className="user-dropdown" role="menu">
              <Link to="/profile" className="dropdown-item" onClick={() => setOpen(false)}>
                Ver perfil
              </Link>
              <button
                className="dropdown-item logout"
                onClick={() => {
                  setOpen(false);
                  logout && logout();
                }}
              >
                Cerrar sesión
              </button>
            </div>
          )}
        </div>
      </div>

      <nav>
        <ul>
          {role === 'administrador' && (
            <>
              <li><Link to="/admin/dashboard">Dashboard</Link></li>
              <li><Link to="/admin/manage-users">Manejo de Usuarios</Link></li>
              <li><Link to="/admin/manage-groups">Manejo de Grupos</Link></li>
            </>
          )}
          {role === 'docente' && (
            <>
              <li><Link to="/teacher/dashboard">Dashboard</Link></li>
              <li><Link to="/teacher/upload-exams">Upload Exams</Link></li>
              <li><Link to="/teacher/upload-workshops">Upload Workshops</Link></li>
            </>
          )}
          {role === 'estudiante' && (
            <>
              <li><Link to="/student/dashboard">Dashboard</Link></li>
              <li><Link to="/student/courses">Cursos</Link></li>
              <li><Link to="/student/progress">Progreso</Link></li>
              <li><Link to="/student/achievements">Mis Logros</Link></li>
            </>
          )}
          {role === 'independiente' && (
            <>
              <li><Link to="/independent/dashboard">Dashboard</Link></li>
              <li><Link to="/independent/courses">Cursos</Link></li>
              <li><Link to="/independent/progress">Progreso</Link></li>
              <li><Link to="/independent/achievements">Mis Logros</Link></li>
            </>
          )}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
