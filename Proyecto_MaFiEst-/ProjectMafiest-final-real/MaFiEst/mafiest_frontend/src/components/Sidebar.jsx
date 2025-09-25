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
              <span className="user-name">{user?.name || 'Guest'}</span>
              <span className="user-role">{role || '—'}</span>
            </div>
            <span className="chev">{open ? '▴' : '▾'}</span>
          </button>

          {open && (
            <div className="user-dropdown" role="menu">
              <Link to="/profile" className="dropdown-item" onClick={() => setOpen(false)}>
                View Profile
              </Link>
              <button
                className="dropdown-item logout"
                onClick={() => {
                  setOpen(false);
                  logout && logout();
                }}
              >
                Logout
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
              <li><Link to="/admin/manage-users">Manage Users</Link></li>
              <li><Link to="/admin/manage-groups">Manage Groups</Link></li>
            </>
          )}
          {role === 'docente' && (
            <>
              <li><Link to="/docente/dashboard">Dashboard</Link></li>
              <li><Link to="/docente/activities">Actividades</Link></li>
              <li><Link to="/docente/submissions">Entregas</Link></li>
              <li><Link to="/docente/recordings">Grabaciones</Link></li>
              <li><Link to="/docente/advisories">Asesorías</Link></li>
            </>
          )}
          {role === 'estudiante' && (
            <>
              <li><Link to="/estudiante/dashboard">Dashboard</Link></li>
              <li><Link to="/estudiante/activities">Actividades</Link></li>
              <li><Link to="/estudiante/submissions">Mis Entregas</Link></li>
              <li><Link to="/estudiante/recordings">Grabaciones</Link></li>
              <li><Link to="/estudiante/advisories">Asesorías</Link></li>
            </>
          )}
          {role === 'independiente' && (
            <>
              <li><Link to="/independiente/dashboard">Dashboard</Link></li>
              <li><Link to="/independiente/recordings">Grabaciones</Link></li>
              <li><Link to="/independiente/advisories">Asesorías</Link></li>
              <li><Link to="/independiente/contact">Contacto</Link></li>
            </>
          )}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
