import client from './client';

export const classApi = {
  getAll: () => client.get('/classes'),
  getById: (classId) => client.get(`/classes/${classId}`),
  create: (data) => client.post('/classes', data),
};

export const holdApi = {
  create: (classId) => client.post(`/classes/${classId}/holds`, {}),
  getById: (holdId) => client.get(`/holds/${holdId}`),
  getStudentHolds: () => client.get('/me/holds'),
  confirm: (holdId) => client.post(`/holds/${holdId}/confirm`, {}),
  cancel: (holdId) => client.delete(`/holds/${holdId}`),
};
