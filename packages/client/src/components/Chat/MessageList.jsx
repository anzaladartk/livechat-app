import { useEffect, useRef } from 'react';
import MessageItem from './MessageItem';

export default function MessageList({ messages }) {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages.length]);

  if (messages.length === 0) {
    return <div className="flex flex-1 items-center justify-center text-sm text-gray-400">No messages yet. Say hello!</div>;
  }

  return (
    <div className="flex-1 overflow-y-auto p-4">
      {messages.map((message) => (
        <MessageItem key={message._id} message={message} />
      ))}
      <div ref={bottomRef} />
    </div>
  );
}
