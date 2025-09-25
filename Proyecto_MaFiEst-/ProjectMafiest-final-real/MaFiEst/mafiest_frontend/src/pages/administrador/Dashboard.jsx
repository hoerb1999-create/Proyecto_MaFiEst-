import React from 'react';
import { Link } from 'react-router-dom';
import '../../styles/roles/admin.css'; 

const Dashboard = () => {
    return (
        <div className="admin-dashboard">
            <h1>Panel de Control del Administrador</h1>
            <div className="dashboard-links">
                <Link to="/admin/manage-users" className="dashboard-link">Gestionar Usuarios</Link>
            </div>
        </div>
    );
};

export default Dashboard;

