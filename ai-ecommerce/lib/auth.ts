import { compare, hash } from 'bcryptjs';
import { createUser, emailExists, getUserByEmail, type User } from './db';

const SALT_ROUNDS = 10;

export interface AuthResult {
  success: boolean;
  user?: User;
  error?: string;
}

/**
 * Register a new user
 */
export async function registerUser(
  email: string,
  password: string,
  name: string
): Promise<AuthResult> {
  // Validate input
  if (!email || !password || !name) {
    return { success: false, error: 'All fields are required' };
  }

  if (!email.includes('@')) {
    return { success: false, error: 'Invalid email format' };
  }

  if (password.length < 6) {
    return { success: false, error: 'Password must be at least 6 characters' };
  }

  // Check if email already exists
  if (emailExists(email)) {
    return { success: false, error: 'Email already registered' };
  }

  // Hash password
  const passwordHash = await hash(password, SALT_ROUNDS);

  // Create user
  const userId = `user-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
  
  try {
    const user = createUser({
      id: userId,
      email: email.toLowerCase(),
      password_hash: passwordHash,
      name,
    });

    return { success: true, user };
  } catch (error) {
    console.error('Error creating user:', error);
    return { success: false, error: 'Failed to create user' };
  }
}

/**
 * Login user
 */
export async function loginUser(
  email: string,
  password: string
): Promise<AuthResult> {
  // Validate input
  if (!email || !password) {
    return { success: false, error: 'Email and password are required' };
  }

  // Get user
  const userWithPassword = getUserByEmail(email.toLowerCase());
  if (!userWithPassword) {
    return { success: false, error: 'Invalid email or password' };
  }

  // Verify password
  const isValid = await compare(password, userWithPassword.password_hash);
  if (!isValid) {
    return { success: false, error: 'Invalid email or password' };
  }

  // Remove password from result
  const { password_hash, ...user } = userWithPassword;

  return { success: true, user };
}
