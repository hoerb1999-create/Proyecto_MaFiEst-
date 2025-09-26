import axios from 'axios';
const baseUrl = '/api/recordings';

// Crear una grabación (para administrador y docente)
const createRecording = async (recordingData) => {
  const response = await axios.post(baseUrl, recordingData);
  return response.data;
};

// Listar grabaciones por tipo (general o grupo)
const getRecordingsByType = async (tipo) => {
  const response = await axios.get(`${baseUrl}/tipo/${tipo}`);
  return response.data;
};

// Listar grabaciones por grupoId (para docentes y estudiantes)
const getRecordingsByGroup = async (grupoId) => {
  const response = await axios.get(`${baseUrl}/grupo/${grupoId}`);
  return response.data;
};

// Obtener todas las grabaciones generales
const getGeneralRecordings = async () => {
  const response = await axios.get(`${baseUrl}/general`);
  return response.data;
};

const recordingService = {
  createRecording,
  getRecordingsByType,
  getRecordingsByGroup,
  getGeneralRecordings
};

export default recordingService;