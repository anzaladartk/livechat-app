import { useEffect, useRef } from 'react';
import { getSocket } from '../services/socketService';
import { useChatStore } from '../store/chatStore';
import { useNotification } from './useNotification';

const TYPING_CLEAR_MS = 2000;

// Subscribes to every live event for the active room. Owns the receiving
// side's typing-indicator timer: each userTyping event resets that user's
// 2s countdown, and if no further event arrives before it fires, they're
// dropped from the typing list — matching "disappears after 2s of inactivity".
export const useChat = (roomId) => {
  const addMessage = useChatStore((state) => state.addMessage);
  const addTypingUser = useChatStore((state) => state.addTypingUser);
  const removeTypingUser = useChatStore((state) => state.removeTypingUser);
  const notify = useNotification();
  const timersRef = useRef({});

  useEffect(() => {
    const socket = getSocket();
    if (!socket || !roomId) return undefined;

    const handleMessageReceived = (message) => addMessage(message);

    const handleUserJoined = (data) => notify(`${data.userName} joined the room`);

    const handleUserLeft = (data) => notify(`${data.userName} left the room`);

    const handleUserTyping = (data) => {
      addTypingUser(data.userId, data.userName);
      clearTimeout(timersRef.current[data.userId]);
      timersRef.current[data.userId] = setTimeout(() => removeTypingUser(data.userId), TYPING_CLEAR_MS);
    };

    const handleUserStoppedTyping = (data) => {
      clearTimeout(timersRef.current[data.userId]);
      removeTypingUser(data.userId);
    };

    const handleError = (error) => notify(error.message, 'error');

    socket.on('messageReceived', handleMessageReceived);
    socket.on('userJoined', handleUserJoined);
    socket.on('userLeft', handleUserLeft);
    socket.on('userTyping', handleUserTyping);
    socket.on('userStoppedTyping', handleUserStoppedTyping);
    socket.on('error', handleError);

    const timers = timersRef.current;

    return () => {
      socket.off('messageReceived', handleMessageReceived);
      socket.off('userJoined', handleUserJoined);
      socket.off('userLeft', handleUserLeft);
      socket.off('userTyping', handleUserTyping);
      socket.off('userStoppedTyping', handleUserStoppedTyping);
      socket.off('error', handleError);
      Object.values(timers).forEach(clearTimeout);
    };
  }, [roomId, addMessage, addTypingUser, removeTypingUser, notify]);
};
