import { create } from 'zustand';

export const useChatStore = create((set, get) => ({
  activeRoomId: null,
  messages: [],
  typingUsers: [], // [{ userId, userName }]

  setActiveRoomId: (roomId) => set({ activeRoomId: roomId, messages: [], typingUsers: [] }),

  setMessages: (messages) => set({ messages }),

  addMessage: (message) => set({ messages: [...get().messages, message] }),

  addTypingUser: (userId, userName) => {
    if (get().typingUsers.some((u) => u.userId === userId)) return;
    set({ typingUsers: [...get().typingUsers, { userId, userName }] });
  },

  removeTypingUser: (userId) => {
    set({ typingUsers: get().typingUsers.filter((u) => u.userId !== userId) });
  },
}));
