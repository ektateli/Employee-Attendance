
import React, { useState } from 'react';
import Sidebar from './Sidebar';
import { useAuth } from '../App';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const { auth, logout } = useAuth();

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar - Desktop */}
      <div className="hidden md:block w-64 h-full">
        <Sidebar />
      </div>

      {/* Sidebar - Mobile */}
      <div className={`fixed inset-0 z-40 md:hidden transition-transform transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="relative w-64 h-full bg-white shadow-xl">
           <Sidebar onClose={() => setSidebarOpen(false)} />
        </div>
        <div className="absolute inset-0 bg-black opacity-50" onClick={() => setSidebarOpen(false)}></div>
      </div>

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="flex items-center justify-between px-6 py-4 bg-white border-b border-gray-200">
          <div className="flex items-center">
            <button onClick={() => setSidebarOpen(true)} className="text-gray-500 md:hidden focus:outline-none">
              <i className="fas fa-bars text-xl"></i>
            </button>
            <div className="ml-4 md:ml-0 flex items-center space-x-3">
              <h1 className="text-xl font-bold text-gray-800">SmartTrack Pro</h1>
              <div className="flex items-center space-x-1 px-2 py-0.5 bg-blue-50 rounded-full border border-blue-100">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                <span className="text-[10px] font-bold text-blue-600 uppercase tracking-tighter">
                  Live DB
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-semibold text-gray-800">{auth.user?.name}</p>
              <p className="text-xs text-gray-500 capitalize">{auth.user?.role.toLowerCase()}</p>
            </div>
            <img src={auth.user?.avatar} alt="Profile" className="w-10 h-10 rounded-full border-2 border-blue-100" />
            <button 
              onClick={logout}
              className="p-2 text-gray-400 hover:text-red-600 transition-colors"
              title="Logout"
            >
              <i className="fas fa-sign-out-alt text-lg"></i>
            </button>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
