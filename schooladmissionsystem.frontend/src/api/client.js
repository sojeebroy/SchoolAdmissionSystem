import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const client = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

client.interceptors.request.use((config) => {
  const studentId = localStorage.getItem('studentId');
  if (studentId) {
    config.headers['X-Student-Id'] = studentId;
  }
  return config;
});

client.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('studentId');
      window.location.reload();
    }
    return Promise.reject(error);
  }
);

export default client;
