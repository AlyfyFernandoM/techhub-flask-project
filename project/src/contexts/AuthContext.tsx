import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, AuthState, LoginCredentials, RegisterData } from '../types/auth';

interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<boolean>;
  register: (data: RegisterData) => Promise<boolean>;
  logout: () => void;
  updateProfile: (data: Partial<User>) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
  });

  const login = async (credentials: LoginCredentials): Promise<boolean> => {
    setAuthState(prev => ({ ...prev, isLoading: true }));
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Demo users
    const demoUsers = {
      'admin@techhub.com': {
        id: '1',
        name: 'Admin TechHUB',
        email: 'admin@techhub.com',
        avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150',
        role: 'admin' as const,
        accountType: 'individual' as const,
        createdAt: new Date().toISOString(),
      },
      'empresa@techhub.com': {
        id: '2',
        name: 'João Silva',
        email: 'empresa@techhub.com',
        avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150',
        role: 'user' as const,
        accountType: 'company' as const,
        company: {
          name: 'TechCorp Solutions',
          cnpj: '12.345.678/0001-90',
          size: 'medium' as const,
          industry: 'Tecnologia',
        },
        createdAt: new Date().toISOString(),
      },
    };
    
    const user = demoUsers[credentials.email as keyof typeof demoUsers];
    
    if (user && credentials.password === 'admin123' && user.accountType === credentials.accountType) {
      setAuthState({
        user,
        isAuthenticated: true,
        isLoading: false,
      });
      
      localStorage.setItem('techhub_user', JSON.stringify(user));
      return true;
    }
    
    setAuthState(prev => ({ ...prev, isLoading: false }));
    return false;
  };

  const register = async (data: RegisterData): Promise<boolean> => {
    setAuthState(prev => ({ ...prev, isLoading: true }));
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (data.password !== data.confirmPassword) {
      setAuthState(prev => ({ ...prev, isLoading: false }));
      return false;
    }
    
    const user: User = {
      id: Date.now().toString(),
      name: data.name,
      email: data.email,
      role: 'user',
      accountType: data.accountType,
      company: data.company,
      createdAt: new Date().toISOString(),
    };
    
    setAuthState({
      user,
      isAuthenticated: true,
      isLoading: false,
    });
    
    localStorage.setItem('techhub_user', JSON.stringify(user));
    return true;
  };

  const logout = () => {
    setAuthState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
    });
    localStorage.removeItem('techhub_user');
  };

  const updateProfile = async (data: Partial<User>): Promise<boolean> => {
    if (!authState.user) return false;
    
    setAuthState(prev => ({ ...prev, isLoading: true }));
    
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const updatedUser = { ...authState.user, ...data };
    setAuthState({
      user: updatedUser,
      isAuthenticated: true,
      isLoading: false,
    });
    
    localStorage.setItem('techhub_user', JSON.stringify(updatedUser));
    return true;
  };

  useEffect(() => {
    const savedUser = localStorage.getItem('techhub_user');
    if (savedUser) {
      try {
        const user = JSON.parse(savedUser);
        setAuthState({
          user,
          isAuthenticated: true,
          isLoading: false,
        });
      } catch (error) {
        localStorage.removeItem('techhub_user');
        setAuthState(prev => ({ ...prev, isLoading: false }));
      }
    } else {
      setAuthState(prev => ({ ...prev, isLoading: false }));
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        ...authState,
        login,
        register,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};