import { useAuthStore } from '../../store/authStore';
import UserAvatar from '../Users/UserAvatar';

function formatTime(date) {
  return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

export default function MessageItem({ message }) {
  const currentUserId = useAuthStore((state) => state.user?._id);

  if (message.isSystemMessage) {
    return <div className="my-2 text-center text-xs text-gray-400">{message.text}</div>;
  }

  const isOwn = message.user?._id === currentUserId;

  return (
    <div className={`my-2 flex items-end gap-2 ${isOwn ? 'flex-row-reverse' : ''}`}>
      {!isOwn && <UserAvatar user={message.user} size={32} />}
      <div className={`max-w-xs rounded-lg px-3 py-2 shadow-sm ${isOwn ? 'bg-blue-500 text-white' : 'bg-white text-gray-900'}`}>
        {!isOwn && <p className="text-xs font-semibold text-gray-500">{message.user?.name}</p>}
        <p className="whitespace-pre-wrap break-words text-sm">{message.text}</p>
        <p className={`mt-1 text-[10px] ${isOwn ? 'text-blue-100' : 'text-gray-400'}`}>{formatTime(message.createdAt)}</p>
      </div>
    </div>
  );
}
