import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../utils/authUtils';

const NotFoundPage = () => {
  const { user, token } = useAuth();


  let homePath = '/login';
  const role = user?.roles?.[0]?.name;

  if (token) {
    homePath = '/';
    if (role) {
      if (role === 'client') homePath = '/client/dashboard';
      else if (role === 'super_admin') homePath = '/admin/dashboard';
      else if (role === 'product_manager') homePath = '/games';
      else if (role === 'user_manager') homePath = '/user/dashboard';

      console.log(`NotFoundPage: Determined home path for role "${role}" as "${homePath}"`);
    } else {
      console.warn(`NotFoundPage: Could not determine user role (logged in). Defaulting home path to "${homePath}".`);
    }
  } else {
    console.log(`NotFoundPage: User not logged in. Setting home path to "${homePath}".`);
  }


  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white">
      <h1 className="text-6xl font-bold text-yellow-500 mb-4">404</h1>
      <h2 className="text-2xl font-semibold mb-6">Page Not Found</h2>
      <p className="text-lg mb-8 text-gray-400 text-center px-4">
        Oops! The page you are looking for does not exist. <br />
        It might have been moved or deleted.
      </p>
      <Link
        to={homePath}
        replace
        className="px-6 py-2 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg transition"
      >
        {token ? 'Go Back Home' : 'Go To Login'}
      </Link>
    </div>
  );
};

export default NotFoundPage; 