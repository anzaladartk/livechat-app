import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { fetchProfile, updateProfile } from '../../services/userService';
import ErrorAlert from '../Common/ErrorAlert';
import LoadingSpinner from '../Common/LoadingSpinner';
import UserAvatar from './UserAvatar';

export default function UserProfile() {
  const navigate = useNavigate();
  const logout = useAuthStore((state) => state.logout);
  const updateUser = useAuthStore((state) => state.updateUser);

  const [profile, setProfile] = useState(null);
  const [name, setName] = useState('');
  const [avatar, setAvatar] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchProfile()
      .then(({ data }) => {
        setProfile(data.data);
        setName(data.data.name);
        setAvatar(data.data.avatar);
      })
      .catch(() => setError('Failed to load profile'))
      .finally(() => setIsLoading(false));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsSaving(true);
    try {
      const { data } = await updateProfile({ name, avatar });
      setProfile((prev) => ({ ...prev, ...data.data }));
      updateUser(data.data);
      setSuccess('Profile updated');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (isLoading) return <LoadingSpinner fullScreen />;
  if (!profile) return <ErrorAlert message={error || 'Failed to load profile'} />;

  return (
    <div className="h-full overflow-y-auto">
      <div className="mx-auto max-w-lg p-6">
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex items-center gap-4">
          <UserAvatar user={{ name: profile.name, avatar }} size={72} />
          <div>
            <h2 className="text-xl font-semibold text-gray-900">{profile.name}</h2>
            <p className="text-sm text-gray-500">{profile.email}</p>
          </div>
        </div>

        <dl className="mt-6 grid grid-cols-3 gap-4 text-center">
          <div>
            <dt className="text-xs text-gray-500">Joined</dt>
            <dd className="text-sm font-medium text-gray-900">
              {new Date(profile.createdAt).toLocaleDateString()}
            </dd>
          </div>
          <div>
            <dt className="text-xs text-gray-500">Rooms</dt>
            <dd className="text-sm font-medium text-gray-900">{profile.roomCount}</dd>
          </div>
          <div>
            <dt className="text-xs text-gray-500">Messages</dt>
            <dd className="text-sm font-medium text-gray-900">{profile.messageCount}</dd>
          </div>
        </dl>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <ErrorAlert message={error} />
          {success && <p className="text-sm text-green-600">{success}</p>}

          <div>
            <label htmlFor="name" className="mb-1 block text-sm font-medium text-gray-700">
              Name
            </label>
            <input
              id="name"
              type="text"
              required
              maxLength={50}
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label htmlFor="avatar" className="mb-1 block text-sm font-medium text-gray-700">
              Avatar URL
            </label>
            <input
              id="avatar"
              type="text"
              maxLength={500}
              value={avatar}
              onChange={(e) => setAvatar(e.target.value)}
              placeholder="https://example.com/avatar.png"
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            disabled={isSaving}
            className="w-full rounded-lg bg-blue-500 py-2 font-semibold text-white transition hover:bg-blue-600 disabled:opacity-50"
          >
            {isSaving ? 'Saving...' : 'Save changes'}
          </button>
        </form>

        <div className="mt-6 flex items-center justify-between border-t border-gray-200 pt-4">
          <button onClick={() => navigate('/rooms')} className="text-sm text-blue-500 hover:underline">
            &larr; Back to rooms
          </button>
          <button
            onClick={handleLogout}
            className="rounded-lg bg-gray-100 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-200"
          >
            Logout
          </button>
        </div>
      </div>
      </div>
    </div>
  );
}
