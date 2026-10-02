// components/ProtectedRoute.jsx
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from './context/authContext';

function ProtectedRoute() {
  const { user, isLoading } = useAuth();

  // Jika masih loading (sedang semak token), tunjuk loading
  if (isLoading) {
    return <div >Loading...</div>;
  }

  // If there is no user, redirect to login
  if (!user) {
    return <Navigate to="/" replace />;
  }

  // Jika ada user, tunjuk halaman yang diminta
  return <Outlet />;
}

export default ProtectedRoute;