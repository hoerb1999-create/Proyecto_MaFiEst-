import axios from 'axios';

const baseUrl = '/api/student-activities';

// Obtener actividades del estudiante
const getStudentActivities = async (groupId) => {
  const response = await axios.get(`${baseUrl}/group/${groupId}`);
  return response.data;
};

// Enviar una solución de actividad
const submitActivity = async (activityId, formData) => {
  const response = await axios.post(`${baseUrl}/${activityId}/submit`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
  return response.data;
};

// Obtener todas las entregas de un estudiante
const getMySubmissions = async () => {
  const response = await axios.get(`${baseUrl}/my-submissions`);
  return response.data;
};

// Obtener una entrega específica
const getSubmission = async (submissionId) => {
  const response = await axios.get(`${baseUrl}/submissions/${submissionId}`);
  return response.data;
};

const studentActivityService = {
  getStudentActivities,
  submitActivity,
  getMySubmissions,
  getSubmission
};

export default studentActivityService;