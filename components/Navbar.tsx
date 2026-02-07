
import React from 'react';
import { User, UserRole } from '../types';

interface NavbarProps {
  user: User | null;
  onLogout: () => void;
  onNavigate: (page: string) => void;
}

const Navbar: React.FC<NavbarProps> = ({ user, onLogout, onNavigate }) => {
  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center cursor-pointer" onClick={() => onNavigate('landing')}>
            <div className="bg-indigo-600 text-white p-2 rounded-lg mr-2">
              <i className="fas fa-brain"></i>
            </div>
            <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
              AssessPro
            </span>
          </div>

          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <button onClick={() => onNavigate('dashboard')} className="text-gray-600 hover:text-indigo-600 font-medium">Dashboard</button>
                <button onClick={() => onNavigate('leaderboard')} className="text-gray-600 hover:text-indigo-600 font-medium">Leaderboard</button>
                <button onClick={() => onNavigate('profile')} className="text-gray-600 hover:text-indigo-600 font-medium">Profile</button>
                <div className="flex items-center space-x-2 pl-4 border-l border-gray-200">
                  <span className="text-sm font-semibold text-gray-700">{user.fullName}</span>
                  <button 
                    onClick={onLogout}
                    className="bg-red-50 text-red-600 px-3 py-1 rounded-full text-xs font-bold hover:bg-red-100 transition-colors"
                  >
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <>
                <button onClick={() => onNavigate('leaderboard')} className="text-gray-600 hover:text-indigo-600 font-medium mr-4">Leaderboard</button>
                <button onClick={() => onNavigate('login')} className="text-gray-600 hover:text-indigo-600 font-medium">Login</button>
                <button 
                  onClick={() => onNavigate('register')}
                  className="bg-indigo-600 text-white px-5 py-2 rounded-full font-bold hover:bg-indigo-700 transition-all shadow-md shadow-indigo-200"
                >
                  Join Now
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
