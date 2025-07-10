export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: 'user' | 'admin';
  accountType: 'individual' | 'company';
  company?: {
    name: string;
    cnpj: string;
    size: 'startup' | 'small' | 'medium' | 'large';
    industry: string;
  };
  createdAt: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
  accountType: 'individual' | 'company';
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  accountType: 'individual' | 'company';
  company?: {
    name: string;
    cnpj: string;
    size: 'startup' | 'small' | 'medium' | 'large';
    industry: string;
  };
}