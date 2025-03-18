import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { PawPrint, LogOut } from 'lucide-react';

export default function Navigation() {
  const location = useLocation();
  const navigate = useNavigate();
  const isHome = location.pathname === '/';
  const userType = localStorage.getItem('userType');
  const isAdmin = userType === 'admin';
  const isCenter = userType === 'center';
  const isCustomer = userType === 'customer';

  const handleLogout = () => {
    localStorage.removeItem('userType');
    navigate('/login');
  };

  const renderNavLinks = () => {
    const links = [
      { to: '/', text: 'Home' },
      { to: '/lost-found', text: 'Lost & Found' },
      { to: '/pawmart', text: 'PawMart' },
      { to: '/community', text: 'Community' }
    ];

    // Only show these links for non-admin users
    if (!isAdmin) {
      links.splice(1, 0, { to: '/adopt', text: 'Adopt' });
    }

    return links.map((link) => (
      <Link
        key={link.to}
        to={link.to}
        className={`px-4 py-2 rounded-lg font-semibold transition-all duration-200
          ${isHome 
            ? 'bg-white/10 text-white hover:bg-white/20 backdrop-blur-sm' 
            : 'text-gray-700 hover:bg-gray-100'
          }`}
      >
        {link.text}
      </Link>
    ));
  };

  return (
    <nav className={`w-full py-6 px-8 ${isHome ? '' : 'bg-white shadow-md'}`}>
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link to="/" className="flex items-center space-x-2">
          <PawPrint className={`h-8 w-8 ${isHome ? 'text-white' : 'text-indigo-600'}`} />
          <span className={`text-2xl font-bold ${isHome ? 'text-white' : 'text-gray-900'}`}>
            PawsConnect
          </span>
        </Link>

        <div className="flex items-center space-x-4">
          {renderNavLinks()}
          {!isAdmin && (
            <Link
              to="/contact"
              className={`px-4 py-2 rounded-lg font-semibold transition-all duration-200
                ${isHome 
                  ? 'bg-white/10 text-white hover:bg-white/20 backdrop-blur-sm' 
                  : 'text-gray-700 hover:bg-gray-100'
                }`}
            >
              Contact
            </Link>
          )}
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all duration-200 bg-red-500 text-white hover:bg-red-600"
          >
            <LogOut size={20} />
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}