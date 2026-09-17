import { useEffect } from 'react';
import { connectSocket, disconnectSocket } from '../services/socketService';
import { useAuthStore } from '../store/authStore';

// Connects the shared socket whenever a token exists, disconnects otherwise
// (covers both logout and app unmount).
export const useSocket = () => {
  const token = useAuthStore((state) => state.token);

  useEffect(() => {
    if (token) {
      connectSocket(token);
    } else {
      disconnectSocket();
    }

    return () => disconnectSocket();
  }, [token]);
};
