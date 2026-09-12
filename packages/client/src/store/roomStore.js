import { create } from 'zustand';
import {
  fetchRooms as fetchRoomsApi,
  createRoom as createRoomApi,
  joinRoom as joinRoomApi,
  leaveRoom as leaveRoomApi,
} from '../services/roomService';

export const useRoomStore = create((set, get) => ({
  rooms: [],
  search: '',
  isLoading: false,
  error: '',

  fetchRooms: async (search = '') => {
    set({ isLoading: true, error: '' });
    try {
      const { data } = await fetchRoomsApi({ search, page: 1, limit: 20 });
      set({ rooms: data.data, search, isLoading: false });
    } catch (err) {
      set({ error: err.response?.data?.message || 'Failed to load rooms', isLoading: false });
    }
  },

  createRoom: async (name, description) => {
    const { data } = await createRoomApi(name, description);
    // Backend leaves a new room with no members — join immediately so the
    // creator becomes a member through the same path every other member uses.
    await joinRoomApi(data.data._id);
    await get().fetchRooms(get().search);
    return data.data;
  },

  joinRoom: async (roomId) => {
    const { data } = await joinRoomApi(roomId);
    set({
      rooms: get().rooms.map((room) =>
        room._id === roomId ? { ...room, memberCount: data.data.memberCount, isMember: true } : room
      ),
    });
  },

  leaveRoom: async (roomId) => {
    const { data } = await leaveRoomApi(roomId);
    set({
      rooms: get().rooms.map((room) =>
        room._id === roomId ? { ...room, memberCount: data.data.memberCount, isMember: false } : room
      ),
    });
  },
}));
