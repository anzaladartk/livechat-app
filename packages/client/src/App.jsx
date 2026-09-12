import { useEffect } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import ProtectedRoute from './components/Auth/ProtectedRoute';
import LoginPage from './pages/LoginPage';
import NotFound from './pages/NotFound';
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

  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      <Route element={<ProtectedRoute />}>
        <Route path="/rooms" element={<RoomsPage />} />
      </Route>

      <Route path="/" element={<Navigate to="/rooms" replace />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
