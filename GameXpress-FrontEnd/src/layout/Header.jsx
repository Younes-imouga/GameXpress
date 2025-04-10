import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../utils/authUtils';

function Header() {
  const { isLoggedIn, user, logout } = useAuth();
  const role = user?.roles?.[0]?.name;

  const navLinkClass = ({ isActive }) =>
    isActive
      ? "text-green-400 font-semibold border-b-2 border-green-400 px-3 py-2"
      : "text-white hover:text-green-300 px-3 py-2";

  return (
    <header className="bg-gray-800 shadow-md">
      <nav className="container mx-auto px-6 py-3 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-green-400 hover:text-green-500">
          GameXpress
        </Link>

        <div className="flex items-center space-x-4">
          {isLoggedIn ? (
            <>
              {role === 'client' && (
                <NavLink to="/client/dashboard" className={navLinkClass}>Dashboard</NavLink>
              )}
              {role === 'super_admin' && (
                <>
                  <NavLink to="/admin/dashboard" className={navLinkClass}>Admin Dash</NavLink>
                  <NavLink to="/games" className={navLinkClass}>Games</NavLink>
                </>
              )}
              {role === 'product_manager' && (
                <NavLink to="/games" className={navLinkClass}>Games</NavLink>
              )}
              {role === 'user_manager' && (
                <NavLink to="/user/dashboard" className={navLinkClass}>Users</NavLink>
              )}

              {(role === 'client' || role === 'product_manager' || role === 'super_admin') && (
                <NavLink to="/store" className={navLinkClass}>Store</NavLink>
              )}
                <NavLink to="/contact" className={navLinkClass}>Contact</NavLink>

              <button
                onClick={logout}
                className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg transition text-sm"
              >
                Logout ({user?.name || 'User'})
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login" className={navLinkClass}>Login</NavLink>
              <NavLink to="/register" className={navLinkClass}>Register</NavLink>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}

export default Header;