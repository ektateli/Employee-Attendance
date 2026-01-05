
// import React, { useState, useEffect } from 'react';
// import { api } from '../services/api';
// import { AttendanceStatus, User, AttendanceRecord } from '../types';

// const AdminReports: React.FC = () => {
//   const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [users, setUsers] = useState<User[]>([]);
//   const [allAttendance, setAllAttendance] = useState<AttendanceRecord[]>([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const loadData = async () => {
//       setLoading(true);
//       const [u, a] = await Promise.all([
//         api.getUsers(),
//         api.getAttendance()
//       ]);
//       setUsers(u);
//       setAllAttendance(a);
//       setLoading(false);
//     };
//     loadData();
//   }, []);
  
//   const dayRecords = allAttendance.filter(r => r.date === selectedDate);

//   const filteredData = users.filter(user => 
//     user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
//     user.department.toLowerCase().includes(searchTerm.toLowerCase())
//   ).map(user => {
//     const record = dayRecords.find(r => r.userId === user.id);
//     return { ...user, record };
//   });

//   const getStatusBadge = (record: any) => {
//     if (!record) return <span className="text-gray-400 italic text-xs">Not Checked In</span>;
    
//     const colors = {
//       [AttendanceStatus.PRESENT]: 'bg-green-100 text-green-700',
//       [AttendanceStatus.LATE]: 'bg-orange-100 text-orange-700',
//       [AttendanceStatus.ABSENT]: 'bg-red-100 text-red-700',
//       [AttendanceStatus.ON_LEAVE]: 'bg-purple-100 text-purple-700',
//     };

//     return (
//       <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${colors[record.status as AttendanceStatus]}`}>
//         {record.status}
//       </span>
//     );
//   };

//   if (loading) return <div className="p-10 text-center"><i className="fas fa-spinner fa-spin text-2xl text-blue-500"></i></div>;

//   return (
//     <div className="space-y-6">
//       <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
//         <div>
//           <h2 className="text-2xl font-bold text-gray-800">Master Attendance Logs</h2>
//           <p className="text-sm text-gray-500">Real-time status of all {users.length} employees</p>
//         </div>
        
//         <div className="flex flex-wrap gap-3">
//           <input 
//             type="date"
//             value={selectedDate}
//             onChange={(e) => setSelectedDate(e.target.value)}
//             className="px-4 py-2 border border-gray-200 rounded-xl text-sm focus:ring-blue-500 focus:border-blue-500 bg-white"
//           />
//           <div className="relative">
//              <i className="fas fa-search absolute left-3 top-3 text-gray-300 text-sm"></i>
//              <input 
//               type="text"
//               placeholder="Filter by name/dept..."
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//               className="pl-9 pr-4 py-2 border border-gray-200 rounded-xl text-sm focus:ring-blue-500 focus:border-blue-500 bg-white"
//             />
//           </div>
//         </div>
//       </div>

//       <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
//         <div className="overflow-x-auto max-h-[70vh]">
//           <table className="w-full text-left">
//             <thead className="sticky top-0 bg-gray-50 z-10 text-[10px] font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100">
//               <tr>
//                 <th className="px-6 py-4">Employee</th>
//                 <th className="px-6 py-4">Department</th>
//                 <th className="px-6 py-4">In Time</th>
//                 <th className="px-6 py-4">Out Time</th>
//                 <th className="px-6 py-4">Status</th>
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-gray-50">
//               {filteredData.map((item) => (
//                 <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
//                   <td className="px-6 py-4">
//                     <div className="flex items-center space-x-3">
//                        <img src={item.avatar} className="w-8 h-8 rounded-full" alt="" />
//                        <div>
//                           <p className="text-sm font-semibold text-gray-800">{item.name}</p>
//                           <p className="text-[10px] text-gray-400">{item.email}</p>
//                        </div>
//                     </div>
//                   </td>
//                   <td className="px-6 py-4 text-xs font-medium text-gray-500">
//                     {item.department}
//                   </td>
//                   <td className="px-6 py-4 text-sm font-medium text-gray-700">
//                     {item.record?.checkIn ? new Date(item.record.checkIn).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '-'}
//                   </td>
//                   <td className="px-6 py-4 text-sm font-medium text-gray-700">
//                     {item.record?.checkOut ? new Date(item.record.checkOut).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '-'}
//                   </td>
//                   <td className="px-6 py-4">
//                     {getStatusBadge(item.record)}
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//         <div className="p-4 bg-gray-50 border-t border-gray-100 text-center">
//            <p className="text-xs text-gray-400">Showing {filteredData.length} of {users.length} total employees</p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AdminReports;













import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { AttendanceStatus, User, AttendanceRecord } from '../types';

const AdminReports: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [searchTerm, setSearchTerm] = useState('');
  const [users, setUsers] = useState<User[]>([]);
  const [allAttendance, setAllAttendance] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    try {
      const [u, a] = await Promise.all([
        api.getUsers(),
        api.getAttendance()
      ]);
      setUsers(u);
      setAllAttendance(a);
    } catch (err) {
      console.error("Error loading master logs:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    const handleSync = () => loadData();
    api.syncChannel.addEventListener('message', handleSync);
    return () => api.syncChannel.removeEventListener('message', handleSync);
  }, []);
  
  // Safe normalization: keeps the YYYY-MM-DD string exactly as received from DB
  const normalizeDate = (dateVal: any) => {
    if (!dateVal) return '';
    // If it's already a string like "2026-01-04", just return the first part
    if (typeof dateVal === 'string') return dateVal.split('T')[0];
    
    try {
      const d = new Date(dateVal);
      if (isNaN(d.getTime())) return String(dateVal).split('T')[0];
      // Manual formatting to avoid UTC shifting
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    } catch {
      return String(dateVal).split('T')[0];
    }
  };

  const dayRecords = allAttendance.filter(r => normalizeDate(r.date) === selectedDate);

  const filteredData = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    user.department.toLowerCase().includes(searchTerm.toLowerCase())
  ).map(user => {
    const record = dayRecords.find(r => String(r.userId) === String(user.id));
    return { ...user, record };
  });

  const getStatusBadge = (record: any) => {
    if (!record) return <span className="text-gray-300 italic text-[10px] font-medium uppercase tracking-tight">Not Checked In</span>;
    
    const colors = {
      [AttendanceStatus.PRESENT]: 'bg-green-100 text-green-700',
      [AttendanceStatus.LATE]: 'bg-orange-100 text-orange-700',
      [AttendanceStatus.ABSENT]: 'bg-red-100 text-red-700',
      [AttendanceStatus.ON_LEAVE]: 'bg-purple-100 text-purple-700',
    };

    const status = record.status as AttendanceStatus;
    const colorClass = colors[status] || 'bg-gray-100 text-gray-700';

    return (
      <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-tight ${colorClass}`}>
        {status}
      </span>
    );
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center h-full space-y-4">
      <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Loading Master Logs...</p>
    </div>
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-gray-900 tracking-tight">Master Attendance Logs</h2>
          <p className="text-sm font-medium text-gray-500">Real-time status of all {users.length} registered employees</p>
        </div>
        
        <div className="flex flex-wrap gap-3">
          <div className="relative group">
            <input 
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="px-4 py-2 border border-gray-200 rounded-xl text-sm font-bold focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white shadow-sm transition-all"
            />
          </div>
          <div className="relative">
             <i className="fas fa-search absolute left-3 top-3 text-gray-300 text-sm"></i>
             <input 
              type="text"
              placeholder="Filter by name/dept..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-4 py-2 border border-gray-200 rounded-xl text-sm font-semibold focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white shadow-sm w-full md:w-64 transition-all"
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-gray-100 shadow-xl shadow-gray-200/50 overflow-hidden">
        <div className="overflow-x-auto max-h-[70vh]">
          <table className="w-full text-left">
            <thead className="sticky top-0 bg-gray-50/80 backdrop-blur-md z-10 text-[10px] font-black text-gray-400 uppercase tracking-[0.15em] border-b border-gray-100">
              <tr>
                <th className="px-8 py-5">Employee</th>
                <th className="px-6 py-5">Department</th>
                <th className="px-6 py-5">In Time</th>
                <th className="px-6 py-5">Out Time</th>
                <th className="px-8 py-5 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredData.length > 0 ? filteredData.map((item) => (
                <tr key={item.id} className="hover:bg-blue-50/30 transition-colors group">
                  <td className="px-8 py-4">
                    <div className="flex items-center space-x-4">
                       <img src={item.avatar} className="w-10 h-10 rounded-2xl border border-gray-100 shadow-sm group-hover:scale-110 transition-transform" alt="" />
                       <div>
                          <p className="text-sm font-bold text-gray-900">{item.name}</p>
                          <p className="text-[10px] font-medium text-gray-400">{item.email}</p>
                       </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-xs font-bold text-gray-500 bg-gray-50 px-2 py-1 rounded-lg">
                      {item.department}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-black text-gray-700">
                      {item.record?.checkIn ? new Date(item.record.checkIn).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '--:--'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-black text-gray-700">
                      {item.record?.checkOut ? new Date(item.record.checkOut).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '--:--'}
                    </span>
                  </td>
                  <td className="px-8 py-4 text-right">
                    {getStatusBadge(item.record)}
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={5} className="px-8 py-20 text-center">
                    <div className="flex flex-col items-center opacity-40">
                      <i className="fas fa-search text-4xl mb-4"></i>
                      <p className="text-sm font-bold uppercase tracking-widest">No matching employees found</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="p-6 bg-gray-50/50 border-t border-gray-100 text-center">
           <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
             Live Synced: Showing {filteredData.length} of {users.length} total staff records for {new Date(selectedDate + 'T12:00:00').toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
           </p>
        </div>
      </div>
    </div>
  );
};

export default AdminReports;
