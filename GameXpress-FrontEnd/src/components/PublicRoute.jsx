import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../utils/authUtils';


const PublicRoute = () => {
  const { token, user } = useAuth();

  if (token && user) {
    const userRole = user.roles?.[0]?.name;
    let redirectPath = '/client/dashboard';

    if (userRole === 'super_admin') {
      redirectPath = '/admin/dashboard';
    } else if (userRole === 'product_manager') {
      redirectPath = '/games';
    }


    console.log(`PublicRoute: User logged in, redirecting to ${redirectPath}`);
    return <Navigate to={redirectPath} replace />;
  }

  return <Outlet />;
};

export default PublicRoute; 