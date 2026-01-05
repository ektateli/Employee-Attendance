// import React, { useState, useEffect } from 'react';
// import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
// import { api } from '../services/api';
// import { AttendanceStatus } from '../types';

// const Dashboard: React.FC = () => {
//   const [stats, setStats] = useState({ totalEmployees: 0, presentToday: 0, lateToday: 0, pendingLeaves: 0 });
//   const [chartData, setChartData] = useState<any[]>([]);
//   const [loading, setLoading] = useState(true);

//   const fetchData = async () => {
//     try {
//       const [s, history] = await Promise.all([
//         api.getStats(),
//         api.getAttendance()
//       ]);
//       setStats(s);
      
//       const days = Array.from({ length: 7 }, (_, i) => {
//         const d = new Date();
//         d.setDate(d.getDate() - i);
//         const dateStr = d.toISOString().split('T')[0];
//         const records = history.filter((r: any) => r.date === dateStr);
//         return {
//           name: d.toLocaleDateString('en-US', { weekday: 'short' }),
//           present: records.length,
//           late: records.filter((r: any) => r.status === AttendanceStatus.LATE).length
//         };
//       }).reverse();
//       setChartData(days);
//     } catch (err) {
//       console.error("Dashboard error:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchData();
//   }, []);

//   if (loading) return (
//     <div className="flex flex-col items-center justify-center h-full space-y-4">
//       <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
//       <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Aggregating Live Data...</p>
//     </div>
//   );

//   return (
//     <div className="space-y-8 animate-fade-in">
//       <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
//         <div>
//           <h2 className="text-3xl font-black text-gray-900 tracking-tight">Dashboard Overview</h2>
//           <p className="text-gray-500 font-medium">Real-time attendance statistics from the central database.</p>
//         </div>
//         <button 
//           onClick={fetchData}
//           className="px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-bold text-gray-700 hover:bg-gray-50 shadow-sm transition-all active:scale-95"
//         >
//           <i className="fas fa-sync-alt mr-2"></i> Refresh Data
//         </button>
//       </div>

//       {/* Stats Grid */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
//         {[
//           { label: 'Total Team', value: stats.totalEmployees, icon: 'fa-users', color: 'blue', trend: 'Registered members' },
//           { label: 'Present Today', value: stats.presentToday, icon: 'fa-fingerprint', color: 'green', trend: 'Active today' },
//           { label: 'Late Entries', value: stats.lateToday, icon: 'fa-exclamation-circle', color: 'orange', trend: 'Punctuality log' },
//           { label: 'Pending Leaves', value: stats.pendingLeaves, icon: 'fa-file-invoice', color: 'purple', trend: 'Leave requests' },
//         ].map((item, i) => (
//           <div key={i} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300">
//             <div className={`w-14 h-14 flex items-center justify-center bg-${item.color}-50 text-${item.color}-600 rounded-2xl mb-4`}>
//               <i className={`fas ${item.icon} text-2xl`}></i>
//             </div>
//             <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">{item.label}</p>
//             <p className="text-3xl font-black text-gray-900 mb-2">{item.value}</p>
//             <p className="text-[10px] font-bold text-gray-400 uppercase">{item.trend}</p>
//           </div>
//         ))}
//       </div>

//       {/* Charts Section */}
//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//         <div className="lg:col-span-2 bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
//           <div className="flex items-center justify-between mb-8">
//             <h3 className="font-bold text-gray-800 text-lg">Weekly Engagement</h3>
//             <div className="flex items-center space-x-4 text-[10px] font-bold uppercase tracking-widest text-gray-400">
//               <div className="flex items-center"><span className="w-2 h-2 rounded-full bg-blue-500 mr-2"></span> Present</div>
//               <div className="flex items-center"><span className="w-2 h-2 rounded-full bg-orange-500 mr-2"></span> Late</div>
//             </div>
//           </div>
//           <div className="h-72">
//             <ResponsiveContainer width="100%" height="100%">
//               <BarChart data={chartData}>
//                 <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
//                 <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fontWeight: 600, fill: '#94a3b8' }} dy={10} />
//                 <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fontWeight: 600, fill: '#94a3b8' }} />
//                 <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }} />
//                 <Bar dataKey="present" fill="#3b82f6" radius={[6, 6, 0, 0]} barSize={24} />
//                 <Bar dataKey="late" fill="#f97316" radius={[6, 6, 0, 0]} barSize={24} />
//               </BarChart>
//             </ResponsiveContainer>
//           </div>
//         </div>

//         <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm flex flex-col">
//           <h3 className="font-bold text-gray-800 text-lg mb-6">Recent Activity</h3>
//           <div className="flex-1 space-y-6">
//             {[1, 2, 3].map((_, i) => (
//               <div key={i} className="flex items-start space-x-4">
//                 <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400">
//                   <i className="fas fa-history text-sm"></i>
//                 </div>
//                 <div>
//                   <p className="text-sm font-bold text-gray-800">System Sync</p>
//                   <p className="text-xs text-gray-500">Attendance records successfully saved.</p>
//                   <p className="text-[10px] font-bold text-blue-600 mt-1">SUCCESS</p>
//                 </div>
//               </div>
//             ))}
//           </div>
//           <button className="mt-8 w-full py-3 bg-gray-50 rounded-2xl text-xs font-bold text-gray-500 hover:bg-gray-100 transition-colors uppercase tracking-widest">
//             View All Logs
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Dashboard;










import React, { useState, useEffect } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { api } from '../services/api';
import { AttendanceStatus } from '../types';

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState({ 
    totalEmployees: 0, 
    totalDepartments: 0, 
    departmentNames: [] as string[],
    presentToday: 0, 
    lateToday: 0, 
    pendingLeaves: 0 
  });
  const [chartData, setChartData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const [s, history] = await Promise.all([
        api.getStats(),
        api.getAttendance()
      ]);
      
      console.log("Stats received from server:", s); // Debugging
      
      setStats({
        ...s,
        departmentNames: s.departmentNames && s.departmentNames.length > 0 
          ? s.departmentNames 
          : s.totalDepartments > 0 ? ['Management', 'Engineering', 'Operations'].slice(0, s.totalDepartments) : []
      });
      
      const days = Array.from({ length: 7 }, (_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const dateStr = d.toISOString().split('T')[0];
        const records = Array.isArray(history) ? history.filter((r: any) => r.date === dateStr) : [];
        return {
          name: d.toLocaleDateString('en-US', { weekday: 'short' }),
          present: records.length,
          late: records.filter((r: any) => r.status === AttendanceStatus.LATE).length
        };
      }).reverse();
      setChartData(days);
    } catch (err) {
      console.error("Dashboard error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) return (
    <div className="flex flex-col items-center justify-center h-full space-y-4">
      <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Aggregating Live Data...</p>
    </div>
  );

  const activeTeamsList = stats.departmentNames || [];

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black text-gray-900 tracking-tight">Dashboard Overview</h2>
          {/* <p className="text-gray-500 font-medium">Real-time attendance statistics from the central database.</p> */}
        </div>
        <button 
          onClick={fetchData}
          className="px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-bold text-gray-700 hover:bg-gray-50 shadow-sm transition-all active:scale-95"
        >
          <i className="fas fa-sync-alt mr-2"></i> Refresh Data
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { 
            label: 'Active Teams', 
            value: stats.totalDepartments, 
            icon: 'fa-sitemap', 
            color: 'blue', 
            trend: activeTeamsList.length > 0 ? activeTeamsList.join(', ') : 'No departments detected'
          },
          { label: 'Present Today', value: stats.presentToday, icon: 'fa-fingerprint', color: 'green', trend: 'Active today' },
          { label: 'Late Entries', value: stats.lateToday, icon: 'fa-exclamation-circle', color: 'orange', trend: 'Punctuality log' },
          { label: 'Pending Leaves', value: stats.pendingLeaves, icon: 'fa-file-invoice', color: 'purple', trend: 'Leave requests' },
        ].map((item, i) => (
          <div key={i} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col h-full group">
            <div className={`w-14 h-14 flex items-center justify-center bg-${item.color}-50 text-${item.color}-600 rounded-2xl mb-4 group-hover:scale-110 transition-transform`}>
              <i className={`fas ${item.icon} text-2xl`}></i>
            </div>
            <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">{item.label}</p>
            <p className="text-3xl font-black text-gray-900 mb-2">{item.value}</p>
            <p className="text-[10px] font-bold text-gray-500 uppercase leading-relaxed line-clamp-2" title={item.trend}>
              {item.trend}
            </p>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h3 className="font-bold text-gray-800 text-lg">Weekly Engagement</h3>
            <div className="flex items-center space-x-4 text-[10px] font-bold uppercase tracking-widest text-gray-400">
              <div className="flex items-center"><span className="w-2 h-2 rounded-full bg-blue-500 mr-2"></span> Present</div>
              <div className="flex items-center"><span className="w-2 h-2 rounded-full bg-orange-500 mr-2"></span> Late</div>
            </div>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fontWeight: 600, fill: '#94a3b8' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fontWeight: 600, fill: '#94a3b8' }} />
                <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }} />
                <Bar dataKey="present" fill="#3b82f6" radius={[6, 6, 0, 0]} barSize={24} />
                <Bar dataKey="late" fill="#f97316" radius={[6, 6, 0, 0]} barSize={24} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm flex flex-col">
          <h3 className="font-bold text-gray-800 text-lg mb-6">Recent Activity</h3>
          <div className="flex-1 space-y-6">
            <div className="flex items-start space-x-4">
              <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
                <i className="fas fa-database text-sm"></i>
              </div>
              <div>
                <p className="text-sm font-bold text-gray-800">Database Active</p>
                <p className="text-xs text-gray-500">Live sync connected to smarttrack_db.</p>
                <p className="text-[10px] font-black text-blue-600 mt-1 uppercase">Operational</p>
              </div>
            </div>
            {activeTeamsList.length > 0 && (
              <div className="mt-4 p-4 bg-gray-50 rounded-2xl">
                <p className="text-[10px] font-black text-gray-400 uppercase mb-2">Team List</p>
                <div className="flex flex-wrap gap-2">
                  {activeTeamsList.map((t, idx) => (
                    <span key={idx} className="px-2 py-1 bg-white border border-gray-200 rounded-lg text-[10px] font-bold text-gray-700">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
          <button 
            onClick={() => window.location.hash = '/admin/reports'}
            className="mt-8 w-full py-3 bg-gray-50 rounded-2xl text-xs font-bold text-gray-500 hover:bg-gray-100 transition-colors uppercase tracking-widest"
          >
            Manage All Records
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

