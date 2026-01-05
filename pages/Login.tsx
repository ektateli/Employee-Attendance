
import React, { useState } from 'react';
import { useAuth } from '../App';
import { Navigate, useLocation } from 'react-router-dom';

const Login: React.FC = () => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState('admin@smarttrack.com');
  const [password, setPassword] = useState('admin123');
  const [name, setName] = useState('');
  const [department, setDepartment] = useState('Engineering');
  const [loading, setLoading] = useState(false);
  
  const { auth, login, register } = useAuth();
  const location = useLocation();

  if (auth.isAuthenticated) {
    const origin = (location.state as any)?.from?.pathname || '/';
    return <Navigate to={origin} replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isRegistering) {
        await register({ name, email, password, department });
      } else {
        await login(email, password);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fillCredentials = (e: string, p: string) => {
    setIsRegistering(false);
    setEmail(e);
    setPassword(p);
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gray-50 font-inter">
      {/* Branding Section */}
      <div className="hidden md:flex md:w-5/12 bg-blue-600 p-12 flex-col justify-between text-white relative overflow-hidden">
        <div className="z-10">
          <div className="flex items-center space-x-2 mb-8">
            <i className="fas fa-check-double text-3xl"></i>
            <span className="text-2xl font-bold tracking-tight">SmartTrack Pro</span>
          </div>
          <h1 className="text-5xl font-extrabold leading-tight mb-6">Connect Your <br /> Workforce Now.</h1>
          <p className="text-blue-100 text-lg max-w-sm opacity-80 font-medium">Empower your team with a transparent, database-driven attendance ecosystem.</p>
        </div>
        <div className="z-10 bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/10">
           <p className="text-sm italic opacity-90">"The easiest way to track time and optimize performance for our modern distributed team."</p>
           <div className="mt-4 flex items-center space-x-3">
              <div className="w-8 h-8 rounded-full bg-blue-400"></div>
              <div>
                <p className="text-xs font-bold">Marcus Chen</p>
                <p className="text-[10px] opacity-60">Director of Ops</p>
              </div>
           </div>
        </div>
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 -translate-y-1/2 translate-x-1/2 animate-pulse"></div>
      </div>

      {/* Auth Form Section */}
      <div className="flex-1 flex items-center justify-center p-8 bg-[#F8FAFC]">
        <div className="w-full max-w-md">
          <div className="text-center mb-10 animate-fade-in">
            <h2 className="text-4xl font-black text-gray-900 mb-2">{isRegistering ? 'Join the Team' : 'Welcome Back'}</h2>
            <p className="text-gray-500 font-medium">{isRegistering ? 'Create your employee account' : 'Access your smarttrack_db session'}</p>
          </div>

          <div className="bg-white p-8 rounded-[2.5rem] shadow-xl shadow-blue-900/5 border border-gray-100 transition-all">
            <form onSubmit={handleSubmit} className="space-y-4">
              {isRegistering && (
                <div className="animate-slide-up">
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1">Full Name</label>
                  <input 
                    type="text" required
                    className="block w-full px-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500 transition-all"
                    placeholder="John Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
              )}
              
              <div className="animate-slide-up" style={{ animationDelay: '0.1s' }}>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1">Corporate Email</label>
                <input 
                  type="email" required
                  className="block w-full px-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500 transition-all"
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              {isRegistering && (
                <div className="animate-slide-up" style={{ animationDelay: '0.2s' }}>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1">Department</label>
                  <select 
                    className="block w-full px-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500 transition-all"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                  >
                    <option>Engineering</option>
                    <option>Sales</option>
                    <option>Marketing</option>
                    <option>Product</option>
                    <option>HR</option>
                  </select>
                </div>
              )}

              <div className="animate-slide-up" style={{ animationDelay: '0.3s' }}>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1">Password</label>
                <input 
                  type="password" required
                  className="block w-full px-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500 transition-all"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <button 
                type="submit" disabled={loading}
                className="w-full py-4 bg-blue-600 text-white font-black rounded-2xl shadow-lg shadow-blue-200 hover:bg-blue-700 hover:-translate-y-0.5 transition-all active:scale-95 disabled:opacity-50 mt-4"
              >
                {loading ? <i className="fas fa-circle-notch fa-spin"></i> : isRegistering ? 'Create My Account' : 'Authenticate Session'}
              </button>
            </form>

            <div className="mt-8 text-center">
              <button 
                onClick={() => setIsRegistering(!isRegistering)}
                className="text-xs font-bold text-blue-600 hover:underline transition-all"
              >
                {isRegistering ? 'Already have an account? Sign in' : "New employee? Create an account"}
              </button>
            </div>
          </div>

          {/* Helper Section */}
          <div className="mt-12 pt-8 border-t border-gray-100 animate-fade-in" style={{ animationDelay: '0.4s' }}>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] text-center mb-6">Environment Access</p>
            <div className="grid grid-cols-2 gap-4">
              <button 
                onClick={() => fillCredentials('admin@smarttrack.com', 'admin123')}
                className="p-4 bg-white border border-gray-100 rounded-2xl text-left hover:border-blue-500 hover:shadow-lg transition-all group"
              >
                <p className="text-[10px] font-black text-blue-600 uppercase mb-1">Root Admin</p>
                <p className="text-[11px] font-bold text-gray-500 truncate">admin@smarttrack.com</p>
              </button>
              <button 
                onClick={() => fillCredentials('employee@smarttrack.com', 'admin123')}
                className="p-4 bg-white border border-gray-100 rounded-2xl text-left hover:border-blue-500 hover:shadow-lg transition-all group"
              >
                <p className="text-[10px] font-black text-green-600 uppercase mb-1">Standard Emp</p>
                <p className="text-[11px] font-bold text-gray-500 truncate">employee@smarttrack.com</p>
              </button>
            </div>
            
            <div className="mt-8 flex items-center justify-center space-x-6 grayscale opacity-40">
                <i className="fab fa-aws text-2xl"></i>
                <i className="fab fa-google text-xl"></i>
                <i className="fab fa-microsoft text-xl"></i>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
