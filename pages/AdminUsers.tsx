
import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { User, UserRole } from '../types';

const AdminUsers: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    department: 'Engineering',
    role: UserRole.EMPLOYEE
  });

  const loadUsers = async () => {
    const data = await api.getUsers();
    setUsers(data);
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleRole = async (user: User) => {
    const updatedUser = { 
      ...user, 
      role: user.role === UserRole.ADMIN ? UserRole.EMPLOYEE : UserRole.ADMIN 
    };
    // Fix: api.updateUser expects userId as first argument and updates as second argument
    await api.updateUser(user.id, updatedUser);
    loadUsers();
  };

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    await api.addUser({
      ...newUser,
      joinedDate: new Date().toISOString().split('T')[0]
    });
    loadUsers();
    setShowAddModal(false);
    setNewUser({ name: '', email: '', department: 'Engineering', role: UserRole.EMPLOYEE });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Team Directory</h2>
          <p className="text-sm text-gray-500">Manage {users.length} registered employees</p>
        </div>
        <div className="flex items-center space-x-3">
          <div className="relative">
            <i className="fas fa-search absolute left-3 top-2.5 text-gray-300 text-sm"></i>
            <input 
              type="text" 
              placeholder="Search directory..."
              className="pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-xl focus:ring-blue-500 focus:border-blue-500 w-full md:w-64 bg-white"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button 
            onClick={() => setShowAddModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-blue-700 shadow-lg shadow-blue-100 whitespace-nowrap"
          >
            Add Member
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto max-h-[70vh]">
          <table className="w-full text-left">
            <thead className="sticky top-0 bg-gray-50 text-[10px] font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100">
              <tr>
                <th className="px-6 py-4">Employee Details</th>
                <th className="px-6 py-4">Role</th>
                <th className="px-6 py-4">Department</th>
                <th className="px-6 py-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredUsers.map(user => (
                <tr key={user.id} className="hover:bg-gray-50/50">
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <img src={user.avatar} className="w-9 h-9 rounded-full border border-gray-100 shadow-sm" alt="" />
                      <div>
                        <p className="text-sm font-bold text-gray-800">{user.name}</p>
                        <p className="text-[11px] text-gray-500">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase ${user.role === UserRole.ADMIN ? 'bg-purple-50 text-purple-600' : 'bg-blue-50 text-blue-600'}`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-xs font-semibold text-gray-500">
                    {user.department}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex justify-center space-x-2">
                       <button 
                        onClick={() => toggleRole(user)}
                        className="text-[10px] font-bold text-blue-600 hover:bg-blue-50 px-2 py-1 rounded transition-colors"
                       >
                         Change Role
                       </button>
                       <button className="p-1.5 text-gray-400 hover:text-red-500">
                         <i className="fas fa-trash-alt text-sm"></i>
                       </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowAddModal(false)}></div>
          <div className="relative bg-white w-full max-w-md rounded-3xl p-8 shadow-2xl">
            <h3 className="text-xl font-bold text-gray-800 mb-2">Register New Member</h3>
            <p className="text-gray-400 text-xs mb-6">Create a new corporate account linked to the database.</p>
            
            <form onSubmit={handleAddUser} className="space-y-4">
              <div className="p-3 bg-blue-50 border border-blue-100 rounded-xl flex items-center space-x-3 mb-4">
                <i className="fas fa-info-circle text-blue-500"></i>
                <p className="text-[10px] font-bold text-blue-700 uppercase">Note: Default password for new members is <span className="underline">admin123</span></p>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Full Name</label>
                <input 
                  required type="text"
                  className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500"
                  value={newUser.name}
                  onChange={e => setNewUser({...newUser, name: e.target.value})}
                  placeholder="e.g. Sarah Jenkins"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Email Address</label>
                <input 
                  required type="email"
                  className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500"
                  value={newUser.email}
                  onChange={e => setNewUser({...newUser, email: e.target.value})}
                  placeholder="employee@smarttrack.com"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Department</label>
                  <select 
                    className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500"
                    value={newUser.department}
                    onChange={e => setNewUser({...newUser, department: e.target.value})}
                  >
                    <option>Engineering</option>
                    <option>Sales</option>
                    <option>Marketing</option>
                    <option>HR</option>
                    <option>Finance</option>
                    <option>Operations</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Role</label>
                  <select 
                    className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500"
                    value={newUser.role}
                    onChange={e => setNewUser({...newUser, role: e.target.value as any})}
                  >
                    <option value={UserRole.EMPLOYEE}>Employee</option>
                    <option value={UserRole.ADMIN}>Admin</option>
                  </select>
                </div>
              </div>
              <div className="flex space-x-3 pt-4">
                <button type="button" onClick={() => setShowAddModal(false)} className="flex-1 py-3 text-gray-500 font-bold hover:bg-gray-50 rounded-xl">Cancel</button>
                <button type="submit" className="flex-1 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 shadow-lg shadow-blue-100">Create Account</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUsers;
