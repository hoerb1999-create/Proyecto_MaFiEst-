import axios from 'axios';

const API_URL = '/api/activities';

const activityService = {
    // Obtener todas las actividades del grupo del usuario
    getActivities: async () => {
        const response = await axios.get(API_URL);
        return response.data;
    },

    // Crear una nueva actividad (solo docentes)
    createActivity: async (activityData) => {
        const response = await axios.post(API_URL, activityData);
        return response.data;
    },

    // Enviar una entrega (solo estudiantes)
    submitActivity: async (activityId, submissionData) => {
        const response = await axios.post(`${API_URL}/${activityId}/submit`, submissionData);
        return response.data;
    },

    // Calificar una entrega (solo docentes)
    gradeSubmission: async (submissionId, gradeData) => {
        const response = await axios.put(`${API_URL}/submissions/${submissionId}/grade`, gradeData);
        return response.data;
    },

    // Obtener detalles de una entrega
    getSubmissionDetails: async (submissionId) => {
        const response = await axios.get(`${API_URL}/submissions/${submissionId}`);
        return response.data;
    },

    // Actualizar una actividad
    updateActivity: async (activityId, activityData) => {
        const response = await axios.put(`${API_URL}/${activityId}`, activityData);
        return response.data;
    },

    // Eliminar una actividad
    deleteActivity: async (activityId) => {
        await axios.delete(`${API_URL}/${activityId}`);
    },

    // Obtener actividades por grupo
    getActivitiesByGroup: async (groupId) => {
        const response = await axios.get(`${API_URL}/group/${groupId}`);
        return response.data;
    }
};

export default activityService;
