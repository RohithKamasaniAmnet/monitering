import { LoginCredentials, AuthResponse } from '../types/auth';
import { MOCK_USERS } from '../utils/mockAuth';

// Simulated API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export async function login(credentials: LoginCredentials): Promise<AuthResponse> {
  // Simulate API call delay
  await delay(500);

  const user = MOCK_USERS.find(
    u => u.username === credentials.username && u.password === credentials.password
  );

  if (!user) {
    throw new Error('Invalid credentials');
  }

  // In a real app, the token would come from the backend
  const token = btoa(`${user.username}:${Date.now()}`);

  return {
    user: {
      id: user.id,
      username: user.username,
      role: user.role,
    },
    token,
  };
}