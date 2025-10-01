// AppRoutes.jsx
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Páginas públicas
import Landing from '../pages/Landing';
import Login from '../pages/LoginForm';
import Register from '../pages/RegisterForm';

// Páginas protegidas generales
import Contact from '../pages/Contact';
import Advisory from '../pages/Advisory';
import Profile from '../pages/Profile';
import Recordings from '../pages/administrador/Recordings';

// Páginas de administrador
import AdminDashboard from '../pages/administrador/Dashboard';
import ManageUsers from '../pages/administrador/ManageUsers';
// import ManageGroups from '../pages/administrador/ManageGroups';

// Páginas de estudiante
import StudentDashboard from '../pages/estudiante/Dashboard';
// import ViewActivities from '../pages/estudiante/ViewActivities';
// import SubmitActivity from '../pages/estudiante/SubmitActivity';
// import ViewSubmissions from '../pages/estudiante/ViewSubmissions';

// Páginas de profesor
import TeacherDashboard from '../pages/docente/Dashboard';
// import ActivityManagement from '../pages/docente/ActivityManagement';
// import SubmissionReview from '../pages/docente/SubmissionReview';

// Páginas de independiente
import IndependentDashboard from '../pages/independiente/Dashboard';

// Componente de ruta protegida
import RutaProtegida from './RutaProtegida';

const AppRoutes = () => {
    const { user } = useAuth();

    const redirectToDashboard = () => {
        if (!user) return '/login';
        switch (user.role) {
            case 'administrador': return '/admin/dashboard';
            case 'docente': return '/docente/dashboard';
            case 'estudiante': return '/estudiante/dashboard';
            case 'independiente': return '/independiente/dashboard';
            default: return '/login';
        }
    };

    return (
        <Routes>
            {/* Rutas públicas */}
            <Route path="/" element={user ? <Navigate to={redirectToDashboard()} /> : <Landing />} />
            <Route path="/login" element={user ? <Navigate to={redirectToDashboard()} /> : <Login />} />
            <Route path="/register" element={user ? <Navigate to={redirectToDashboard()} /> : <Register />} />

            {/* Rutas protegidas generales */}
            <Route path="/contact" element={<RutaProtegida><Contact /></RutaProtegida>} />
            <Route path="/advisory" element={<RutaProtegida><Advisory /></RutaProtegida>} />
            <Route path="/profile" element={<RutaProtegida><Profile /></RutaProtegida>} />
            <Route path="/recordings" element={<RutaProtegida><Recordings /></RutaProtegida>} />

            {/* Rutas de administrador */}
            <Route path="/admin/*" element={
                <RutaProtegida allowedRoles={['administrador']}>
                    <Routes>
                        <Route path="dashboard" element={<AdminDashboard />} />
                        <Route path="manage-users" element={<ManageUsers />} />
                        <Route path="recordings" element={<Recordings />} />
                        <Route path="advisories" element={<Advisory />} />
                    </Routes>
                </RutaProtegida>
            } />

            {/* Rutas de estudiante */}
            <Route path="/estudiante/*" element={
                <RutaProtegida allowedRoles={['estudiante']}>
                    <Routes>
                        <Route path="dashboard" element={<StudentDashboard />} />
                        <Route path="recordings" element={<Recordings />} />
                        <Route path="advisories" element={<Advisory />} />
                        <Route path="activities" element={<ActivitySubmission />} />
                    </Routes>
                </RutaProtegida>
            } />

            {/* Rutas de docente */}
            <Route path="/docente/*" element={
                <RutaProtegida allowedRoles={['docente']}>
                    <Routes>
                        <Route path="dashboard" element={<TeacherDashboard />} />
                        <Route path="recordings" element={<Recordings />} />
                        <Route path="advisories" element={<Advisory />} />
                        <Route path="grade-activities" element={<GradeActivities />} />
                    </Routes>
                </RutaProtegida>
            } />

            {/* Rutas de independiente */}
            <Route path="/independiente/*" element={
                <RutaProtegida allowedRoles={['independiente']}>
                    <Routes>
                        <Route path="dashboard" element={<IndependentDashboard />} />
                        <Route path="recordings" element={<Recordings />} />
                        <Route path="advisories" element={<Advisory />} />
                    </Routes>
                </RutaProtegida>
            } />

            {/* Ruta 404 */}
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
};

export default AppRoutes;
