import React, { useState, useEffect } from 'react';
import axios from 'axios';

const SubmitActivity = () => {
  const [activities, setActivities] = useState([]);
  const [selectedActivity, setSelectedActivity] = useState('');
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchActivities();
  }, []);

  const fetchActivities = async () => {
    try {
      const response = await axios.get('/api/activities');
      setActivities(response.data);
    } catch (error) {
      setMessage('Error al cargar actividades');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('activityId', selectedActivity);
    formData.append('file', file);

    try {
      await axios.post('/api/activity-submissions', formData);
      setMessage('Actividad enviada exitosamente');
      setFile(null);
      setSelectedActivity('');
    } catch (error) {
      setMessage('Error al enviar la actividad');
    }
  };

  return (
    <div className="submit-container">
      <h2>Entregar Actividad</h2>
      <form onSubmit={handleSubmit}>
        <select
          value={selectedActivity}
          onChange={(e) => setSelectedActivity(e.target.value)}
        >
          <option value="">Selecciona una actividad</option>
          {activities.map(activity => (
            <option key={activity.id} value={activity.id}>
              {activity.title} - {activity.type}
            </option>
          ))}
        </select>
        <input
          type="file"
          onChange={(e) => setFile(e.target.files[0])}
        />
        <button type="submit">Enviar</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default SubmitActivity;