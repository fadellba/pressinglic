import { UserRole } from './enums';

export interface User {
  id: number;
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
  created_at?: string;
  updated_at?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
  message?: string;
}
