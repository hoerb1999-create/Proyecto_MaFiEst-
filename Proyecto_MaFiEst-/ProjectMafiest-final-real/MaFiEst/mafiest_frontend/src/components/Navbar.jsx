import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/components/navbar.css';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/">MaFiEst</Link>
      </div>
      {/* Sin enlaces de páginas para evitar duplicados con el Sidebar */}
    </nav>
  );
};

export default Navbar;
