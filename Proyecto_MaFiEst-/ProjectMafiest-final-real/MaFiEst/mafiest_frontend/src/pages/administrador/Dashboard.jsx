import React from 'react';
import { Link } from 'react-router-dom';
import '../../styles/roles/admin.css';
import AddRecordingButton from '../../components/AddRecordingButton';

const Dashboard = () => {
    return (
        <div className="admin-dashboard">
            <h1>Panel de Control del Administrador</h1>
            <div className="dashboard-links">
                <Link to="/admin/manage-users" className="dashboard-link">Gestionar Usuarios</Link>
                <Link to="/admin/recordings" className="dashboard-link">Grabaciones Generales</Link>
                <Link to="/admin/advisories" className="dashboard-link">Asesorías</Link
            </div>
            <AddRecordingButton />
        </div>
    );
};

export default Dashboard;

