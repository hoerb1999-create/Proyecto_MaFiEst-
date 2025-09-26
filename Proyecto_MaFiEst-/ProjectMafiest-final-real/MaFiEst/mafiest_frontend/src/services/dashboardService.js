import axios from 'axios';
const baseUrl = '/api/dashboard';

// Obtener datos del dashboard según el rol
const getDashboardData = async () => {
  const response = await axios.get(baseUrl);
  return response.data;
};

// Obtener estudiantes asociados a un grupoId (para docentes)
const getStudentsByGroup = async (grupoId) => {
  const response = await axios.get(`${baseUrl}/estudiantes/${grupoId}`);
  return response.data;
};

// Obtener todas las asesorías para docentes y administrador
const getAllAdvisories = async () => {
  const response = await axios.get(`${baseUrl}/asesorias`);
  return response.data;
};

// Obtener grabaciones según el rol y grupoId
const getRecordingsByRole = async () => {
  const response = await axios.get(`${baseUrl}/grabaciones`);
  return response.data;
};

const dashboardService = {
  getDashboardData,
  getStudentsByGroup,
  getAllAdvisories,
  getRecordingsByRole
};

export default dashboardService;