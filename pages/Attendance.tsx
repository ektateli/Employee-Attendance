
// import React, { useState, useEffect } from 'react';
// import { useAuth } from '../App';
// import { api } from '../services/api';
// import { AttendanceRecord } from '../types';

// const AttendancePage: React.FC = () => {
//   const { auth } = useAuth();
//   const [record, setRecord] = useState<AttendanceRecord | null>(null);
//   const [loading, setLoading] = useState(false);
//   const [currentTime, setCurrentTime] = useState(new Date());
  
//   // Security State
//   const [newPassword, setNewPassword] = useState('');
//   const [passLoading, setPassLoading] = useState(false);
//   const [passMessage, setPassMessage] = useState<{ text: string, type: 'success' | 'error' } | null>(null);

//   useEffect(() => {
//     const timer = setInterval(() => setCurrentTime(new Date()), 1000);
//     const fetchToday = async () => {
//       if (!auth.user) return;
//       try {
//         const today = new Date().toISOString().split('T')[0];
//         const userRecords = await api.getAttendance(auth.user.id);
//         const todayRecord = userRecords.find(r => r.date === today);
//         setRecord(todayRecord || null);
//       } catch (err) {
//         console.error("Failed to fetch today's record");
//       }
//     };
//     fetchToday();

//     const handleSync = () => fetchToday();
//     api.syncChannel.addEventListener('message', handleSync);
    
//     return () => {
//       clearInterval(timer);
//       api.syncChannel.removeEventListener('message', handleSync);
//     };
//   }, [auth.user]);

//   const handleAction = async () => {
//     if (!auth.user) return;
//     setLoading(true);
//     try {
//       if (!record) {
//         const newRec = await api.markCheckIn(auth.user.id);
//         setRecord(newRec);
//       } else {
//         const updated = await api.markCheckOut(record.id);
//         setRecord(updated);
//       }
//     } catch (err) {
//       alert("Database Connectivity Error.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handlePasswordChange = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!auth.user || !newPassword) return;
//     setPassLoading(true);
//     try {
//       await api.updateUser(auth.user.id, { password: newPassword });
//       setPassMessage({ text: 'Password updated successfully!', type: 'success' });
//       setNewPassword('');
//     } catch (err) {
//       setPassMessage({ text: 'Update failed. Try again.', type: 'error' });
//     } finally {
//       setPassLoading(false);
//       setTimeout(() => setPassMessage(null), 3000);
//     }
//   };

//   const isCheckedOut = !!record?.checkOut;

//   return (
//     <div className="max-w-4xl mx-auto space-y-12 animate-fade-in pb-20">
//       {/* Time Tracking Card */}
//       <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-2xl overflow-hidden">
//         <div className="bg-gradient-to-br from-blue-700 via-blue-600 to-indigo-800 p-12 text-center text-white relative">
//           <div className="relative z-10">
//             <p className="text-blue-100 font-black mb-4 uppercase tracking-[0.3em] text-[10px]">Work Session</p>
//             <h2 className="text-7xl font-black mb-6 tracking-tighter">
//               {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })}
//             </h2>
//             <div className="flex items-center justify-center space-x-3 text-lg opacity-80 font-medium">
//               <i className="far fa-calendar-alt"></i>
//               <span>{currentTime.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</span>
//             </div>
//           </div>
//         </div>

//         <div className="p-16 flex flex-col items-center">
//           <div className="mb-12 text-center">
//             {record ? (
//               <div className="space-y-6">
//                 <div className="flex items-center justify-center space-x-12">
//                   <div className="text-center">
//                     <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-2">Check In</p>
//                     <p className="text-3xl font-black text-gray-800">
//                       {new Date(record.checkIn).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
//                     </p>
//                   </div>
//                   <div className="w-px h-12 bg-gray-100"></div>
//                   <div className="text-center">
//                     <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-2">Check Out</p>
//                     <p className="text-3xl font-black text-gray-800">
//                       {record.checkOut ? new Date(record.checkOut).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '--:--'}
//                     </p>
//                   </div>
//                 </div>
//               </div>
//             ) : (
//               <div className="space-y-2">
//                 <h3 className="text-xl font-bold text-gray-800">Welcome, {auth.user?.name}</h3>
//                 <p className="text-gray-400 font-medium">Start your work session below.</p>
//               </div>
//             )}
//           </div>

//           <button
//             onClick={handleAction}
//             disabled={loading || isCheckedOut}
//             className={`
//               relative w-56 h-56 rounded-full flex flex-col items-center justify-center text-white font-black text-xl
//               transition-all duration-500 transform 
//               ${!record ? 'bg-blue-600 shadow-xl' : isCheckedOut ? 'bg-gray-200 cursor-not-allowed' : 'bg-red-500 shadow-xl'}
//               active:scale-95
//             `}
//           >
//             {loading ? <i className="fas fa-spinner fa-spin text-5xl"></i> : <span>{!record ? 'Clock In' : isCheckedOut ? 'Done' : 'Clock Out'}</span>}
//           </button>
//         </div>
//       </div>

//       {/* Profile & Security Section */}
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//         {/* Personal Details */}
//         <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm">
//           <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center">
//             <i className="fas fa-user-circle text-blue-500 mr-3"></i> Profile Details
//           </h3>
//           <div className="space-y-4">
//              <div className="flex justify-between items-center py-3 border-b border-gray-50">
//                 <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Employee ID</span>
//                 <span className="text-sm font-semibold text-gray-800">{auth.user?.id}</span>
//              </div>
//              <div className="flex justify-between items-center py-3 border-b border-gray-50">
//                 <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Full Name</span>
//                 <span className="text-sm font-semibold text-gray-800">{auth.user?.name}</span>
//              </div>
//              <div className="flex justify-between items-center py-3 border-b border-gray-50">
//                 <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Department</span>
//                 <span className="text-sm font-semibold text-gray-800">{auth.user?.department}</span>
//              </div>
//              <div className="flex justify-between items-center py-3">
//                 <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Email</span>
//                 <span className="text-sm font-semibold text-gray-800">{auth.user?.email}</span>
//              </div>
//           </div>
//         </div>

//         {/* Security Settings */}
//         <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm">
//           <h3 className="text-lg font-bold text-gray-800 mb-2 flex items-center">
//             <i className="fas fa-shield-alt text-orange-500 mr-3"></i> Security Settings
//           </h3>
//           <p className="text-xs text-gray-400 mb-6 font-medium uppercase tracking-wider">Secure your MySQL credentials</p>
          
//           <form onSubmit={handlePasswordChange} className="space-y-4">
//             <div>
//               <label className="block text-[10px] font-bold text-gray-400 uppercase mb-2">Change Password</label>
//               <div className="relative">
//                 <input 
//                   type="password"
//                   placeholder="Enter new password"
//                   className="w-full pl-4 pr-12 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500 text-sm"
//                   value={newPassword}
//                   onChange={(e) => setNewPassword(e.target.value)}
//                 />
//                 <button type="submit" disabled={passLoading || !newPassword} className="absolute right-2 top-1.5 p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-all">
//                   {passLoading ? <i className="fas fa-spinner fa-spin text-xs"></i> : <i className="fas fa-arrow-right text-xs"></i>}
//                 </button>
//               </div>
//             </div>
            
//             {passMessage && (
//               <div className={`p-3 rounded-xl text-[10px] font-bold uppercase text-center animate-fade-in ${passMessage.type === 'success' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
//                 {passMessage.text}
//               </div>
//             )}

//             <div className="p-4 bg-orange-50 border border-orange-100 rounded-xl">
//               <p className="text-[10px] text-orange-700 leading-relaxed font-semibold uppercase italic">
//                 <i className="fas fa-exclamation-triangle mr-1"></i>
//                 Updating your password will take effect immediately. Ensure you keep it confidential.
//               </p>
//             </div>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AttendancePage;







//2nd  


// import React, { useState, useEffect } from 'react';
// import { useAuth } from '../App';
// import { api } from '../services/api';
// import { AttendanceRecord } from '../types';

// const AttendancePage: React.FC = () => {
//   const { auth } = useAuth();
//   const [record, setRecord] = useState<AttendanceRecord | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [currentTime, setCurrentTime] = useState(new Date());
  
//   // Security State
//   const [newPassword, setNewPassword] = useState('');
//   const [passLoading, setPassLoading] = useState(false);
//   const [passMessage, setPassMessage] = useState<{ text: string, type: 'success' | 'error' } | null>(null);

//   const fetchToday = async () => {
//     if (!auth.user) return;
//     try {
//       const today = new Date().toISOString().split('T')[0];
//       const userRecords = await api.getAttendance(auth.user.id);
//       // Get the latest record for today specifically
//       const todayRecord = userRecords
//         .filter(r => r.date === today)
//         .sort((a, b) => new Date(b.checkIn).getTime() - new Date(a.checkIn).getTime())[0];
      
//       setRecord(todayRecord || null);
//     } catch (err) {
//       console.error("Failed to fetch today's record");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     const timer = setInterval(() => setCurrentTime(new Date()), 1000);
//     fetchToday();

//     const handleSync = () => fetchToday();
//     api.syncChannel.addEventListener('message', handleSync);
    
//     return () => {
//       clearInterval(timer);
//       api.syncChannel.removeEventListener('message', handleSync);
//     };
//   }, [auth.user]);

//   const handleAction = async () => {
//     if (!auth.user || loading) return;
//     setLoading(true);
//     try {
//       if (!record) {
//         const newRec = await api.markCheckIn(auth.user.id);
//         setRecord(newRec);
//       } else if (!record.checkOut) {
//         const updated = await api.markCheckOut(record.id);
//         setRecord(updated);
//       }
//     } catch (err) {
//       alert("Database Connectivity Error. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handlePasswordChange = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!auth.user || !newPassword) return;
//     setPassLoading(true);
//     try {
//       await api.updateUser(auth.user.id, { password: newPassword });
//       setPassMessage({ text: 'Password updated successfully!', type: 'success' });
//       setNewPassword('');
//     } catch (err) {
//       setPassMessage({ text: 'Update failed. Try again.', type: 'error' });
//     } finally {
//       setPassLoading(false);
//       setTimeout(() => setPassMessage(null), 3000);
//     }
//   };

//   const isCheckedOut = !!record?.checkOut;

//   return (
//     <div className="max-w-4xl mx-auto space-y-12 animate-fade-in pb-20">
//       {/* Time Tracking Card */}
//       <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-2xl overflow-hidden">
//         <div className="bg-gradient-to-br from-blue-700 via-blue-600 to-indigo-800 p-12 text-center text-white relative">
//           <div className="relative z-10">
//             <p className="text-blue-100 font-black mb-4 uppercase tracking-[0.3em] text-[10px]">Work Session</p>
//             <h2 className="text-7xl font-black mb-6 tracking-tighter">
//               {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })}
//             </h2>
//             <div className="flex items-center justify-center space-x-3 text-lg opacity-80 font-medium">
//               <i className="far fa-calendar-alt"></i>
//               <span>{currentTime.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</span>
//             </div>
//           </div>
//         </div>

//         <div className="p-16 flex flex-col items-center">
//           <div className="mb-12 text-center">
//             {record ? (
//               <div className="space-y-6">
//                 <div className="flex items-center justify-center space-x-12">
//                   <div className="text-center">
//                     <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-2">Check In</p>
//                     <p className="text-3xl font-black text-gray-800">
//                       {new Date(record.checkIn).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
//                     </p>
//                   </div>
//                   <div className="w-px h-12 bg-gray-100"></div>
//                   <div className="text-center">
//                     <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-2">Check Out</p>
//                     <p className="text-3xl font-black text-gray-800">
//                       {record.checkOut ? new Date(record.checkOut).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '--:--'}
//                     </p>
//                   </div>
//                 </div>
//               </div>
//             ) : (
//               <div className="space-y-2">
//                 <h3 className="text-xl font-bold text-gray-800">Welcome, {auth.user?.name}</h3>
//                 <p className="text-gray-400 font-medium">Start your work session below.</p>
//               </div>
//             )}
//           </div>

//           <button
//             onClick={handleAction}
//             disabled={loading || isCheckedOut}
//             className={`
//               relative w-56 h-56 rounded-full flex flex-col items-center justify-center text-white font-black text-xl
//               transition-all duration-500 transform 
//               ${!record ? 'bg-blue-600 shadow-xl' : isCheckedOut ? 'bg-gray-200 cursor-not-allowed opacity-60' : 'bg-red-500 shadow-xl'}
//               active:scale-95
//             `}
//           >
//             {loading ? (
//               <i className="fas fa-spinner fa-spin text-5xl"></i>
//             ) : (
//               <div className="flex flex-col items-center">
//                 <i className={`fas ${!record ? 'fa-sign-in-alt' : isCheckedOut ? 'fa-check-circle' : 'fa-sign-out-alt'} text-4xl mb-3`}></i>
//                 <span>{!record ? 'Clock In' : isCheckedOut ? 'Finished' : 'Clock Out'}</span>
//               </div>
//             )}
//           </button>
          
//           {isCheckedOut && (
//             <p className="mt-6 text-sm font-bold text-green-600 bg-green-50 px-4 py-2 rounded-full flex items-center">
//               <i className="fas fa-check-circle mr-2"></i> Session successfully recorded for today.
//             </p>
//           )}
//         </div>
//       </div>

//       {/* Profile & Security Section */}
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//         <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm">
//           <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center">
//             <i className="fas fa-user-circle text-blue-500 mr-3"></i> Profile Details
//           </h3>
//           <div className="space-y-4">
//              <div className="flex justify-between items-center py-3 border-b border-gray-50">
//                 <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Employee ID</span>
//                 <span className="text-sm font-semibold text-gray-800">{auth.user?.id}</span>
//              </div>
//              <div className="flex justify-between items-center py-3 border-b border-gray-50">
//                 <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Full Name</span>
//                 <span className="text-sm font-semibold text-gray-800">{auth.user?.name}</span>
//              </div>
//              <div className="flex justify-between items-center py-3 border-b border-gray-50">
//                 <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Department</span>
//                 <span className="text-sm font-semibold text-gray-800">{auth.user?.department}</span>
//              </div>
//              <div className="flex justify-between items-center py-3">
//                 <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Email</span>
//                 <span className="text-sm font-semibold text-gray-800">{auth.user?.email}</span>
//              </div>
//           </div>
//         </div>

//         <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm">
//           <h3 className="text-lg font-bold text-gray-800 mb-2 flex items-center">
//             <i className="fas fa-shield-alt text-orange-500 mr-3"></i> Security Settings
//           </h3>
//           <p className="text-xs text-gray-400 mb-6 font-medium uppercase tracking-wider">Secure your MySQL credentials</p>
          
//           <form onSubmit={handlePasswordChange} className="space-y-4">
//             <div>
//               <label className="block text-[10px] font-bold text-gray-400 uppercase mb-2">Change Password</label>
//               <div className="relative">
//                 <input 
//                   type="password"
//                   placeholder="Enter new password"
//                   className="w-full pl-4 pr-12 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500 text-sm"
//                   value={newPassword}
//                   onChange={(e) => setNewPassword(e.target.value)}
//                 />
//                 <button type="submit" disabled={passLoading || !newPassword} className="absolute right-2 top-1.5 p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-all">
//                   {passLoading ? <i className="fas fa-spinner fa-spin text-xs"></i> : <i className="fas fa-arrow-right text-xs"></i>}
//                 </button>
//               </div>
//             </div>
            
//             {passMessage && (
//               <div className={`p-3 rounded-xl text-[10px] font-bold uppercase text-center animate-fade-in ${passMessage.type === 'success' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
//                 {passMessage.text}
//               </div>
//             )}

//             <div className="p-4 bg-orange-50 border border-orange-100 rounded-xl">
//               <p className="text-[10px] text-orange-700 leading-relaxed font-semibold uppercase italic">
//                 <i className="fas fa-exclamation-triangle mr-1"></i>
//                 Updating your password will take effect immediately. Ensure you keep it confidential.
//               </p>
//             </div>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AttendancePage;










// 2nd 



// import React, { useState, useEffect } from 'react';
// import { useAuth } from '../App';
// import { api } from '../services/api';
// import { AttendanceRecord } from '../types';

// const AttendancePage: React.FC = () => {
//   const { auth } = useAuth();
//   const [record, setRecord] = useState<AttendanceRecord | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [currentTime, setCurrentTime] = useState(new Date());
  
//   // Security State
//   const [newPassword, setNewPassword] = useState('');
//   const [passLoading, setPassLoading] = useState(false);
//   const [passMessage, setPassMessage] = useState<{ text: string, type: 'success' | 'error' } | null>(null);

//   const fetchToday = async () => {
//     if (!auth.user) return;
//     try {
//       const today = new Date().toISOString().split('T')[0];
//       const userRecords = await api.getAttendance(auth.user.id);
//       // Get the latest record for today specifically
//       const todayRecord = userRecords
//         .filter(r => r.date === today)
//         .sort((a, b) => new Date(b.checkIn).getTime() - new Date(a.checkIn).getTime())[0];
      
//       setRecord(todayRecord || null);
//     } catch (err) {
//       console.error("Failed to fetch today's record");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     const timer = setInterval(() => setCurrentTime(new Date()), 1000);
//     fetchToday();

//     const handleSync = () => fetchToday();
//     api.syncChannel.addEventListener('message', handleSync);
    
//     return () => {
//       clearInterval(timer);
//       api.syncChannel.removeEventListener('message', handleSync);
//     };
//   }, [auth.user]);

//   const handleAction = async () => {
//     if (!auth.user || loading) return;
//     setLoading(true);
//     try {
//       if (!record) {
//         const newRec = await api.markCheckIn(auth.user.id);
//         setRecord(newRec);
//       } else if (!record.checkOut) {
//         const updated = await api.markCheckOut(record.id);
//         setRecord(updated);
//       }
//     } catch (err) {
//       alert("Database Connectivity Error. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handlePasswordChange = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!auth.user || !newPassword) return;
//     setPassLoading(true);
//     try {
//       await api.updateUser(auth.user.id, { password: newPassword });
//       setPassMessage({ text: 'Password updated successfully!', type: 'success' });
//       setNewPassword('');
//     } catch (err) {
//       setPassMessage({ text: 'Update failed. Try again.', type: 'error' });
//     } finally {
//       setPassLoading(false);
//       setTimeout(() => setPassMessage(null), 3000);
//     }
//   };

//   const isCheckedOut = !!record?.checkOut;

//   return (
//     <div className="max-w-4xl mx-auto space-y-12 animate-fade-in pb-20">
//       {/* Time Tracking Card */}
//       <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-2xl overflow-hidden">
//         <div className="bg-gradient-to-br from-blue-700 via-blue-600 to-indigo-800 p-12 text-center text-white relative">
//           <div className="relative z-10">
//             <p className="text-blue-100 font-black mb-4 uppercase tracking-[0.3em] text-[10px]">Work Session</p>
//             <h2 className="text-7xl font-black mb-6 tracking-tighter">
//               {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })}
//             </h2>
//             <div className="flex items-center justify-center space-x-3 text-lg opacity-80 font-medium">
//               <i className="far fa-calendar-alt"></i>
//               <span>{currentTime.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</span>
//             </div>
//           </div>
//         </div>

//         <div className="p-16 flex flex-col items-center">
//           <div className="mb-12 text-center">
//             {record ? (
//               <div className="space-y-6">
//                 <div className="flex items-center justify-center space-x-12">
//                   <div className="text-center">
//                     <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-2">Check In</p>
//                     <p className="text-3xl font-black text-gray-800">
//                       {new Date(record.checkIn).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
//                     </p>
//                   </div>
//                   <div className="w-px h-12 bg-gray-100"></div>
//                   <div className="text-center">
//                     <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-2">Check Out</p>
//                     <p className="text-3xl font-black text-gray-800">
//                       {record.checkOut ? new Date(record.checkOut).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '--:--'}
//                     </p>
//                   </div>
//                 </div>
//               </div>
//             ) : (
//               <div className="space-y-2">
//                 <h3 className="text-xl font-bold text-gray-800">Welcome, {auth.user?.name}</h3>
//                 <p className="text-gray-400 font-medium">Start your work session below.</p>
//               </div>
//             )}
//           </div>

//           <button
//             onClick={handleAction}
//             disabled={loading || isCheckedOut}
//             className={`
//               relative w-56 h-56 rounded-full flex flex-col items-center justify-center text-white font-black text-xl
//               transition-all duration-500 transform 
//               ${!record ? 'bg-blue-600 shadow-xl' : isCheckedOut ? 'bg-gray-200 cursor-not-allowed opacity-60' : 'bg-red-500 shadow-xl'}
//               active:scale-95
//             `}
//           >
//             {loading ? (
//               <i className="fas fa-spinner fa-spin text-5xl"></i>
//             ) : (
//               <div className="flex flex-col items-center">
//                 <i className={`fas ${!record ? 'fa-sign-in-alt' : isCheckedOut ? 'fa-check-circle' : 'fa-sign-out-alt'} text-4xl mb-3`}></i>
//                 <span>{!record ? 'Clock In' : isCheckedOut ? 'Finished' : 'Clock Out'}</span>
//               </div>
//             )}
//           </button>
          
//           {isCheckedOut && (
//             <p className="mt-6 text-sm font-bold text-green-600 bg-green-50 px-4 py-2 rounded-full flex items-center">
//               <i className="fas fa-check-circle mr-2"></i> Session successfully recorded for today.
//             </p>
//           )}
//         </div>
//       </div>

//       {/* Profile & Security Section */}
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//         <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm">
//           <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center">
//             <i className="fas fa-user-circle text-blue-500 mr-3"></i> Profile Details
//           </h3>
//           <div className="space-y-4">
//              <div className="flex justify-between items-center py-3 border-b border-gray-50">
//                 <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Employee ID</span>
//                 <span className="text-sm font-semibold text-gray-800">{auth.user?.id}</span>
//              </div>
//              <div className="flex justify-between items-center py-3 border-b border-gray-50">
//                 <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Full Name</span>
//                 <span className="text-sm font-semibold text-gray-800">{auth.user?.name}</span>
//              </div>
//              <div className="flex justify-between items-center py-3 border-b border-gray-50">
//                 <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Department</span>
//                 <span className="text-sm font-semibold text-gray-800">{auth.user?.department}</span>
//              </div>
//              <div className="flex justify-between items-center py-3">
//                 <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Email</span>
//                 <span className="text-sm font-semibold text-gray-800">{auth.user?.email}</span>
//              </div>
//           </div>
//         </div>

//         <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm">
//           <h3 className="text-lg font-bold text-gray-800 mb-2 flex items-center">
//             <i className="fas fa-shield-alt text-orange-500 mr-3"></i> Security Settings
//           </h3>
//           <p className="text-xs text-gray-400 mb-6 font-medium uppercase tracking-wider">Secure your MySQL credentials</p>
          
//           <form onSubmit={handlePasswordChange} className="space-y-4">
//             <div>
//               <label className="block text-[10px] font-bold text-gray-400 uppercase mb-2">Change Password</label>
//               <div className="relative">
//                 <input 
//                   type="password"
//                   placeholder="Enter new password"
//                   className="w-full pl-4 pr-12 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500 text-sm"
//                   value={newPassword}
//                   onChange={(e) => setNewPassword(e.target.value)}
//                 />
//                 <button type="submit" disabled={passLoading || !newPassword} className="absolute right-2 top-1.5 p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-all">
//                   {passLoading ? <i className="fas fa-spinner fa-spin text-xs"></i> : <i className="fas fa-arrow-right text-xs"></i>}
//                 </button>
//               </div>
//             </div>
            
//             {passMessage && (
//               <div className={`p-3 rounded-xl text-[10px] font-bold uppercase text-center animate-fade-in ${passMessage.type === 'success' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
//                 {passMessage.text}
//               </div>
//             )}

//             <div className="p-4 bg-orange-50 border border-orange-100 rounded-xl">
//               <p className="text-[10px] text-orange-700 leading-relaxed font-semibold uppercase italic">
//                 <i className="fas fa-exclamation-triangle mr-1"></i>
//                 Updating your password will take effect immediately. Ensure you keep it confidential.
//               </p>
//             </div>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AttendancePage;

















import React, { useState, useEffect } from 'react';
import { useAuth } from '../App';
import { api } from '../services/api';
import { AttendanceRecord } from '../types';

const AttendancePage: React.FC = () => {
  const { auth } = useAuth();
  const [activeRecord, setActiveRecord] = useState<AttendanceRecord | null>(null);
  const [lastCompletedToday, setLastCompletedToday] = useState<AttendanceRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());
  
  // Security State
  const [newPassword, setNewPassword] = useState('');
  const [passLoading, setPassLoading] = useState(false);
  const [passMessage, setPassMessage] = useState<{ text: string, type: 'success' | 'error' } | null>(null);

  const fetchSessionData = async () => {
    if (!auth.user) return;
    try {
      const userRecords = await api.getAttendance(auth.user.id);
      
      // Sort by check-in descending (latest first)
      const sorted = [...userRecords].sort((a, b) => 
        new Date(b.checkIn).getTime() - new Date(a.checkIn).getTime()
      );
      
      const latest = sorted[0];

      if (latest && !latest.checkOut) {
        // Active session found
        setActiveRecord(latest);
        setLastCompletedToday(null);
      } else {
        // No active session, button should be "Clock In"
        setActiveRecord(null);
        const d = new Date();
        const todayStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
        
        // Find the most recently finished shift from today
        const completedToday = sorted.find(r => 
          r.checkOut && (r.date === todayStr || r.checkIn.includes(todayStr))
        );
        setLastCompletedToday(completedToday || null);
      }
    } catch (err) {
      console.error("Session fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    fetchSessionData();

    const handleSync = () => fetchSessionData();
    api.syncChannel.addEventListener('message', handleSync);
    
    return () => {
      clearInterval(timer);
      api.syncChannel.removeEventListener('message', handleSync);
    };
  }, [auth.user]);

  const handleAction = async () => {
    if (!auth.user || loading) return;
    setLoading(true);
    try {
      if (!activeRecord) {
        // Start a new Clock In
        const newRec = await api.markCheckIn(auth.user.id);
        setActiveRecord(newRec);
        setLastCompletedToday(null);
      } else {
        // Complete the Clock Out
        const updated = await api.markCheckOut(activeRecord.id);
        setActiveRecord(null); // This clears the state so "Clock In" button shows again
        setLastCompletedToday(updated);
      }
    } catch (err) {
      console.error("Action error:", err);
      alert("Database communication failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth.user || !newPassword) return;
    setPassLoading(true);
    try {
      await api.updateUser(auth.user.id, { password: newPassword });
      setPassMessage({ text: 'Password updated successfully!', type: 'success' });
      setNewPassword('');
    } catch (err) {
      setPassMessage({ text: 'Update failed. Try again.', type: 'error' });
    } finally {
      setPassLoading(false);
      setTimeout(() => setPassMessage(null), 3000);
    }
  };

  // Improved time formatter to handle strict ISO strings from server
  const formatTimeSafe = (timeVal: any) => {
    if (!timeVal) return '--:--';
    
    try {
      let dateObj: Date;
      if (timeVal instanceof Date) {
        dateObj = timeVal;
      } else {
        // Normalize the date string for browser parsing
        const cleanVal = typeof timeVal === 'string' ? timeVal.replace(' ', 'T') : timeVal;
        dateObj = new Date(cleanVal);
      }

      if (isNaN(dateObj.getTime())) {
        console.warn("Invalid Date Received:", timeVal);
        return '--:--';
      }
      
      return dateObj.toLocaleTimeString([], { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true 
      });
    } catch (e) {
      return '--:--';
    }
  };

  // Determine which record to display in the status boxes
  const displayRecord = activeRecord || lastCompletedToday;

  return (
    <div className="max-w-4xl mx-auto space-y-12 animate-fade-in pb-20">
      {/* Time Tracking Card */}
      <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-2xl overflow-hidden">
        <div className="bg-gradient-to-br from-blue-700 via-blue-600 to-indigo-800 p-12 text-center text-white relative">
          <div className="relative z-10">
            <p className="text-blue-100 font-black mb-4 uppercase tracking-[0.3em] text-[10px]">Work Session</p>
            <h2 className="text-7xl font-black mb-6 tracking-tighter">
              {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })}
            </h2>
            <div className="flex items-center justify-center space-x-3 text-lg opacity-80 font-medium">
              <i className="far fa-calendar-alt"></i>
              <span>{currentTime.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</span>
            </div>
          </div>
        </div>

        <div className="p-16 flex flex-col items-center">
          <div className="mb-12 text-center w-full">
            <div className="flex items-center justify-center space-x-12">
              <div className="text-center min-w-[120px]">
                <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-2">Check In</p>
                <p className="text-3xl font-black text-gray-800">
                  {formatTimeSafe(displayRecord?.checkIn)}
                </p>
              </div>
              <div className="w-px h-12 bg-gray-100"></div>
              <div className="text-center min-w-[120px]">
                <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-2">Check Out</p>
                <p className="text-3xl font-black text-gray-800">
                  {formatTimeSafe(displayRecord?.checkOut)}
                </p>
              </div>
            </div>
            
            {/* Show a helpful summary if session ended */}
            {lastCompletedToday && !activeRecord && (
              <p className="mt-8 text-xs font-black text-gray-300 uppercase tracking-[0.2em] animate-fade-in">
                Last shift ended at {formatTimeSafe(lastCompletedToday.checkOut)}
              </p>
            )}
            
            {!displayRecord && !loading && (
              <p className="mt-4 text-gray-400 font-medium italic">No active sessions found for today.</p>
            )}
          </div>

          <button
            onClick={handleAction}
            disabled={loading}
            className={`
              relative w-56 h-56 rounded-full flex flex-col items-center justify-center text-white font-black text-xl
              transition-all duration-500 transform shadow-xl hover:scale-105 active:scale-95
              ${!activeRecord ? 'bg-blue-600 hover:bg-blue-700' : 'bg-red-500 hover:bg-red-600'}
              disabled:opacity-50
            `}
          >
            {loading ? (
              <i className="fas fa-spinner fa-spin text-5xl"></i>
            ) : (
              <div className="flex flex-col items-center">
                <i className={`fas ${!activeRecord ? 'fa-sign-in-alt' : 'fa-sign-out-alt'} text-4xl mb-3`}></i>
                <span>{!activeRecord ? 'Clock In' : 'Clock Out'}</span>
              </div>
            )}
          </button>
          
          {!activeRecord && lastCompletedToday && (
            <div className="mt-8 animate-fade-in">
              <p className="text-sm font-bold text-green-600 bg-green-50 px-6 py-2.5 rounded-full flex items-center border border-green-100 shadow-sm">
                <i className="fas fa-check-circle mr-2"></i> Session logged successfully.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Profile & Security Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm">
          <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center">
            <i className="fas fa-user-circle text-blue-500 mr-3"></i> Profile Details
          </h3>
          <div className="space-y-4">
             <div className="flex justify-between items-center py-3 border-b border-gray-50">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Employee ID</span>
                <span className="text-sm font-semibold text-gray-800">{auth.user?.id}</span>
             </div>
             <div className="flex justify-between items-center py-3 border-b border-gray-50">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Full Name</span>
                <span className="text-sm font-semibold text-gray-800">{auth.user?.name}</span>
             </div>
             <div className="flex justify-between items-center py-3 border-b border-gray-50">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Department</span>
                <span className="text-sm font-semibold text-gray-800">{auth.user?.department}</span>
             </div>
             <div className="flex justify-between items-center py-3">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Email</span>
                <span className="text-sm font-semibold text-gray-800">{auth.user?.email}</span>
             </div>
          </div>
        </div>

        <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm">
          <h3 className="text-lg font-bold text-gray-800 mb-2 flex items-center">
            <i className="fas fa-shield-alt text-orange-500 mr-3"></i> Security Settings
          </h3>
          <p className="text-xs text-gray-400 mb-6 font-medium uppercase tracking-wider">Update your password</p>
          
          <form onSubmit={handlePasswordChange} className="space-y-4">
            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase mb-2">New Password</label>
              <div className="relative">
                <input 
                  type="password"
                  placeholder="Enter new password"
                  className="w-full pl-4 pr-12 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500 text-sm"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
                <button type="submit" disabled={passLoading || !newPassword} className="absolute right-2 top-1.5 p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-all">
                  {passLoading ? <i className="fas fa-spinner fa-spin text-xs"></i> : <i className="fas fa-arrow-right text-xs"></i>}
                </button>
              </div>
            </div>
            
            {passMessage && (
              <div className={`p-3 rounded-xl text-[10px] font-bold uppercase text-center animate-fade-in ${passMessage.type === 'success' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                {passMessage.text}
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default AttendancePage;
