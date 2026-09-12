import api from './api';

export const fetchRooms = (params) => api.get('/rooms', { params });

export const createRoom = (name, description) => api.post('/rooms', { name, description });

export const joinRoom = (roomId) => api.post(`/rooms/${roomId}/join`);

export const leaveRoom = (roomId) => api.post(`/rooms/${roomId}/leave`);

export const fetchRoomById = (roomId) => api.get(`/rooms/${roomId}`);
