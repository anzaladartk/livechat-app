import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import LoadingSpinner from '../Common/LoadingSpinner';

// Wraps a set of routes (via <Outlet />) so they're only reachable when
// logged in. Waits on isLoading rather than deciding from token presence
// alone, since a stale/expired token in localStorage must not falsely pass.
export default function ProtectedRoute() {
  const { user, isLoading } = useAuthStore();

  if (isLoading) {
    return <LoadingSpinner fullScreen />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
