import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

const api = axios.create({
  baseURL: API_URL,
  timeout: 15000, // aumentar timeout
  headers: { 'Content-Type': 'application/json' }
});

export const login = async (credentials) => {
  try {
    const response = await api.post('/auth/login', credentials);
    if (response.data?.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      api.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
    }
    return response.data;
  } catch (error) {
    const status = error.response?.status;
    const body = error.response?.data;
    console.error('Login error status:', status, 'message:', body?.message || error.message);
    throw body || { message: error.message || 'Error de conexión' };
  }
};

export const register = async (userData) => {
  try {
    const res = await api.post('/auth/register', userData);
    return res.data;
  } catch (error) {
    const body = error.response?.data;
    console.error('Register error:', body?.message || error.message);
    throw body || { message: error.message || 'Error de registro' };
  }
};

export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  delete api.defaults.headers.common['Authorization'];
};

export const getCurrentUser = () => {
  const u = localStorage.getItem('user');
  return u ? JSON.parse(u) : null;
};