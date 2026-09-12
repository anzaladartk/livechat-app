import { useEffect, useState } from 'react';
import { useRoomStore } from '../../store/roomStore';
import ErrorAlert from '../Common/ErrorAlert';
import LoadingSpinner from '../Common/LoadingSpinner';
import CreateRoomModal from './CreateRoomModal';
import RoomCard from './RoomCard';

export default function RoomsList() {
  const { rooms, isLoading, error, fetchRooms, createRoom, joinRoom, leaveRoom } = useRoomStore();
  const [searchInput, setSearchInput] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [actionError, setActionError] = useState('');

  useEffect(() => {
    fetchRooms();
  }, [fetchRooms]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchRooms(searchInput);
  };

  const handleJoin = async (room) => {
    setActionError('');
    try {
      await joinRoom(room._id);
    } catch (err) {
      setActionError(err.response?.data?.message || 'Failed to join room');
    }
  };

  const handleLeave = async (room) => {
    setActionError('');
    try {
      await leaveRoom(room._id);
    } catch (err) {
      setActionError(err.response?.data?.message || 'Failed to leave room');
    }
  };

  return (
    <div className="mx-auto max-w-2xl p-6">
      <div className="mb-4 flex items-center justify-between gap-4">
        <form onSubmit={handleSearch} className="flex-1">
          <input
            type="text"
            placeholder="Search rooms..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </form>
        <button
          onClick={() => setShowCreateModal(true)}
          className="whitespace-nowrap rounded-lg bg-blue-500 px-4 py-2 text-sm font-medium text-white hover:bg-blue-600"
        >
          + New room
        </button>
      </div>

      <ErrorAlert message={error || actionError} />

      {isLoading ? (
        <div className="flex justify-center py-12">
          <LoadingSpinner />
        </div>
      ) : rooms.length === 0 ? (
        <p className="py-12 text-center text-gray-500">No rooms yet. Create the first one!</p>
      ) : (
        <div className="space-y-3">
          {rooms.map((room) => (
            <RoomCard key={room._id} room={room} onJoin={handleJoin} onLeave={handleLeave} />
          ))}
        </div>
      )}

      {showCreateModal && <CreateRoomModal onClose={() => setShowCreateModal(false)} onCreate={createRoom} />}
    </div>
  );
}
