import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = () => {
  const token = localStorage.getItem('admin_token');

  // If no token or empty token, redirect to login
  if (!token || token.trim() === '') {
    return <Navigate to="/login" replace />;
  }

  // User is authenticated, render the admin content
  return <Outlet />;
};

export default ProtectedRoute;
