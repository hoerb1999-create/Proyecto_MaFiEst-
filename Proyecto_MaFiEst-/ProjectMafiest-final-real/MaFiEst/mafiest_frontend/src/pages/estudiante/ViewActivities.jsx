import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ViewActivities = () => {
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const response = await axios.get('/api/activities');
        setActivities(response.data);
      } catch (error) {
        console.error('Error al cargar actividades:', error);
      }
    };
    fetchActivities();
  }, []);

  return (
    <div className="activities-container">
      <h2>Actividades Disponibles</h2>
      <div className="activities-list">
        {activities.map((activity) => (
          <div key={activity.id} className="activity-card">
            <h3>{activity.title}</h3>
            <p>Tipo: {activity.type}</p>
            <p>Fecha límite: {new Date(activity.deadline).toLocaleDateString()}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ViewActivities;