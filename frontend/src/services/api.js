import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

// create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// add token to requests if it exists
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// auth endpoints
export const authService = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
};

// course endpoints
export const courseService = {
  getAll: () => api.get('/courses'),
  getOne: (id) => api.get(`/courses/${id}`),
  create: (data) => api.post('/courses', data),
  update: (id, data) => api.put(`/courses/${id}`, data),
  delete: (id) => api.delete(`/courses/${id}`),
};

// resource endpoints
export const resourceService = {
  getAllByCourse: (courseId) => api.get(`/resources/courses/${courseId}/resources`),
  getOne: (id) => api.get(`/resources/${id}`),
  create: (courseId, data) => api.post(`/resources/courses/${courseId}/resources`, data),
  update: (id, data) => api.put(`/resources/${id}`, data),
  delete: (id) => api.delete(`/resources/${id}`),
  shareOnFacebook: (id) => api.post(`/resources/${id}/share/facebook`),
};

export default api;