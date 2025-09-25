// AppRoutes.jsx
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Páginas públicas
import Landing from '../pages/Landing';
import Login from '../pages/Login';
import Register from '../pages/Register';

// Páginas protegidas generales
import Contact from '../pages/Contact';
import Advisory from '../pages/Advisory';
import Profile from '../pages/Profile';
import Recordings from '../pages/Recordings';

// Páginas de administrador
import AdminDashboard from '../pages/admin/Dashboard';
import ManageUsers from '../pages/admin/ManageUsers';
import ManageGroups from '../pages/admin/ManageGroups';

// Páginas de estudiante
import StudentDashboard from '../pages/student/Dashboard';
import ViewActivities from '../pages/student/ViewActivities';
import SubmitActivity from '../pages/student/SubmitActivity';
import ViewGrades from '../pages/student/ViewGrades';
import ViewTracking from '../pages/student/ViewTracking';

// Páginas de profesor
import TeacherDashboard from '../pages/teacher/Dashboard';
import UploadActivities from '../pages/teacher/UploadActivities';
import GradeActivity from '../pages/teacher/GradeActivity';
import TrackStudents from '../pages/teacher/TrackStudents';

// Páginas de independiente
import IndependentDashboard from '../pages/independent/Dashboard';

// Componente de ruta protegida
import RutaProtegida from './RutaProtegida';

const AppRoutes = () => {
    const { user } = useAuth();

    const redirectToDashboard = () => {
        if (!user) return '/login';
        switch (user.role) {
            case 'administrador': return '/admin/dashboard';
            case 'docente': return '/teacher/dashboard';
            case 'estudiante': return '/student/dashboard';
            case 'independiente': return '/independent/dashboard';
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
                        <Route path="manage-groups" element={<ManageGroups />} />
                    </Routes>
                </RutaProtegida>
            } />

            {/* Rutas de estudiante */}
            <Route path="/student/*" element={
                <RutaProtegida allowedRoles={['estudiante']}>
                    <Routes>
                        <Route path="dashboard" element={<StudentDashboard />} />
                        <Route path="activities" element={<ViewActivities />} />
                        <Route path="submit-activity/:id" element={<SubmitActivity />} />
                        <Route path="grades" element={<ViewGrades />} />
                        <Route path="tracking" element={<ViewTracking />} />
                    </Routes>
                </RutaProtegida>
            } />

            {/* Rutas de profesor */}
            <Route path="/teacher/*" element={
                <RutaProtegida allowedRoles={['docente']}>
                    <Routes>
                        <Route path="dashboard" element={<TeacherDashboard />} />
                        <Route path="activities/upload" element={<UploadActivities />} />
                        <Route path="activities/grade/:id" element={<GradeActivity />} />
                        <Route path="track-students" element={<TrackStudents />} />
                    </Routes>
                </RutaProtegida>
            } />

            {/* Rutas de independiente */}
            <Route path="/independent/*" element={
                <RutaProtegida allowedRoles={['independiente']}>
                    <Routes>
                        <Route path="dashboard" element={<IndependentDashboard />} />
                    </Routes>
                </RutaProtegida>
            } />

            {/* Ruta 404 */}
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
};

export default AppRoutes;
