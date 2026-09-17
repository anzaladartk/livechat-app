import { useCallback, useEffect, useState } from 'react';
import { fetchRoomById } from '../../services/roomService';
import { getSocket } from '../../services/socketService';
import UserAvatar from './UserAvatar';

export default function MembersList({ roomId }) {
  const [members, setMembers] = useState([]);

  const refreshMembers = useCallback(async () => {
    try {
      const { data } = await fetchRoomById(roomId);
      setMembers(data.data.members);
    } catch {
      // Non-critical side panel — a failed refresh just leaves the last known list.
    }
  }, [roomId]);

  useEffect(() => {
    const socket = getSocket();
    if (!socket) return undefined;

    const handleMembersList = (list) => setMembers(list);

    // roomMembersList only arrives once, for this socket's own joinRoom call.
    // userJoined/userLeft (broadcast to everyone) trigger a fresh REST fetch
    // so the panel updates live when someone else joins or leaves.
    socket.on('roomMembersList', handleMembersList);
    socket.on('userJoined', refreshMembers);
    socket.on('userLeft', refreshMembers);

    return () => {
      socket.off('roomMembersList', handleMembersList);
      socket.off('userJoined', refreshMembers);
      socket.off('userLeft', refreshMembers);
    };
  }, [roomId, refreshMembers]);

  return (
    <aside className="hidden w-56 shrink-0 overflow-y-auto border-l border-gray-200 bg-white p-4 sm:block">
      <h3 className="mb-3 text-sm font-semibold text-gray-500">Members ({members.length})</h3>
      <ul className="space-y-2">
        {members.map((member) => (
          <li key={member._id} className="flex items-center gap-2">
            <UserAvatar user={member} size={28} />
            <span className="truncate text-sm text-gray-700">{member.name}</span>
          </li>
        ))}
      </ul>
    </aside>
  );
}
