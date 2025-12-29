import api from './axios';

// Authentication, using Auth API
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  logout: () => api.post('/auth/logout'),
  getMe: () => api.get('/auth/me')
};

// Leads
export const leadsAPI = {
  getAll: (params) => api.get('/leads', { params }),
  getOne: (id) => api.get(`/leads/${id}`),
  create: (data) => api.post('/leads', data),
  update: (id, data) => api.put(`/leads/${id}`, data),
  delete: (id) => api.delete(`/leads/${id}`),
  autoAssign: (data) => api.post('/leads/assign', data),
  addNote: (id, note) => api.post(`/leads/${id}/notes`, note),
  addMessage: (id, message) => api.post(`/leads/${id}/messages`, message)
};

// Users
export const usersAPI = {
  getAll: (params) => api.get('/users', { params }),
  getOne: (id) => api.get(`/users/${id}`),
  create: (data) => api.post('/users', data),           // FIXED
  update: (id, data) => api.put(`/users/${id}`, data),  // FIXED
  delete: (id) => api.delete(`/users/${id}`),           // FIXED
  getLeaderboard: () => api.get('/users/leaderboard')
};
export const tasksAPI = {
  getAll: () => api.get('/tasks'),
  getById: (id) => api.get(`/tasks/${id}`),
  create: (data) => api.post('/tasks', data),
  update: (id, data) => api.put(`/tasks/${id}`, data),
  delete: (id) => api.delete(`/tasks/${id}`)
};

// Also make sure activitiesAPI exists:

export const activitiesAPI = {
  getAll: () => api.get('/activities'),
  getById: (id) => api.get(`/activities/${id}`)

};
// Analytics
export const analyticsAPI = {
  getDashboard: () => api.get('/analytics/dashboard'),
  getPerformance: (userId) => api.get('/analytics/performance', { params: { userId } }),
  getMRR: () => api.get('/analytics/mrr')
};