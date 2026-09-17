import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ChatContainer from '../components/Chat/ChatContainer';
import Layout from '../components/Common/Layout';
import LoadingSpinner from '../components/Common/LoadingSpinner';
import MembersList from '../components/Users/MembersList';
import { fetchRoomById, leaveRoom as leaveRoomApi } from '../services/roomService';
import { leaveRoom as leaveRoomSocket } from '../services/socketService';

export default function ChatPage() {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const [room, setRoom] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    fetchRoomById(roomId)
      .then(({ data }) => setRoom(data.data))
      .catch(() => setRoom(null))
      .finally(() => setIsLoading(false));
  }, [roomId]);

  const handleLeave = async () => {
    // REST first (persists the membership change + posts the "left" system
    // message), then unsubscribe the live socket — so this client stops
    // receiving further events for a room it's no longer part of.
    await leaveRoomApi(roomId);
    leaveRoomSocket(roomId);
    navigate('/rooms');
  };

  return (
    <Layout>
      <div className="flex h-full flex-col">
        <div className="flex items-center justify-between border-b border-gray-200 bg-white px-4 py-3">
          <div>
            <button onClick={() => navigate('/rooms')} className="text-sm text-blue-500 hover:underline">
              &larr; Rooms
            </button>
            <h2 className="text-base font-semibold text-gray-900">{room?.name}</h2>
            {room && (
              <p className="text-xs text-gray-500">
                {room.memberCount} member{room.memberCount === 1 ? '' : 's'}
              </p>
            )}
          </div>
          <button
            onClick={handleLeave}
            className="whitespace-nowrap rounded-lg bg-gray-100 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-200"
          >
            Leave room
          </button>
        </div>

        {isLoading ? (
          <div className="flex flex-1 items-center justify-center">
            <LoadingSpinner />
          </div>
        ) : (
          <div className="flex flex-1 overflow-hidden">
            <ChatContainer roomId={roomId} />
            <MembersList roomId={roomId} />
          </div>
        )}
      </div>
    </Layout>
  );
}
