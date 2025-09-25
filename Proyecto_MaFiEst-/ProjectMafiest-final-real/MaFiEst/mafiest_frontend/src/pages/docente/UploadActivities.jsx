import React, { useState } from 'react';
import axios from 'axios';

const UploadActivity = () => {
  const [activityData, setActivityData] = useState({
    title: '',
    description: '',
    type: 'examen',
    deadline: '',
    file: null
  });
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    
    Object.keys(activityData).forEach(key => {
      formData.append(key, activityData[key]);
    });

    try {
      await axios.post('/api/activities', formData);
      setMessage('Actividad subida exitosamente');
      setActivityData({ title: '', description: '', type: 'examen', deadline: '', file: null });
    } catch (error) {
      setMessage('Error al subir la actividad');
    }
  };

  return (
    <div className="upload-container">
      <h2>Subir Nueva Actividad</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Título"
          value={activityData.title}
          onChange={(e) => setActivityData({...activityData, title: e.target.value})}
        />
        <textarea
          placeholder="Descripción"
          value={activityData.description}
          onChange={(e) => setActivityData({...activityData, description: e.target.value})}
        />
        <select
          value={activityData.type}
          onChange={(e) => setActivityData({...activityData, type: e.target.value})}
        >
          <option value="examen">Examen</option>
          <option value="taller">Taller</option>
        </select>
        <input
          type="date"
          value={activityData.deadline}
          onChange={(e) => setActivityData({...activityData, deadline: e.target.value})}
        />
        <input
          type="file"
          onChange={(e) => setActivityData({...activityData, file: e.target.files[0]})}
        />
        <button type="submit">Subir Actividad</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default UploadActivity;