import { useAuthStore } from '../../store/authStore';

export default function Navbar() {
  const { user, logout } = useAuthStore();

  return (
    <header className="flex items-center justify-between border-b border-gray-200 bg-white px-6 py-4">
      <h1 className="text-lg font-semibold text-gray-900">LiveChat</h1>
      <div className="flex items-center gap-4">
        <span className="text-sm text-gray-600">Welcome, {user?.name}</span>
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
