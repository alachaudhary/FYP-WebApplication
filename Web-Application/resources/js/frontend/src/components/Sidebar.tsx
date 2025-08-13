import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Shield, User, Settings, History, LogOut, KeyRound } from 'lucide-react';
import api from '../api';
import DarkModeToggle from './DarkModeToggle';
import useAuth from '../hooks/useAuth'; // ✅ import custom auth hook

interface SidebarProps {
  onClose?: () => void;
}

function Sidebar({ onClose }: SidebarProps) {
  const navigate = useNavigate();
  const { user, logout } = useAuth(); // ✅ get user and logout

  const handleLogout = async () => {
    await logout(); // ✅ unified logout logic
  };

  const menuItems = [
    { icon: <Shield className="h-5 w-5" />, label: 'Dashboard', path: '/dashboard' },
    { icon: <User className="h-5 w-5" />, label: 'Profile', path: '/profile' },
    { icon: <History className="h-5 w-5" />, label: 'History', path: '/history' },
    { icon: <Settings className="h-5 w-5" />, label: 'Settings', path: '/settings' },
  ];

  return (
    <div className="h-full flex flex-col bg-white dark:bg-gray-800">
      <div className="p-6 border-b dark:border-gray-700">
        <Link to="/dashboard" className="flex items-center space-x-2">
          <Shield className="h-8 w-8 text-indigo-600" />
          <span className="text-xl font-bold text-gray-900 dark:text-white">FauxShield</span>
        </Link>
      </div>

      <nav className="flex-1 px-4 space-y-2">
        <div className="py-4 flex justify-center border-b dark:border-gray-700 mb-4">
          <DarkModeToggle />
        </div>

        {menuItems.map((item, index) => (
          <Link
            key={index}
            to={item.path}
            className="flex items-center space-x-3 px-4 py-3 text-gray-600 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
            onClick={onClose}
          >
            {item.icon}
            <span>{item.label}</span>
          </Link>
        ))}

        {/* ✅ Only show for admin */}
        {user?.role === 'admin' && (
          <Link
            to="/admin"
            className="flex items-center space-x-3 px-4 py-3 text-indigo-600 dark:text-indigo-400 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
            onClick={onClose}
          >
            <KeyRound className="h-5 w-5" />
            <span>Admin Panel</span>
          </Link>
        )}
      </nav>

      <div className="p-4 mt-auto border-t dark:border-gray-700 space-y-3">
        <button
          className="flex items-center space-x-3 px-4 py-3 text-gray-600 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 w-full"
          onClick={handleLogout}
        >
          <LogOut className="h-5 w-5" />
          <span>Log Out</span>
        </button>
      </div>
    </div>
  );
}

export default Sidebar;
