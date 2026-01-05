
import React, { useState, useEffect } from 'react';
import { useAuth } from '../App';
import { api } from '../services/api';
import { AttendanceRecord, AttendanceStatus } from '../types';

const History: React.FC = () => {
  const { auth } = useAuth();
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [filter, setFilter] = useState('ALL');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      if (!auth.user) return;
      const data = await api.getAttendance(auth.user.id);
      setRecords(data.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
      setLoading(false);
    };
    load();
  }, [auth.user]);

  const filteredRecords = records.filter(r => {
    if (filter === 'ALL') return true;
    return r.status === filter;
  });

  const getStatusColor = (status: AttendanceStatus) => {
    switch (status) {
      case AttendanceStatus.PRESENT: return 'bg-green-100 text-green-600';
      case AttendanceStatus.LATE: return 'bg-orange-100 text-orange-600';
      case AttendanceStatus.ABSENT: return 'bg-red-100 text-red-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  if (loading) return <div className="p-10 text-center"><i className="fas fa-spinner fa-spin text-2xl text-blue-500"></i></div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">My Attendance Logs</h2>
          <p className="text-gray-500">View and track your work history</p>
        </div>
        
        <div className="flex items-center space-x-2 bg-white p-1 rounded-xl border border-gray-100 shadow-sm">
          {['ALL', 'PRESENT', 'LATE'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${filter === f ? 'bg-blue-600 text-white shadow-md' : 'text-gray-500 hover:bg-gray-50'}`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50 text-xs font-bold text-gray-400 uppercase tracking-wider">
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Check In</th>
                <th className="px-6 py-4">Check Out</th>
                <th className="px-6 py-4">Hours</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Location</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredRecords.length > 0 ? filteredRecords.map((record) => {
                const checkIn = new Date(record.checkIn);
                const checkOut = record.checkOut ? new Date(record.checkOut) : null;
                const hours = checkOut ? ((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60)).toFixed(1) : '-';

                return (
                  <tr key={record.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <p className="text-sm font-semibold text-gray-800">{new Date(record.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 font-medium">
                      {checkIn.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 font-medium">
                      {checkOut ? checkOut.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : <span className="text-blue-500 italic">Ongoing...</span>}
                    </td>
                    <td className="px-6 py-4 text-sm font-bold text-gray-700">
                      {hours} {hours !== '-' ? 'hrs' : ''}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${getStatusColor(record.status)}`}>
                        {record.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                       <button className="text-gray-400 hover:text-blue-500" title="View Map">
                         <i className="fas fa-map-marker-alt"></i>
                       </button>
                    </td>
                  </tr>
                );
              }) : (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center">
                      <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                        <i className="fas fa-folder-open text-gray-300 text-2xl"></i>
                      </div>
                      <p className="text-gray-400 font-medium">No records found for the selected filter.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default History;
