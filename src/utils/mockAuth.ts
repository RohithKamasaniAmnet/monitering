// Mock user data for development
export const MOCK_USERS = [
  {
    id: '1',
    username: 'admin',
    password: 'admin123', // In production, passwords should be hashed
    role: 'admin',
  },
  {
    id: '2',
    username: 'user',
    password: 'user123',
    role: 'user',
  },
] as const;