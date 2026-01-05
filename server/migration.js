
const mysql = require('mysql2/promise');
require('dotenv').config();

const schema = `
CREATE DATABASE IF NOT EXISTS smarttrack_db;
USE smarttrack_db;

CREATE TABLE IF NOT EXISTS users (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role ENUM('ADMIN', 'EMPLOYEE') DEFAULT 'EMPLOYEE',
  avatar LONGTEXT,
  department VARCHAR(100),
  joined_date DATE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE users MODIFY COLUMN avatar LONGTEXT;

CREATE TABLE IF NOT EXISTS attendance (
  id VARCHAR(50) PRIMARY KEY,
  user_id VARCHAR(50),
  date DATE NOT NULL,
  check_in DATETIME NOT NULL,
  check_out DATETIME,
  status ENUM('PRESENT', 'LATE', 'ABSENT', 'ON_LEAVE') DEFAULT 'PRESENT',
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_date (date),
  INDEX idx_user_date (user_id, date)
);

CREATE TABLE IF NOT EXISTS leaves (
  id VARCHAR(50) PRIMARY KEY,
  user_id VARCHAR(50),
  user_name VARCHAR(100),
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  type ENUM('SICK', 'CASUAL', 'VACATION') DEFAULT 'CASUAL',
  status ENUM('PENDING', 'APPROVED', 'REJECTED') DEFAULT 'PENDING',
  reason TEXT,
  applied_date DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Seed Admin
REPLACE INTO users (id, name, email, password, role, avatar, department, joined_date)
VALUES ('admin-1', 'System Admin', 'admin@gmail.com', 'admin123', 'ADMIN', 'https://i.pravatar.cc/150?u=admin', 'Management', '2023-01-01');

-- Seed Sample Employee
REPLACE INTO users (id, name, email, password, role, avatar, department, joined_date)
VALUES ('emp-1', 'John Employee', 'employee@smarttrack.com', 'admin123', 'EMPLOYEE', 'https://i.pravatar.cc/150?u=john', 'Engineering', '2023-06-15');
`;

async function runMigration() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    multipleStatements: true
  });

  try {
    console.log('🚀 Running database migrations...');
    await connection.query(schema);
    console.log('✅ Migration successful: smarttrack_db is ready.');
    console.log('👤 Admin Seeded: admin@gmail.com / admin123');
    console.log('👤 Employee Seeded: employee@smarttrack.com / admin123');
  } catch (err) {
    console.error('❌ Migration failed:', err.message);
  } finally {
    await connection.end();
  }
}

runMigration();
