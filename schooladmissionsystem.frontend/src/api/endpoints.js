import client from './client';

export const classApi = {
  getAll: () => client.get('/classes'),
  getById: (classId) => client.get(`/classes/${classId}`),
  create: (data) => client.post('/classes', data),
  update: (classId, data) => client.put(`/classes/${classId}`, data),
  delete: (classId) => client.delete(`/classes/${classId}`),
};

export const holdApi = {
  create: (classId) => client.post(`/classes/${classId}/holds`, {}),
  getById: (holdId) => client.get(`/holds/${holdId}`),
  getStudentHolds: () => client.get('/holds/me'),
  confirm: (holdId) => client.post(`/holds/${holdId}/confirm`, {}),
  cancel: (holdId) => client.delete(`/holds/${holdId}`),
};
