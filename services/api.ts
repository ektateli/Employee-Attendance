
import { User, AttendanceRecord, LeaveRequest, UserRole, AttendanceStatus } from '../types';

const API_BASE = 'http://localhost:5000/api';

const syncChannel = new BroadcastChannel('smarttrack_live');

export const notifySync = (type: string, payload: any) => {
  syncChannel.postMessage({ type, payload, timestamp: Date.now() });
};

export const api = {
  syncChannel,

  async login(email: string, pass: string): Promise<{ user: User, token: string }> {
    const cleanEmail = email.trim().toLowerCase();
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: cleanEmail, password: pass })
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || 'Login failed.');
    }

    return res.json();
  },

  async register(data: { name: string, email: string, password: string, department: string }): Promise<{ user: User, token: string }> {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || 'Registration failed.');
    }

    return res.json();
  },

  async getUsers(): Promise<User[]> {
    const res = await fetch(`${API_BASE}/users`);
    return res.json();
  },

  async addUser(user: Partial<User>): Promise<User> {
    const res = await fetch(`${API_BASE}/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(user)
    });
    return res.json();
  },

   async updateUser(userId: string, updates: Partial<User & { password?: string }>): Promise<void> {
    const res = await fetch(`${API_BASE}/users/${userId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    });
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.error || 'Update failed on server');
    }
  },


  async markCheckIn(userId: string): Promise<AttendanceRecord> {
    const res = await fetch(`${API_BASE}/attendance/check-in`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId })
    });
    const record = await res.json();
    notifySync('ATTENDANCE_UPDATE', record);
    return record;
  },

  async markCheckOut(recordId: string): Promise<AttendanceRecord> {
    const res = await fetch(`${API_BASE}/attendance/check-out/${recordId}`, { 
      method: 'PUT' 
    });
    const record = await res.json();
    notifySync('ATTENDANCE_UPDATE', record);
    return record;
  },

  async getAttendance(userId?: string): Promise<AttendanceRecord[]> {
    const url = userId ? `${API_BASE}/attendance?userId=${userId}` : `${API_BASE}/attendance`;
    const res = await fetch(url);
    return res.json();
  },

  async getLeaves(userId?: string): Promise<LeaveRequest[]> {
    const url = userId ? `${API_BASE}/leaves?userId=${userId}` : `${API_BASE}/leaves`;
    const res = await fetch(url);
    return res.json();
  },

  async applyLeave(request: Partial<LeaveRequest>): Promise<LeaveRequest> {
    const res = await fetch(`${API_BASE}/leaves`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(request)
    });
    return res.json();
  },

  async updateLeaveStatus(id: string, status: 'APPROVED' | 'REJECTED'): Promise<LeaveRequest> {
    const res = await fetch(`${API_BASE}/leaves/${id}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });
    return res.json();
  },

  async getStats() {
    const res = await fetch(`${API_BASE}/stats`);
    return res.json();
  }
};
