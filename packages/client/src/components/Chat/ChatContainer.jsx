import { useEffect, useState } from 'react';
import { useAuthStore } from '../../store/authStore';
import { useChatStore } from '../../store/chatStore';
import { useChat } from '../../hooks/useChat';
import { fetchMessages } from '../../services/messageService';
import { joinRoom, leaveRoom } from '../../services/socketService';
import LoadingSpinner from '../Common/LoadingSpinner';
import MessageInput from './MessageInput';
import MessageList from './MessageList';
import TypingIndicator from './TypingIndicator';

export default function ChatContainer({ roomId }) {
  const messages = useChatStore((state) => state.messages);
  const typingUsers = useChatStore((state) => state.typingUsers);
  const setMessages = useChatStore((state) => state.setMessages);
  const setActiveRoomId = useChatStore((state) => state.setActiveRoomId);
  const user = useAuthStore((state) => state.user);
  const [isLoading, setIsLoading] = useState(true);

  useChat(roomId);

  useEffect(() => {
    setActiveRoomId(roomId);
    setIsLoading(true);

    // Live subscribe only — no DB write. Membership itself was already
    // handled by the REST join call before this page was ever reached.
    joinRoom(roomId);

    fetchMessages(roomId)
      .then(({ data }) => setMessages(data.data))
      .finally(() => setIsLoading(false));

    return () => leaveRoom(roomId);
  }, [roomId, setActiveRoomId, setMessages]);

  return (
    <div className="flex h-full flex-1 flex-col">
      {isLoading ? (
        <div className="flex flex-1 items-center justify-center">
          <LoadingSpinner />
        </div>
      ) : (
        <MessageList messages={messages} />
      )}
      <TypingIndicator typingUsers={typingUsers} />
      <MessageInput roomId={roomId} userName={user?.name} />
    </div>
  );
}
