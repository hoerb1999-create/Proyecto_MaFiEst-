import React, { useState, useEffect } from 'react';
import axios from 'axios';

const GradeActivities = () => {
  const [submissions, setSubmissions] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const fetchSubmissions = async () => {
    try {
      const response = await axios.get('/api/activity-submissions');
      setSubmissions(response.data);
    } catch (error) {
      setMessage('Error al cargar las entregas');
    }
  };

  const handleGrade = async (submissionId, grade) => {
    try {
      await axios.post('/api/activity-results', {
        submissionId,
        grade
      });
      setMessage('Calificación guardada exitosamente');
      fetchSubmissions();
    } catch (error) {
      setMessage('Error al guardar la calificación');
    }
  };

  return (
    <div className="grade-container">
      <h2>Calificar Actividades</h2>
      {message && <p>{message}</p>}
      <div className="submissions-list">
        {submissions.map(submission => (
          <div key={submission.id} className="submission-item">
            <h3>Actividad: {submission.activity.title}</h3>
            <p>Estudiante: {submission.student.name}</p>
            <p>Fecha de entrega: {new Date(submission.submittedAt).toLocaleDateString()}</p>
            <input
              type="number"
              min="0"
              max="5"
              step="0.1"
              placeholder="Calificación"
              onChange={(e) => handleGrade(submission.id, e.target.value)}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default GradeActivities;