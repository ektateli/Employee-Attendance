
import React, { useState, useEffect, createContext, useContext } from 'react';
import { HashRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { User, UserRole, AuthState } from './types';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import AttendancePage from './pages/Attendance';
import History from './pages/History';
import AdminUsers from './pages/AdminUsers';
import AdminReports from './pages/AdminReports';
import LeavePage from './pages/Leave';
import Layout from './components/Layout';
import { api } from './services/api';

interface AuthContextType {
  auth: AuthState;
  login: (email: string, pass: string) => Promise<void>;
  register: (data: any) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};

const Toast: React.FC<{ message: string; onHide: () => void }> = ({ message, onHide }) => {
  useEffect(() => {
    const t = setTimeout(onHide, 4000);
    return () => clearTimeout(t);
  }, [onHide]);

  return (
    <div className="fixed bottom-6 right-6 z-[9999] bg-white/80 backdrop-blur-md border border-white/50 shadow-2xl rounded-2xl p-4 flex items-center space-x-3 animate-slide-up">
      <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center">
        <i className="fas fa-sync-alt fa-spin"></i>
      </div>
      <p className="text-sm font-semibold text-gray-700">{message}</p>
    </div>
  );
};

const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [auth, setAuth] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    loading: true
  });
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('st_user');
    const token = localStorage.getItem('st_token');
    if (savedUser && token) {
      setAuth({ user: JSON.parse(savedUser), isAuthenticated: true, loading: false });
    } else {
      setAuth({ user: null, isAuthenticated: false, loading: false });
    }

    const handleSync = (e: MessageEvent) => {
      if (e.data.type === 'ATTENDANCE_UPDATE') {
        setToast('Real-time: Attendance Database Synced');
      }
    };
    api.syncChannel.addEventListener('message', handleSync);
    return () => api.syncChannel.removeEventListener('message', handleSync);
  }, []);

  const login = async (email: string, pass: string) => {
    try {
      const data = await api.login(email, pass);
      localStorage.setItem('st_token', data.token);
      localStorage.setItem('st_user', JSON.stringify(data.user));
      setAuth({ user: data.user, isAuthenticated: true, loading: false });
    } catch (err: any) {
      alert(err.message);
      throw err;
    }
  };

  const register = async (formData: any) => {
    try {
      const data = await api.register(formData);
      localStorage.setItem('st_token', data.token);
      localStorage.setItem('st_user', JSON.stringify(data.user));
      setAuth({ user: data.user, isAuthenticated: true, loading: false });
    } catch (err: any) {
      alert(err.message);
      throw err;
    }
  };

  const logout = () => {
    localStorage.removeItem('st_token');
    localStorage.removeItem('st_user');
    setAuth({ user: null, isAuthenticated: false, loading: false });
  };

  return (
    <AuthContext.Provider value={{ auth, login, register, logout }}>
      {children}
      {toast && <Toast message={toast} onHide={() => setToast(null)} />}
    </AuthContext.Provider>
  );
};

const ProtectedRoute: React.FC<{ children: React.ReactNode; adminOnly?: boolean }> = ({ children, adminOnly }) => {
  const { auth } = useAuth();
  const location = useLocation();

  if (auth.loading) return <div className="flex items-center justify-center h-screen bg-gray-50"><i className="fas fa-circle-notch fa-spin text-4xl text-blue-600"></i></div>;
  if (!auth.isAuthenticated) return <Navigate to="/login" state={{ from: location }} replace />;
  if (adminOnly && auth.user?.role !== UserRole.ADMIN) return <Navigate to="/" replace />;

  return <>{children}</>;
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <HashRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<ProtectedRoute><Layout><Dashboard /></Layout></ProtectedRoute>} />
          <Route path="/attendance" element={<ProtectedRoute><Layout><AttendancePage /></Layout></ProtectedRoute>} />
          <Route path="/history" element={<ProtectedRoute><Layout><History /></Layout></ProtectedRoute>} />
          <Route path="/leaves" element={<ProtectedRoute><Layout><LeavePage /></Layout></ProtectedRoute>} />
          <Route path="/admin/users" element={<ProtectedRoute adminOnly><Layout><AdminUsers /></Layout></ProtectedRoute>} />
          <Route path="/admin/reports" element={<ProtectedRoute adminOnly><Layout><AdminReports /></Layout></ProtectedRoute>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </HashRouter>
    </AuthProvider>
  );
};

export default App;
