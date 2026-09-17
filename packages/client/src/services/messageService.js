import api from './api';

export const fetchMessages = (roomId, params) => api.get(`/messages/${roomId}`, { params });
