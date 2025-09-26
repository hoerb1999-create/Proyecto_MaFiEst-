import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import '../../styles/roles/teacher.css';
import AddRecordingButton from '../../components/AddRecordingButton';
import { useAuth } from '../../context/AuthContext';
import dashboardService from '../../services/dashboardService';

const TeacherDashboard = () => {
    const { user } = useAuth();
    const [students, setStudents] = useState([]);

    useEffect(() => {
        const fetchStudents = async () => {
            if (user?.groupId) {
                const studentsList = await dashboardService.getStudentsByGroup(user.groupId);
                setStudents(studentsList);
            }
        };
        fetchStudents();
    }, [user]);

    return (
        <div className="teacher-dashboard">
            <h1>Panel de Control del Docente</h1>
            <nav>
                <ul>
                    <li>
                        <Link to="/docente/students">Estudiantes del Grupo</Link>
                    </li>
                    <li>
                        <Link to="/docente/recordings">Grabaciones del Grupo</Link>
                    </li>
                    <li>
                        <Link to="/docente/advisories">Asesorías</Link>
                    </li>
                </ul>
            </nav>

            {students.length > 0 && (
                <div className="students-list">
                    <h2>Estudiantes del Grupo</h2>
                    <ul>
                        {students.map(student => (
                            <li key={student.id}>{student.fullName}</li>
                        ))}
                    </ul>
                </div>
            )}

            <AddRecordingButton />
        </div>
    );
};

export default TeacherDashboard;
