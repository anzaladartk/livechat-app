import { create } from 'zustand';

let nextId = 1;
const AUTO_DISMISS_MS = 4000;

export const useNotificationStore = create((set, get) => ({
  notifications: [], // [{ id, message, type }]

  addNotification: (message, type = 'info') => {
    const id = nextId++;
    set({ notifications: [...get().notifications, { id, message, type }] });
    setTimeout(() => get().removeNotification(id), AUTO_DISMISS_MS);
  },

  removeNotification: (id) => {
    set({ notifications: get().notifications.filter((n) => n.id !== id) });
  },
}));
