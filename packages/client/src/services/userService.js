import api from './api';

export const fetchProfile = () => api.get('/users/profile');

export const updateProfile = (updates) => api.patch('/users/profile', updates);
