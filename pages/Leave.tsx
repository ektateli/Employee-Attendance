
import React, { useState, useEffect } from 'react';
import { useAuth } from '../App';
import { api } from '../services/api';
import { LeaveRequest, UserRole } from '../types';

const LeavePage: React.FC = () => {
  const { auth } = useAuth();
  const [leaves, setLeaves] = useState<LeaveRequest[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    type: 'CASUAL' as const,
    startDate: '',
    endDate: '',
    reason: ''
  });

  const loadLeaves = async () => {
    if (!auth.user) return;
    const data = auth.user.role === UserRole.ADMIN 
      ? await api.getLeaves() 
      : await api.getLeaves(auth.user.id);
    setLeaves(data.sort((a, b) => new Date(b.applied_date).getTime() - new Date(a.applied_date).getTime()));
  };

  useEffect(() => {
    loadLeaves();
  }, [auth.user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth.user) return;
    await api.applyLeave({
      userId: auth.user.id,
      userName: auth.user.name,
      ...formData
    });
    setShowModal(false);
    loadLeaves();
    setFormData({ type: 'CASUAL', startDate: '', endDate: '', reason: '' });
  };

  const handleStatusUpdate = async (id: string, status: 'APPROVED' | 'REJECTED') => {
    await api.updateLeaveStatus(id, status);
    loadLeaves();
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'APPROVED': return 'bg-green-100 text-green-700';
      case 'REJECTED': return 'bg-red-100 text-red-700';
      default: return 'bg-yellow-100 text-yellow-700';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Leave Management</h2>
          <p className="text-sm text-gray-500">Request time off and track status</p>
        </div>
        {auth.user?.role !== UserRole.ADMIN && (
          <button 
            onClick={() => setShowModal(true)}
            className="bg-blue-600 text-white px-5 py-2.5 rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200"
          >
            Apply for Leave
          </button>
        )}
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 text-[10px] font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100">
            <tr>
              <th className="px-6 py-4">Employee</th>
              <th className="px-6 py-4">Type</th>
              <th className="px-6 py-4">Duration</th>
              <th className="px-6 py-4">Reason</th>
              <th className="px-6 py-4">Status</th>
              {auth.user?.role === UserRole.ADMIN && <th className="px-6 py-4 text-center">Actions</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {leaves.length > 0 ? leaves.map((leave) => (
              <tr key={leave.id} className="hover:bg-gray-50/50">
                <td className="px-6 py-4">
                  <span className="text-sm font-semibold text-gray-800">{leave.userName}</span>
                  <p className="text-[10px] text-gray-400">Applied: {new Date(leave.applied_date).toLocaleDateString()}</p>
                </td>
                <td className="px-6 py-4">
                  <span className="text-xs font-medium text-gray-600">{leave.type}</span>
                </td>
                <td className="px-6 py-4">
                  <p className="text-sm text-gray-800 font-medium">{leave.startDate}</p>
                  <p className="text-[10px] text-gray-400">to {leave.endDate}</p>
                </td>
                <td className="px-6 py-4">
                  <span className="text-xs text-gray-500 truncate max-w-[150px] inline-block">{leave.reason}</span>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${getStatusStyle(leave.status)}`}>
                    {leave.status}
                  </span>
                </td>
                {auth.user?.role === UserRole.ADMIN && (
                  <td className="px-6 py-4">
                    {leave.status === 'PENDING' ? (
                      <div className="flex justify-center space-x-2">
                        <button 
                          onClick={() => handleStatusUpdate(leave.id, 'APPROVED')}
                          className="w-8 h-8 rounded-lg bg-green-50 text-green-600 hover:bg-green-100 transition-colors"
                          title="Approve"
                        >
                          <i className="fas fa-check"></i>
                        </button>
                        <button 
                          onClick={() => handleStatusUpdate(leave.id, 'REJECTED')}
                          className="w-8 h-8 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
                          title="Reject"
                        >
                          <i className="fas fa-times"></i>
                        </button>
                      </div>
                    ) : (
                      <p className="text-center text-[10px] text-gray-400 italic">Processed</p>
                    )}
                  </td>
                )}
              </tr>
            )) : (
              <tr>
                <td colSpan={6} className="px-6 py-20 text-center text-gray-400 font-medium">No leave requests found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowModal(false)}></div>
          <div className="relative bg-white w-full max-w-md rounded-3xl p-8 shadow-2xl">
            <h3 className="text-xl font-bold text-gray-800 mb-6">New Leave Request</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Leave Type</label>
                <select 
                  className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500"
                  value={formData.type}
                  onChange={e => setFormData({...formData, type: e.target.value as any})}
                >
                  <option value="CASUAL">Casual Leave</option>
                  <option value="SICK">Sick Leave</option>
                  <option value="VACATION">Vacation</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Start Date</label>
                  <input 
                    type="date" required
                    className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500"
                    value={formData.startDate}
                    onChange={e => setFormData({...formData, startDate: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase mb-2">End Date</label>
                  <input 
                    type="date" required
                    className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500"
                    value={formData.endDate}
                    onChange={e => setFormData({...formData, endDate: e.target.value})}
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Reason</label>
                <textarea 
                  required
                  rows={3}
                  className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500"
                  placeholder="Explain briefly..."
                  value={formData.reason}
                  onChange={e => setFormData({...formData, reason: e.target.value})}
                ></textarea>
              </div>
              <div className="flex space-x-3 pt-4">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-3 text-gray-500 font-bold hover:bg-gray-50 rounded-xl">Cancel</button>
                <button type="submit" className="flex-1 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 shadow-lg shadow-blue-100">Submit Request</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default LeavePage;
