import axios from 'axios';

const baseUrl = '/api/docente';

// Obtener todas las entregas del grupo
const getGroupSubmissions = async (groupId) => {
  const response = await axios.get(`${baseUrl}/group/${groupId}/submissions`);
  return response.data;
};

// Calificar una entrega
const gradeSubmission = async (submissionId, gradeData) => {
  const response = await axios.post(`${baseUrl}/submissions/${submissionId}/grade`, gradeData);
  return response.data;
};

// Obtener una entrega específica con todos sus detalles
const getSubmissionDetails = async (submissionId) => {
  const response = await axios.get(`${baseUrl}/submissions/${submissionId}`);
  return response.data;
};

// Obtener estudiantes del grupo
const getGroupStudents = async (groupId) => {
  const response = await axios.get(`${baseUrl}/group/${groupId}/students`);
  return response.data;
};

const docenteService = {
  getGroupSubmissions,
  gradeSubmission,
  getSubmissionDetails,
  getGroupStudents
};

export default docenteService;