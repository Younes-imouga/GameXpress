
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../utils/authUtils';


const ProtectedRoute = ({ allowedRoles }) => {
  const { token, user } = useAuth();

  if (!token) {

    return <Navigate to="/login" replace />;
  }


  if (!user || !user.roles || user.roles.length === 0) {
    console.warn("ProtectedRoute: User data or roles missing.");
    return <Navigate to="/login" replace />;
  }

  const userRole = user.roles[0]?.name;
  if (!userRole) {
    console.warn("ProtectedRoute: Cannot determine user role.");
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && allowedRoles.length > 0) {

    const isAllowed = allowedRoles.includes(userRole);
    if (!isAllowed) {
      console.warn(`ProtectedRoute: Access denied for role "${userRole}". Required: ${allowedRoles.join(', ')}. Redirecting to /forbidden.`);

      return <Navigate to="/forbidden" replace/>;
    }
  }

  return <Outlet />;
};

export default ProtectedRoute;