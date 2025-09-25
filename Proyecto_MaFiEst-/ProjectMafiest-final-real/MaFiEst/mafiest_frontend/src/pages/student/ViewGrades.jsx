import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ViewGrades = () => {
  const [grades, setGrades] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchGrades();
  }, []);

  const fetchGrades = async () => {
    try {
      const response = await axios.get('/api/activity-results/student');
      setGrades(response.data);
    } catch (error) {
      setMessage('Error al cargar las calificaciones');
    }
  };

  return (
    <div className="grades-container">
      <h2>Mis Calificaciones</h2>
      {message && <p>{message}</p>}
      <div className="grades-list">
        {grades.map(grade => (
          <div key={grade.id} className="grade-item">
            <h3>Actividad: {grade.activity.title}</h3>
            <p>Tipo: {grade.activity.type}</p>
            <p>Calificación: {grade.grade}</p>
            <p>Fecha de calificación: {new Date(grade.gradedAt).toLocaleDateString()}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ViewGrades;