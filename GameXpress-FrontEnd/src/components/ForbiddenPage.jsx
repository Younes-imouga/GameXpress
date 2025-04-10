import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../utils/authUtils';

const ForbiddenPage = () => {
  const { user } = useAuth();

  let homePath = '/';
  const role = user?.roles?.[0]?.name;

  if (role) {
    if (role === 'client') {
      homePath = '/client/dashboard';
    } else if (role === 'super_admin') {
      homePath = '/admin/dashboard';
    } else if (role === 'product_manager') {
      homePath = '/games';
    } else if (role === 'user_manager') {
      homePath = '/user/dashboard';
    }
    console.log(`ForbiddenPage: Determined home path for role "${role}" as "${homePath}"`);
  } else {
    console.warn(`ForbiddenPage: Could not determine user role. Defaulting home path to "${homePath}". User:`, user);
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white">
      <h1 className="text-6xl font-bold text-red-500 mb-4">403</h1>
      <h2 className="text-2xl font-semibold mb-6">Access Denied / Forbidden</h2>
      <p className="text-lg mb-8 text-gray-400">
        Sorry, you do not have permission to access this page.
      </p>
      <Link
        to={homePath}
        replace
        className="px-6 py-2 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg transition"
      >
        Go Back Home
      </Link>
    </div>
  );
};

export default ForbiddenPage; 