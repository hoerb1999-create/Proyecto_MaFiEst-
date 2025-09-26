import axios from 'axios';
const baseUrl = '/api/advisories';

// Crear una asesoría (sin autenticación requerida)
const createAdvisory = async (advisoryData) => {
  const response = await axios.post(baseUrl, advisoryData);
  return response.data;
};

// Listar asesorías por email del solicitante
const getAdvisoriesByEmail = async (email) => {
  const response = await axios.get(`${baseUrl}/email/${email}`);
  return response.data;
};

// Listar todas las asesorías (para docentes y administrador)
const getAllAdvisories = async () => {
  const response = await axios.get(baseUrl);
  return response.data;
};

const advisoryService = {
  createAdvisory,
  getAdvisoriesByEmail,
  getAllAdvisories
};

export default advisoryService;