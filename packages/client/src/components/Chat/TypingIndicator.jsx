export default function TypingIndicator({ typingUsers }) {
  if (typingUsers.length === 0) return null;

  const names = typingUsers.map((u) => u.userName).join(', ');
  const verb = typingUsers.length === 1 ? 'is' : 'are';

  return <div className="px-4 pb-1 text-xs italic text-gray-400">{names} {verb} typing...</div>;
}
