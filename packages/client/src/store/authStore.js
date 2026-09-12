import { create } from 'zustand';
import { registerUser, loginUser, verifyUser } from '../services/authService';

export const useAuthStore = create((set) => ({
  user: null,
  token: localStorage.getItem('token'),
  // Starts true and only flips to false once we've checked whether the
  // stored token (if any) is still valid — ProtectedRoute waits on this
  // instead of deciding from token presence alone.
  isLoading: true,

  register: async (name, email, password) => {
    const { data } = await registerUser(name, email, password);
    localStorage.setItem('token', data.token);
    set({ user: data.user, token: data.token });
    return data;
  },

  login: async (email, password) => {
    const { data } = await loginUser(email, password);
    localStorage.setItem('token', data.token);
    set({ user: data.user, token: data.token });
    return data;
  },

  logout: () => {
    localStorage.removeItem('token');
    set({ user: null, token: null });
  },

  verify: async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      set({ isLoading: false });
      return;
    }

    try {
      const { data } = await verifyUser();
      set({ user: data.user, isLoading: false });
    } catch {
      localStorage.removeItem('token');
      set({ user: null, token: null, isLoading: false });
    }
  },
}));
