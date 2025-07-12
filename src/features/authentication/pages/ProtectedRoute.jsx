
// import { Navigate, Outlet } from "react-router-dom";

// const ProtectedRoute = ({ user }) => {
//   if (!user || !user.token || !user.role) {
//     return <Navigate to="/login" />;
//   }
//   return <Outlet />;
// };

// export default ProtectedRoute;
import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = ({ user }) => {
  if (!user || !user.token) {
    return <Navigate to="/login" replace />;
  }
  return <Outlet />;
};

export default ProtectedRoute;
