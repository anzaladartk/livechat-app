import { io } from 'socket.io-client';

let socket = null;

export const connectSocket = (token) => {
  if (socket?.connected) return socket;
  socket = io(import.meta.env.VITE_SOCKET_URL, { auth: { token } });
  return socket;
};

export const disconnectSocket = () => {
  socket?.disconnect();
  socket = null;
};

export const getSocket = () => socket;

export const joinRoom = (roomId) => socket?.emit('joinRoom', { roomId });
export const leaveRoom = (roomId) => socket?.emit('leaveRoom', { roomId });
export const sendMessage = (roomId, text) => socket?.emit('sendMessage', { roomId, text });
export const emitTyping = (roomId, userName) => socket?.emit('typing', { roomId, userName });
export const emitStopTyping = (roomId) => socket?.emit('stopTyping', { roomId });
