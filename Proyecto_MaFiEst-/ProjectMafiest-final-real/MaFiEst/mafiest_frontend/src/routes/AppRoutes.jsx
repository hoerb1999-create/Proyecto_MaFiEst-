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

// Páginas de administrador
import AdminDashboard from '../pages/administrador/Dashboard';
import ManageUsers from '../pages/administrador/ManageUsers';
import ManageGroups from '../pages/administrador/ManageGroups';
import AdminRecordings from '../pages/administrador/Recordings';

// Páginas de estudiante
import StudentDashboard from '../pages/estudiante/Dashboard';
import ViewActivities from '../pages/estudiante/ViewActivities';
import SubmitActivity from '../pages/estudiante/SubmitActivity';
import ViewSubmissions from '../pages/estudiante/ViewSubmissions';
import StudentViewRecordings from '../pages/estudiante/ViewRecordings';

// Páginas de profesor
import TeacherDashboard from '../pages/docente/Dashboard';
import ActivityManagement from '../pages/docente/ActivityManagement';
import SubmissionReview from '../pages/docente/SubmissionReview';
import TeacherRecordings from '../pages/docente/Recordings';

// Páginas de independiente
import IndependentDashboard from '../pages/independiente/Dashboard';
import IndependentViewRecordings from '../pages/independiente/ViewRecordings';

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

            {/* Rutas de administrador */}
            <Route path="/admin/*" element={
                <RutaProtegida allowedRoles={['administrador']}>
                    <Routes>
                        <Route path="dashboard" element={<AdminDashboard />} />
                        <Route path="manage-users" element={<ManageUsers />} />
                        <Route path="manage-groups" element={<ManageGroups />} />
                        <Route path="recordings" element={<AdminRecordings />} />
                    </Routes>
                </RutaProtegida>
            } />

            {/* Rutas de estudiante */}
            <Route path="/estudiante/*" element={
                <RutaProtegida allowedRoles={['estudiante']}>
                    <Routes>
                        <Route path="dashboard" element={<StudentDashboard />} />
                        <Route path="activities" element={<ViewActivities />} />
                        <Route path="activities/:id" element={<SubmitActivity />} />
                        <Route path="submissions" element={<ViewSubmissions />} />
                        <Route path="recordings" element={<StudentViewRecordings />} />
                        <Route path="advisories" element={<Advisory />} />
                    </Routes>
                </RutaProtegida>
            } />

            {/* Rutas de docente */}
            <Route path="/docente/*" element={
                <RutaProtegida allowedRoles={['docente']}>
                    <Routes>
                        <Route path="dashboard" element={<TeacherDashboard />} />
                        <Route path="activities" element={<ActivityManagement />} />
                        <Route path="submissions" element={<SubmissionReview />} />
                        <Route path="recordings" element={<TeacherRecordings />} />
                        <Route path="advisories" element={<Advisory />} />
                    </Routes>
                </RutaProtegida>
            } />

            {/* Rutas de independiente */}
            <Route path="/independiente/*" element={
                <RutaProtegida allowedRoles={['independiente']}>
                    <Routes>
                        <Route path="dashboard" element={<IndependentDashboard />} />
                        <Route path="recordings" element={<IndependentViewRecordings />} />
                        <Route path="advisories" element={<Advisory />} />
                        <Route path="contact" element={<Contact />} />
                    </Routes>
                </RutaProtegida>
            } />

            {/* Ruta 404 */}
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
};

export default AppRoutes;
