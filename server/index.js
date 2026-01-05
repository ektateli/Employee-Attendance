
// const express = require('express');
// const mysql = require('mysql2/promise');
// const cors = require('cors');
// require('dotenv').config();

// const app = express();
// app.use(cors());
// app.use(express.json());

// const dbConfig = {
//   host: process.env.DB_HOST || 'localhost',
//   user: process.env.DB_USER || 'root',
//   password: process.env.DB_PASSWORD || '',
//   database: 'smarttrack_db',
//   waitForConnections: true,
//   connectionLimit: 10,
//   queueLimit: 0
// };

// const pool = mysql.createPool(dbConfig);

// // Auth Routes
// app.post('/api/auth/login', async (req, res) => {
//   const { email, password } = req.body;
//   const cleanEmail = email.trim().toLowerCase();
  
//   try {
//     const [rows] = await pool.query('SELECT * FROM users WHERE LOWER(email) = ? AND password = ?', [cleanEmail, password]);
//     const user = rows[0];
    
//     if (user) {
//       const { password: userPass, ...userWithoutPass } = user;
//       res.json({ user: userWithoutPass, token: 'mock-jwt-token' });
//     } else {
//       res.status(401).json({ message: 'Invalid credentials. Please try again.' });
//     }
//   } catch (err) {
//     res.status(500).json({ error: 'Database connection error' });
//   }
// });

// app.post('/api/auth/register', async (req, res) => {
//   const { name, email, password, department } = req.body;
//   const cleanEmail = email.trim().toLowerCase();
//   const id = 'emp-' + Math.random().toString(36).substring(2, 9);
//   const avatar = `https://i.pravatar.cc/150?u=${id}`;
//   const joinedDate = new Date().toISOString().split('T')[0];

//   try {
//     // Check if user already exists
//     const [existing] = await pool.query('SELECT id FROM users WHERE LOWER(email) = ?', [cleanEmail]);
//     if (existing.length > 0) {
//       return res.status(400).json({ message: 'An account with this email already exists.' });
//     }

//     await pool.query(
//       'INSERT INTO users (id, name, email, password, role, avatar, department, joined_date) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
//       [id, name, cleanEmail, password, 'EMPLOYEE', avatar, department || 'Engineering', joinedDate]
//     );

//     const [rows] = await pool.query('SELECT id, name, email, role, avatar, department, joined_date as joinedDate FROM users WHERE id = ?', [id]);
//     res.json({ user: rows[0], token: 'mock-jwt-token' });
//   } catch (err) {
//     res.status(500).json({ error: 'Registration failed', details: err.message });
//   }
// });

// // Users Routes
// app.get('/api/users', async (req, res) => {
//   try {
//     const [rows] = await pool.query('SELECT id, name, email, role, avatar, department, joined_date as joinedDate FROM users');
//     res.json(rows);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// app.post('/api/users', async (req, res) => {
//   const user = req.body;
//   const id = 'emp-' + Math.random().toString(36).substring(2, 9);
//   try {
//     await pool.query(
//       'INSERT INTO users (id, name, email, password, role, avatar, department, joined_date) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
//       [id, user.name, user.email, 'admin123', user.role, user.avatar || 'https://i.pravatar.cc/150', user.department, user.joinedDate]
//     );
//     res.json({ ...user, id });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// app.put('/api/users/:id', async (req, res) => {
//   const { id } = req.params;
//   const { name, role, department, password, avatar } = req.body;
//   try {
//     let query = 'UPDATE users SET ';
//     const params = [];
//     const fields = [];

//     if (name) { fields.push('name = ?'); params.push(name); }
//     if (role) { fields.push('role = ?'); params.push(role); }
//     if (department) { fields.push('department = ?'); params.push(department); }
//     if (password) { fields.push('password = ?'); params.push(password); }
//     if (avatar) { fields.push('avatar = ?'); params.push(avatar); }

//     if (fields.length === 0) return res.status(400).json({ error: 'No fields to update' });

//     query += fields.join(', ') + ' WHERE id = ?';
//     params.push(id);

//     await pool.query(query, params);
//     res.json({ message: 'User updated successfully' });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// // Attendance Routes
// app.get('/api/attendance', async (req, res) => {
//   const { userId } = req.query;
//   try {
//     let query = 'SELECT * FROM attendance';
//     let params = [];
//     if (userId) {
//       query += ' WHERE user_id = ?';
//       params.push(userId);
//     }
//     const [rows] = await pool.query(query, params);
//     res.json(rows);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// app.post('/api/attendance/check-in', async (req, res) => {
//   const { userId } = req.body;
//   const now = new Date();
//   const date = now.toISOString().split('T')[0];
//   const id = 'att-' + Math.random().toString(36).substring(2, 9);
//   const status = now.getHours() >= 9 ? 'LATE' : 'PRESENT';

//   try {
//     await pool.query(
//       'INSERT INTO attendance (id, user_id, date, check_in, status) VALUES (?, ?, ?, ?, ?)',
//       [id, userId, date, now, status]
//     );
//     const [rows] = await pool.query('SELECT * FROM attendance WHERE id = ?', [id]);
//     res.json(rows[0]);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// app.put('/api/attendance/check-out/:id', async (req, res) => {
//   const { id } = req.params;
//   const now = new Date();
//   try {
//     await pool.query('UPDATE attendance SET check_out = ? WHERE id = ?', [now, id]);
//     const [rows] = await pool.query('SELECT * FROM attendance WHERE id = ?', [id]);
//     res.json(rows[0]);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// // Leave Routes
// app.get('/api/leaves', async (req, res) => {
//   const { userId } = req.query;
//   try {
//     let query = 'SELECT * FROM leaves';
//     let params = [];
//     if (userId) {
//       query += ' WHERE user_id = ?';
//       params.push(userId);
//     }
//     const [rows] = await pool.query(query, params);
//     res.json(rows);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// app.post('/api/leaves', async (req, res) => {
//   const leave = req.body;
//   const id = 'lv-' + Math.random().toString(36).substring(2, 9);
//   try {
//     await pool.query(
//       'INSERT INTO leaves (id, user_id, user_name, start_date, end_date, type, status, reason) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
//       [id, leave.userId, leave.userName, leave.startDate, leave.endDate, leave.type, 'PENDING', leave.reason]
//     );
//     const [rows] = await pool.query('SELECT * FROM leaves WHERE id = ?', [id]);
//     res.json(rows[0]);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// app.put('/api/leaves/:id/status', async (req, res) => {
//   const { id } = req.params;
//   const { status } = req.body;
//   try {
//     await pool.query('UPDATE leaves SET status = ? WHERE id = ?', [status, id]);
//     const [rows] = await pool.query('SELECT * FROM leaves WHERE id = ?', [id]);
//     res.json(rows[0]);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// // Stats Route
// app.get('/api/stats', async (req, res) => {
//   const today = new Date().toISOString().split('T')[0];
//   try {
//     const [[{totalEmployees}]] = await pool.query('SELECT COUNT(*) as totalEmployees FROM users');
//     const [[{presentToday}]] = await pool.query('SELECT COUNT(*) as presentToday FROM attendance WHERE date = ?', [today]);
//     const [[{lateToday}]] = await pool.query('SELECT COUNT(*) as lateToday FROM attendance WHERE date = ? AND status = "LATE"', [today]);
//     const [[{pendingLeaves}]] = await pool.query('SELECT COUNT(*) as pendingLeaves FROM leaves WHERE status = "PENDING"');
    
//     res.json({ totalEmployees, presentToday, lateToday, pendingLeaves });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// // Diagnostic/Debug Route
// app.get('/api/debug/db', async (req, res) => {
//   try {
//     const [users] = await pool.query('SELECT id, name, email, role, department FROM users');
//     res.json({ status: 'Connected', database: 'smarttrack_db', users: users.length });
//   } catch (err) {
//     res.status(500).json({ error: 'DB Diagnostic Error' });
//   }
// });

// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`🚀 Server on http://localhost:${PORT}`));







//2nd




// const express = require('express');
// const mysql = require('mysql2/promise');
// const cors = require('cors');
// require('dotenv').config();

// const app = express();
// app.use(cors());
// app.use(express.json());

// const dbConfig = {
//   host: process.env.DB_HOST || 'localhost',
//   user: process.env.DB_USER || 'root',
//   password: process.env.DB_PASSWORD || '',
//   database: 'smarttrack_db',
//   waitForConnections: true,
//   connectionLimit: 10,
//   queueLimit: 0
// };

// const pool = mysql.createPool(dbConfig);

// // Auth Routes
// app.post('/api/auth/login', async (req, res) => {
//   const { email, password } = req.body;
//   const cleanEmail = email.trim().toLowerCase();
  
//   try {
//     const [rows] = await pool.query('SELECT * FROM users WHERE LOWER(email) = ? AND password = ?', [cleanEmail, password]);
//     const user = rows[0];
    
//     if (user) {
//       const { password: userPass, ...userWithoutPass } = user;
//       res.json({ user: userWithoutPass, token: 'mock-jwt-token' });
//     } else {
//       res.status(401).json({ message: 'Invalid credentials. Please try again.' });
//     }
//   } catch (err) {
//     res.status(500).json({ error: 'Database connection error' });
//   }
// });

// app.post('/api/auth/register', async (req, res) => {
//   const { name, email, password, department } = req.body;
//   const cleanEmail = email.trim().toLowerCase();
//   const id = 'emp-' + Math.random().toString(36).substring(2, 9);
//   const avatar = `https://i.pravatar.cc/150?u=${id}`;
//   const joinedDate = new Date().toISOString().split('T')[0];

//   try {
//     const [existing] = await pool.query('SELECT id FROM users WHERE LOWER(email) = ?', [cleanEmail]);
//     if (existing.length > 0) {
//       return res.status(400).json({ message: 'An account with this email already exists.' });
//     }

//     await pool.query(
//       'INSERT INTO users (id, name, email, password, role, avatar, department, joined_date) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
//       [id, name, cleanEmail, password, 'EMPLOYEE', avatar, department || 'Engineering', joinedDate]
//     );

//     const [rows] = await pool.query('SELECT id, name, email, role, avatar, department, joined_date as joinedDate FROM users WHERE id = ?', [id]);
//     res.json({ user: rows[0], token: 'mock-jwt-token' });
//   } catch (err) {
//     res.status(500).json({ error: 'Registration failed', details: err.message });
//   }
// });

// // Users Routes
// app.get('/api/users', async (req, res) => {
//   try {
//     const [rows] = await pool.query('SELECT id, name, email, role, avatar, department, joined_date as joinedDate FROM users');
//     res.json(rows);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// app.post('/api/users', async (req, res) => {
//   const user = req.body;
//   const id = 'emp-' + Math.random().toString(36).substring(2, 9);
//   try {
//     await pool.query(
//       'INSERT INTO users (id, name, email, password, role, avatar, department, joined_date) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
//       [id, user.name, user.email, 'admin123', user.role, user.avatar || 'https://i.pravatar.cc/150', user.department, user.joinedDate]
//     );
//     res.json({ ...user, id });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// app.put('/api/users/:id', async (req, res) => {
//   const { id } = req.params;
//   const { name, role, department, password, avatar } = req.body;
//   try {
//     let query = 'UPDATE users SET ';
//     const params = [];
//     const fields = [];

//     if (name) { fields.push('name = ?'); params.push(name); }
//     if (role) { fields.push('role = ?'); params.push(role); }
//     if (department) { fields.push('department = ?'); params.push(department); }
//     if (password) { fields.push('password = ?'); params.push(password); }
//     if (avatar) { fields.push('avatar = ?'); params.push(avatar); }

//     if (fields.length === 0) return res.status(400).json({ error: 'No fields to update' });

//     query += fields.join(', ') + ' WHERE id = ?';
//     params.push(id);

//     await pool.query(query, params);
//     res.json({ message: 'User updated successfully' });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// // Attendance Routes
// app.get('/api/attendance', async (req, res) => {
//   const { userId } = req.query;
//   try {
//     let query = 'SELECT * FROM attendance';
//     let params = [];
//     if (userId) {
//       query += ' WHERE user_id = ?';
//       params.push(userId);
//     }
//     const [rows] = await pool.query(query, params);
//     res.json(rows);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// app.post('/api/attendance/check-in', async (req, res) => {
//   const { userId } = req.body;
//   const now = new Date();
//   const date = now.toISOString().split('T')[0];
  
//   try {
//     // SECURITY: Check if user already has a record for today
//     const [existing] = await pool.query('SELECT * FROM attendance WHERE user_id = ? AND date = ?', [userId, date]);
//     if (existing.length > 0) {
//       return res.json(existing[0]); // Return existing instead of duplicate
//     }

//     const id = 'att-' + Math.random().toString(36).substring(2, 9);
//     const status = now.getHours() >= 9 ? 'LATE' : 'PRESENT';

//     await pool.query(
//       'INSERT INTO attendance (id, user_id, date, check_in, status) VALUES (?, ?, ?, ?, ?)',
//       [id, userId, date, now, status]
//     );
//     const [rows] = await pool.query('SELECT * FROM attendance WHERE id = ?', [id]);
//     res.json(rows[0]);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// app.put('/api/attendance/check-out/:id', async (req, res) => {
//   const { id } = req.params;
//   const now = new Date();
//   try {
//     await pool.query('UPDATE attendance SET check_out = ? WHERE id = ?', [now, id]);
//     const [rows] = await pool.query('SELECT * FROM attendance WHERE id = ?', [id]);
//     res.json(rows[0]);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// // Leave Routes
// app.get('/api/leaves', async (req, res) => {
//   const { userId } = req.query;
//   try {
//     let query = 'SELECT * FROM leaves';
//     let params = [];
//     if (userId) {
//       query += ' WHERE user_id = ?';
//       params.push(userId);
//     }
//     const [rows] = await pool.query(query, params);
//     res.json(rows);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// app.post('/api/leaves', async (req, res) => {
//   const leave = req.body;
//   const id = 'lv-' + Math.random().toString(36).substring(2, 9);
//   try {
//     await pool.query(
//       'INSERT INTO leaves (id, user_id, user_name, start_date, end_date, type, status, reason) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
//       [id, leave.userId, leave.userName, leave.startDate, leave.endDate, leave.type, 'PENDING', leave.reason]
//     );
//     const [rows] = await pool.query('SELECT * FROM leaves WHERE id = ?', [id]);
//     res.json(rows[0]);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// app.put('/api/leaves/:id/status', async (req, res) => {
//   const { id } = req.params;
//   const { status } = req.body;
//   try {
//     await pool.query('UPDATE leaves SET status = ? WHERE id = ?', [status, id]);
//     const [rows] = await pool.query('SELECT * FROM leaves WHERE id = ?', [id]);
//     res.json(rows[0]);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// // Stats Route - UPDATED TO USE DISTINCT
// app.get('/api/stats', async (req, res) => {
//   const today = new Date().toISOString().split('T')[0];
//   try {
//     const [[{totalEmployees}]] = await pool.query('SELECT COUNT(*) as totalEmployees FROM users');
//     // Using COUNT(DISTINCT user_id) to avoid duplicates if multiple records exist
//     const [[{presentToday}]] = await pool.query('SELECT COUNT(DISTINCT user_id) as presentToday FROM attendance WHERE date = ?', [today]);
//     const [[{lateToday}]] = await pool.query('SELECT COUNT(DISTINCT user_id) as lateToday FROM attendance WHERE date = ? AND status = "LATE"', [today]);
//     const [[{pendingLeaves}]] = await pool.query('SELECT COUNT(*) as pendingLeaves FROM leaves WHERE status = "PENDING"');
    
//     res.json({ totalEmployees, presentToday, lateToday, pendingLeaves });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// // Diagnostic/Debug Route
// app.get('/api/debug/db', async (req, res) => {
//   try {
//     const [users] = await pool.query('SELECT id, name, email, role, department FROM users');
//     res.json({ status: 'Connected', database: 'smarttrack_db', users: users.length });
//   } catch (err) {
//     res.status(500).json({ error: 'DB Diagnostic Error' });
//   }
// });

// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`🚀 Server on http://localhost:${PORT}`));







// const express = require('express');
// const mysql = require('mysql2/promise');
// const cors = require('cors');
// require('dotenv').config();

// const app = express();
// app.use(cors());
// app.use(express.json());

// const dbConfig = {
//   host: process.env.DB_HOST || 'localhost',
//   user: process.env.DB_USER || 'root',
//   password: process.env.DB_PASSWORD || '',
//   database: 'smarttrack_db',
//   waitForConnections: true,
//   connectionLimit: 10,
//   queueLimit: 0
// };

// const pool = mysql.createPool(dbConfig);

// // Auth Routes
// app.post('/api/auth/login', async (req, res) => {
//   const { email, password } = req.body;
//   const cleanEmail = email.trim().toLowerCase();
  
//   try {
//     const [rows] = await pool.query('SELECT * FROM users WHERE LOWER(email) = ? AND password = ?', [cleanEmail, password]);
//     const user = rows[0];
    
//     if (user) {
//       const { password: userPass, ...userWithoutPass } = user;
//       res.json({ user: userWithoutPass, token: 'mock-jwt-token' });
//     } else {
//       res.status(401).json({ message: 'Invalid credentials. Please try again.' });
//     }
//   } catch (err) {
//     res.status(500).json({ error: 'Database connection error' });
//   }
// });

// app.post('/api/auth/register', async (req, res) => {
//   const { name, email, password, department } = req.body;
//   const cleanEmail = email.trim().toLowerCase();
//   const id = 'emp-' + Math.random().toString(36).substring(2, 9);
//   const avatar = `https://i.pravatar.cc/150?u=${id}`;
//   const joinedDate = new Date().toISOString().split('T')[0];

//   try {
//     const [existing] = await pool.query('SELECT id FROM users WHERE LOWER(email) = ?', [cleanEmail]);
//     if (existing.length > 0) {
//       return res.status(400).json({ message: 'An account with this email already exists.' });
//     }

//     await pool.query(
//       'INSERT INTO users (id, name, email, password, role, avatar, department, joined_date) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
//       [id, name, cleanEmail, password, 'EMPLOYEE', avatar, department || 'Engineering', joinedDate]
//     );

//     const [rows] = await pool.query('SELECT id, name, email, role, avatar, department, joined_date as joinedDate FROM users WHERE id = ?', [id]);
//     res.json({ user: rows[0], token: 'mock-jwt-token' });
//   } catch (err) {
//     res.status(500).json({ error: 'Registration failed', details: err.message });
//   }
// });

// // Users Routes
// app.get('/api/users', async (req, res) => {
//   try {
//     const [rows] = await pool.query('SELECT id, name, email, role, avatar, department, joined_date as joinedDate FROM users');
//     res.json(rows);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// app.post('/api/users', async (req, res) => {
//   const user = req.body;
//   const id = 'emp-' + Math.random().toString(36).substring(2, 9);
//   try {
//     await pool.query(
//       'INSERT INTO users (id, name, email, password, role, avatar, department, joined_date) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
//       [id, user.name, user.email, 'admin123', user.role, user.avatar || 'https://i.pravatar.cc/150', user.department, user.joinedDate]
//     );
//     res.json({ ...user, id });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// app.put('/api/users/:id', async (req, res) => {
//   const { id } = req.params;
//   const { name, role, department, password, avatar } = req.body;
//   try {
//     let query = 'UPDATE users SET ';
//     const params = [];
//     const fields = [];

//     if (name) { fields.push('name = ?'); params.push(name); }
//     if (role) { fields.push('role = ?'); params.push(role); }
//     if (department) { fields.push('department = ?'); params.push(department); }
//     if (password) { fields.push('password = ?'); params.push(password); }
//     if (avatar) { fields.push('avatar = ?'); params.push(avatar); }

//     if (fields.length === 0) return res.status(400).json({ error: 'No fields to update' });

//     query += fields.join(', ') + ' WHERE id = ?';
//     params.push(id);

//     await pool.query(query, params);
//     res.json({ message: 'User updated successfully' });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// // Attendance Routes
// app.get('/api/attendance', async (req, res) => {
//   const { userId } = req.query;
//   try {
//     let query = 'SELECT * FROM attendance';
//     let params = [];
//     if (userId) {
//       query += ' WHERE user_id = ?';
//       params.push(userId);
//     }
//     const [rows] = await pool.query(query, params);
//     res.json(rows);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// app.post('/api/attendance/check-in', async (req, res) => {
//   const { userId } = req.body;
//   const now = new Date();
//   const date = now.toISOString().split('T')[0];
  
//   try {
//     const [existing] = await pool.query('SELECT * FROM attendance WHERE user_id = ? AND date = ?', [userId, date]);
//     if (existing.length > 0) {
//       return res.json(existing[0]);
//     }

//     const id = 'att-' + Math.random().toString(36).substring(2, 9);
//     const status = now.getHours() >= 9 ? 'LATE' : 'PRESENT';

//     await pool.query(
//       'INSERT INTO attendance (id, user_id, date, check_in, status) VALUES (?, ?, ?, ?, ?)',
//       [id, userId, date, now, status]
//     );
//     const [rows] = await pool.query('SELECT * FROM attendance WHERE id = ?', [id]);
//     res.json(rows[0]);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// app.put('/api/attendance/check-out/:id', async (req, res) => {
//   const { id } = req.params;
//   const now = new Date();
//   try {
//     await pool.query('UPDATE attendance SET check_out = ? WHERE id = ?', [now, id]);
//     const [rows] = await pool.query('SELECT * FROM attendance WHERE id = ?', [id]);
//     res.json(rows[0]);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// // Leave Routes
// app.get('/api/leaves', async (req, res) => {
//   const { userId } = req.query;
//   try {
//     let query = 'SELECT * FROM leaves';
//     let params = [];
//     if (userId) {
//       query += ' WHERE user_id = ?';
//       params.push(userId);
//     }
//     const [rows] = await pool.query(query, params);
//     res.json(rows);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// app.post('/api/leaves', async (req, res) => {
//   const leave = req.body;
//   const id = 'lv-' + Math.random().toString(36).substring(2, 9);
//   try {
//     await pool.query(
//       'INSERT INTO leaves (id, user_id, user_name, start_date, end_date, type, status, reason) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
//       [id, leave.userId, leave.userName, leave.startDate, leave.endDate, leave.type, 'PENDING', leave.reason]
//     );
//     const [rows] = await pool.query('SELECT * FROM leaves WHERE id = ?', [id]);
//     res.json(rows[0]);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// app.put('/api/leaves/:id/status', async (req, res) => {
//   const { id } = req.params;
//   const { status } = req.body;
//   try {
//     await pool.query('UPDATE leaves SET status = ? WHERE id = ?', [status, id]);
//     const [rows] = await pool.query('SELECT * FROM leaves WHERE id = ?', [id]);
//     res.json(rows[0]);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// // Stats Route
// app.get('/api/stats', async (req, res) => {
//   const today = new Date().toISOString().split('T')[0];
//   try {
//     const [[{totalEmployees}]] = await pool.query('SELECT COUNT(*) as totalEmployees FROM users');
//     // Count unique departments as Teams
//     const [[{totalDepartments}]] = await pool.query('SELECT COUNT(DISTINCT department) as totalDepartments FROM users');
//     const [[{presentToday}]] = await pool.query('SELECT COUNT(DISTINCT user_id) as presentToday FROM attendance WHERE date = ?', [today]);
//     const [[{lateToday}]] = await pool.query('SELECT COUNT(DISTINCT user_id) as lateToday FROM attendance WHERE date = ? AND status = "LATE"', [today]);
//     const [[{pendingLeaves}]] = await pool.query('SELECT COUNT(*) as pendingLeaves FROM leaves WHERE status = "PENDING"');
    
//     res.json({ totalEmployees, totalDepartments, presentToday, lateToday, pendingLeaves });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// // Diagnostic/Debug Route
// app.get('/api/debug/db', async (req, res) => {
//   try {
//     const [users] = await pool.query('SELECT id, name, email, role, department FROM users');
//     res.json({ status: 'Connected', database: 'smarttrack_db', users: users.length });
//   } catch (err) {
//     res.status(500).json({ error: 'DB Diagnostic Error' });
//   }
// });

// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`🚀 Server on http://localhost:${PORT}`));



const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: 'smarttrack_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

const pool = mysql.createPool(dbConfig);

// Helper to get local date as YYYY-MM-DD string
const getLocalDateString = () => {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// Auth Routes
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  const cleanEmail = email.trim().toLowerCase();
  
  try {
    const [rows] = await pool.query('SELECT * FROM users WHERE LOWER(email) = ? AND password = ?', [cleanEmail, password]);
    const user = rows[0];
    
    if (user) {
      const { password: userPass, ...userWithoutPass } = user;
      res.json({ user: userWithoutPass, token: 'mock-jwt-token' });
    } else {
      res.status(401).json({ message: 'Invalid credentials. Please try again.' });
    }
  } catch (err) {
    res.status(500).json({ error: 'Database connection error' });
  }
});

app.post('/api/auth/register', async (req, res) => {
  const { name, email, password, department } = req.body;
  const cleanEmail = email.trim().toLowerCase();
  const id = 'emp-' + Math.random().toString(36).substring(2, 9);
  const avatar = `https://i.pravatar.cc/150?u=${id}`;
  const joinedDate = getLocalDateString();

  try {
    const [existing] = await pool.query('SELECT id FROM users WHERE LOWER(email) = ?', [cleanEmail]);
    if (existing.length > 0) {
      return res.status(400).json({ message: 'An account with this email already exists.' });
    }

    await pool.query(
      'INSERT INTO users (id, name, email, password, role, avatar, department, joined_date) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [id, name, cleanEmail, password, 'EMPLOYEE', avatar, department || 'Engineering', joinedDate]
    );

    const [rows] = await pool.query('SELECT id, name, email, role, avatar, department, joined_date as joinedDate FROM users WHERE id = ?', [id]);
    res.json({ user: rows[0], token: 'mock-jwt-token' });
  } catch (err) {
    res.status(500).json({ error: 'Registration failed', details: err.message });
  }
});

// Users Routes
app.get('/api/users', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT id, name, email, role, avatar, department, joined_date as joinedDate FROM users');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/users', async (req, res) => {
  const user = req.body;
  const id = 'emp-' + Math.random().toString(36).substring(2, 9);
  try {
    await pool.query(
      'INSERT INTO users (id, name, email, password, role, avatar, department, joined_date) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [id, user.name, user.email, 'admin123', user.role, user.avatar || 'https://i.pravatar.cc/150', user.department, user.joinedDate]
    );
    res.json({ ...user, id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/users/:id', async (req, res) => {
  const { id } = req.params;
  const { name, role, department, password, avatar } = req.body;
  try {
    let query = 'UPDATE users SET ';
    const params = [];
    const fields = [];

    if (name) { fields.push('name = ?'); params.push(name); }
    if (role) { fields.push('role = ?'); params.push(role); }
    if (department) { fields.push('department = ?'); params.push(department); }
    if (password) { fields.push('password = ?'); params.push(password); }
    if (avatar) { fields.push('avatar = ?'); params.push(avatar); }

    if (fields.length === 0) return res.status(400).json({ error: 'No fields to update' });

    query += fields.join(', ') + ' WHERE id = ?';
    params.push(id);

    await pool.query(query, params);
    res.json({ message: 'User updated successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Attendance Routes
app.get('/api/attendance', async (req, res) => {
  const { userId } = req.query;
  try {
    let query = `
      SELECT 
        id, 
        user_id as userId, 
        DATE_FORMAT(date, '%Y-%m-%d') as date, 
        DATE_FORMAT(check_in, '%Y-%m-%dT%H:%i:%s') as checkIn, 
        DATE_FORMAT(check_out, '%Y-%m-%dT%H:%i:%s') as checkOut, 
        status 
      FROM attendance
    `;
    let params = [];
    if (userId) {
      query += ' WHERE user_id = ?';
      params.push(userId);
    }
    const [rows] = await pool.query(query, params);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/attendance/check-in', async (req, res) => {
  const { userId } = req.body;
  const now = new Date();
  const dateStr = getLocalDateString();
  
  try {
    const [active] = await pool.query(`
      SELECT 
        id, user_id as userId, 
        DATE_FORMAT(date, '%Y-%m-%d') as date, 
        DATE_FORMAT(check_in, '%Y-%m-%dT%H:%i:%s') as checkIn, 
        DATE_FORMAT(check_out, '%Y-%m-%dT%H:%i:%s') as checkOut, 
        status 
      FROM attendance WHERE user_id = ? AND check_out IS NULL`, [userId]);
    
    if (active.length > 0) {
      return res.json(active[0]);
    }

    const id = 'att-' + Math.random().toString(36).substring(2, 9);
    const status = now.getHours() >= 9 ? 'LATE' : 'PRESENT';

    await pool.query(
      'INSERT INTO attendance (id, user_id, date, check_in, status) VALUES (?, ?, ?, ?, ?)',
      [id, userId, dateStr, now, status]
    );
    
    const [rows] = await pool.query(`
      SELECT 
        id, user_id as userId, DATE_FORMAT(date, '%Y-%m-%d') as date, 
        DATE_FORMAT(check_in, '%Y-%m-%dT%H:%i:%s') as checkIn, 
        DATE_FORMAT(check_out, '%Y-%m-%dT%H:%i:%s') as checkOut, 
        status 
      FROM attendance WHERE id = ?`, [id]);
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/attendance/check-out/:id', async (req, res) => {
  const { id } = req.params;
  const now = new Date();
  try {
    await pool.query('UPDATE attendance SET check_out = ? WHERE id = ?', [now, id]);
    const [rows] = await pool.query(`
      SELECT 
        id, user_id as userId, DATE_FORMAT(date, '%Y-%m-%d') as date, 
        DATE_FORMAT(check_in, '%Y-%m-%dT%H:%i:%s') as checkIn, 
        DATE_FORMAT(check_out, '%Y-%m-%dT%H:%i:%s') as checkOut, 
        status 
      FROM attendance WHERE id = ?`, [id]);
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Leave Routes
app.get('/api/leaves', async (req, res) => {
  const { userId } = req.query;
  try {
    let query = 'SELECT * FROM leaves';
    let params = [];
    if (userId) {
      query += ' WHERE user_id = ?';
      params.push(userId);
    }
    const [rows] = await pool.query(query, params);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/leaves', async (req, res) => {
  const leave = req.body;
  const id = 'lv-' + Math.random().toString(36).substring(2, 9);
  try {
    await pool.query(
      'INSERT INTO leaves (id, user_id, user_name, start_date, end_date, type, status, reason) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [id, leave.userId, leave.userName, leave.startDate, leave.endDate, leave.type, 'PENDING', leave.reason]
    );
    const [rows] = await pool.query('SELECT * FROM leaves WHERE id = ?', [id]);
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/leaves/:id/status', async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  try {
    await pool.query('UPDATE leaves SET status = ? WHERE id = ?', [status, id]);
    const [rows] = await pool.query('SELECT * FROM leaves WHERE id = ?', [id]);
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Stats Route
app.get('/api/stats', async (req, res) => {
  const today = getLocalDateString();
  try {
    const [[{totalEmployees}]] = await pool.query('SELECT COUNT(*) as totalEmployees FROM users');
    
    const [rows] = await pool.query('SELECT DISTINCT department FROM users WHERE department IS NOT NULL AND department != ""');
    const departmentNames = rows.map(r => r.department);
    const totalDepartments = departmentNames.length;

    const [[{presentToday}]] = await pool.query('SELECT COUNT(DISTINCT user_id) as presentToday FROM attendance WHERE date = ?', [today]);
    const [[{lateToday}]] = await pool.query('SELECT COUNT(DISTINCT user_id) as lateToday FROM attendance WHERE date = ? AND status = "LATE"', [today]);
    const [[{pendingLeaves}]] = await pool.query('SELECT COUNT(*) as pendingLeaves FROM leaves WHERE status = "PENDING"');
    
    res.json({ 
      totalEmployees, 
      totalDepartments, 
      departmentNames,
      presentToday, 
      lateToday, 
      pendingLeaves 
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server on http://localhost:${PORT}`));
