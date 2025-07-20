import { Navigate, Outlet } from "react-router-dom";

// Component to protect routes from unauthorized access
const ProtectedRoute = ({ user }) => {
  // If user is not logged in or lacks required data, redirect to login
  if (!user || !user.token || !user.role) {
    return <Navigate to="/login" replace />;
  }

  // If user is authenticated, render the nested route
  return <Outlet />;
};

export default ProtectedRoute;
