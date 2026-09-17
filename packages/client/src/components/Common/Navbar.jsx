import { Link } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import UserAvatar from '../Users/UserAvatar';

export default function Navbar() {
  const { user, logout } = useAuthStore();

  return (
    <header className="flex items-center justify-between border-b border-gray-200 bg-white px-6 py-4">
      <h1 className="text-lg font-semibold text-gray-900">LiveChat</h1>
      <div className="flex items-center gap-4">
        <Link to="/profile" className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900">
          <UserAvatar user={user} size={24} />
          Welcome, {user?.name}
        </Link>
        <button
          onClick={logout}
          className="rounded-lg bg-gray-100 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-200"
        >
          Logout
        </button>
      </div>
    </header>
  );
}
