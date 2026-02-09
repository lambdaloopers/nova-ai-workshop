import Database from 'better-sqlite3';
import { join } from 'node:path';

const dbPath = join(process.cwd(), 'auth.db');
const db = new Database(dbPath);

// Initialize database schema
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    name TEXT NOT NULL,
    created_at INTEGER NOT NULL,
    updated_at INTEGER NOT NULL
  );

  CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
`);

export interface User {
  id: string;
  email: string;
  name: string;
  created_at: number;
  updated_at: number;
}

export interface UserWithPassword extends User {
  password_hash: string;
}

/**
 * Get user by email
 */
export function getUserByEmail(email: string): UserWithPassword | null {
  const stmt = db.prepare('SELECT * FROM users WHERE email = ?');
  return stmt.get(email) as UserWithPassword | null;
}

/**
 * Get user by ID
 */
export function getUserById(id: string): User | null {
  const stmt = db.prepare('SELECT id, email, name, created_at, updated_at FROM users WHERE id = ?');
  return stmt.get(id) as User | null;
}

/**
 * Create a new user
 */
export function createUser(data: {
  id: string;
  email: string;
  password_hash: string;
  name: string;
}): User {
  const now = Date.now();
  const stmt = db.prepare(`
    INSERT INTO users (id, email, password_hash, name, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?)
  `);
  
  stmt.run(data.id, data.email, data.password_hash, data.name, now, now);

  return {
    id: data.id,
    email: data.email,
    name: data.name,
    created_at: now,
    updated_at: now,
  };
}

/**
 * Check if email exists
 */
export function emailExists(email: string): boolean {
  const stmt = db.prepare('SELECT COUNT(*) as count FROM users WHERE email = ?');
  const result = stmt.get(email) as { count: number };
  return result.count > 0;
}

export { db };
