import { useEffect, useRef, useState } from 'react';
import { emitStopTyping, emitTyping, sendMessage } from '../../services/socketService';

const TYPING_DEBOUNCE_MS = 2000;
const MAX_MESSAGE_LENGTH = 1000;

export default function MessageInput({ roomId, userName }) {
  const [text, setText] = useState('');
  const typingTimeoutRef = useRef(null);

  useEffect(() => () => clearTimeout(typingTimeoutRef.current), []);

  const handleChange = (e) => {
    setText(e.target.value);

    emitTyping(roomId, userName);
    clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => emitStopTyping(roomId), TYPING_DEBOUNCE_MS);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = text.trim();
    if (!trimmed) return;

    sendMessage(roomId, trimmed);
    setText('');
    clearTimeout(typingTimeoutRef.current);
    emitStopTyping(roomId);
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2 border-t border-gray-200 bg-white p-4">
      <input
        type="text"
        value={text}
        onChange={handleChange}
        maxLength={MAX_MESSAGE_LENGTH}
        placeholder="Type a message..."
        className="flex-1 rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <button
        type="submit"
        disabled={!text.trim()}
        className="rounded-lg bg-blue-500 px-4 py-2 text-sm font-medium text-white hover:bg-blue-600 disabled:opacity-50"
      >
        Send
      </button>
    </form>
  );
}
