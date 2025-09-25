import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import '../../styles/pages/dashboard.css';

const Dashboard = () => {
    const { user } = useAuth();

    return (
        <div className="dashboard">
            <h1>Bienvenido{user?.name ? `, ${user.name}` : ''}</h1>
            <p>Como usuario independiente, aquí puedes gestionar tu progreso y acceder a los cursos disponibles.</p>
            
            <div className="dashboard-links">
                <Link to="/independent/courses" className="dashboard-link">
                    <div className="dashboard-link-content">
                        <i className="fas fa-book"></i>
                        <span>Ver Cursos</span>
                    </div>
                </Link>
                <Link to="/independent/progress" className="dashboard-link">
                    <div className="dashboard-link-content">
                        <i className="fas fa-chart-line"></i>
                        <span>Ver Progreso</span>
                    </div>
                </Link>
                <Link to="/independent/achievements" className="dashboard-link">
                    <div className="dashboard-link-content">
                        <i className="fas fa-trophy"></i>
                        <span>Mis Logros</span>
                    </div>
                </Link>
            </div>
        </div>
    );
};

export default Dashboard;
