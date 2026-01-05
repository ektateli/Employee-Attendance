
import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../App';
import { UserRole } from '../types';

const Sidebar: React.FC<{ onClose?: () => void }> = ({ onClose }) => {
  const { auth } = useAuth();

  const links = [
    { to: '/', label: 'Dashboard', icon: 'fas fa-chart-line' },
    { to: '/attendance', label: 'My Session', icon: 'fas fa-clock' },
    { to: '/history', label: 'My Logs', icon: 'fas fa-history' },
    { to: '/leaves', label: 'Leave Center', icon: 'fas fa-calendar-alt' },
  ];

  if (auth.user?.role === UserRole.ADMIN) {
    links.push(
      { to: '/admin/reports', label: 'Master Logs', icon: 'fas fa-clipboard-list' },
      { to: '/admin/users', label: 'Manage Team', icon: 'fas fa-users-cog' }
    );
  }

  return (
    <div className="flex flex-col h-full bg-white border-r border-gray-200">
      <div className="flex items-center px-6 h-16 border-b border-gray-200">
        <div className="flex items-center space-x-2">
          <div className="bg-blue-600 p-1.5 rounded-lg">
            <i className="fas fa-check-double text-white text-sm"></i>
          </div>
          <span className="text-lg font-bold text-gray-800">SmartTrack</span>
        </div>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            onClick={onClose}
            className={({ isActive }) => `
              flex items-center px-4 py-3 rounded-xl transition-all text-sm
              ${isActive 
                ? 'bg-blue-600 text-white font-semibold shadow-md shadow-blue-200' 
                : 'text-gray-500 hover:bg-gray-50 hover:text-gray-800'
              }
            `}
          >
            <i className={`${link.icon} w-6 text-center text-base mr-3`}></i>
            <span>{link.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-gray-100">
        <div className="bg-gray-50 rounded-2xl p-4">
          <div className="flex items-center space-x-3">
             <img src={auth.user?.avatar} className="w-8 h-8 rounded-full border border-white shadow-sm" alt="User" />
             <div className="overflow-hidden">
                <p className="text-xs font-bold text-gray-800 truncate">{auth.user?.name}</p>
                <p className="text-[10px] text-gray-500 capitalize">{auth.user?.role.toLowerCase()}</p>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
