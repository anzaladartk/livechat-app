export default function UserAvatar({ user, size = 32 }) {
  return (
    <img
      src={user?.avatar || 'https://i.pravatar.cc/150'}
      alt={user?.name || 'User'}
      style={{ width: size, height: size }}
      className="shrink-0 rounded-full object-cover"
    />
  );
}
