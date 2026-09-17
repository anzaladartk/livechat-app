import { useEffect } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import ProtectedRoute from './components/Auth/ProtectedRoute';
import { useSocket } from './hooks/useSocket';
import ChatPage from './pages/ChatPage';
import LoginPage from './pages/LoginPage';
import NotFound from './pages/NotFound';
import ProfilePage from './pages/ProfilePage';
import RegisterPage from './pages/RegisterPage';
import RoomsPage from './pages/RoomsPage';
import { useAuthStore } from './store/authStore';

function App() {
  const verify = useAuthStore((state) => state.verify);

  // Runs once on app load: checks whether a stored token is still valid
  // before ProtectedRoute makes any redirect decisions.
  useEffect(() => {
    verify();
  }, [verify]);

  // Connects the live socket whenever a token exists, disconnects on logout.
  useSocket();

  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      <Route element={<ProtectedRoute />}>
        <Route path="/rooms" element={<RoomsPage />} />
        <Route path="/rooms/:roomId" element={<ChatPage />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Route>

      <Route path="/" element={<Navigate to="/rooms" replace />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
