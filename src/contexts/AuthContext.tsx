import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  email: string;
  name: string;
  createdAt: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const USE_BACKEND = false; // Set to true to use backend API

// Placeholder async API functions for backend integration
async function apiLogin(email: string, password: string) {
  // TODO: Replace with real API call
  // Example: return fetch('/api/login', { method: 'POST', body: JSON.stringify({ email, password }) })
  return null;
}
async function apiRegister(name: string, email: string, password: string) {
  // TODO: Replace with real API call
  // Example: return fetch('/api/register', { method: 'POST', body: JSON.stringify({ name, email, password }) })
  return null;
}
async function apiLogout() {
  // TODO: Replace with real API call
  return;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing session on app load
    const savedUser = localStorage.getItem('finai_user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        localStorage.removeItem('finai_user');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    if (USE_BACKEND) {
      // Backend API logic
      const userSession = await apiLogin(email, password);
      setIsLoading(false);
      if (userSession) {
        setUser(userSession);
        localStorage.setItem('finai_user', JSON.stringify(userSession));
        return true;
      }
      return false;
    }
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Get stored users
    const storedUsers = JSON.parse(localStorage.getItem('finai_users') || '[]');
    
    // Find user with matching credentials
    const foundUser = storedUsers.find((u: any) => 
      u.email === email && u.password === password
    );
    
    if (foundUser) {
      const userSession = {
        id: foundUser.id,
        email: foundUser.email,
        name: foundUser.name,
        createdAt: foundUser.createdAt
      };
      
      setUser(userSession);
      localStorage.setItem('finai_user', JSON.stringify(userSession));
      setIsLoading(false);
      return true;
    }
    
    setIsLoading(false);
    return false;
  };

  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    if (USE_BACKEND) {
      // Backend API logic
      const userSession = await apiRegister(name, email, password);
      setIsLoading(false);
      if (userSession) {
        setUser(userSession);
        localStorage.setItem('finai_user', JSON.stringify(userSession));
        return true;
      }
      return false;
    }
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Get existing users
    const storedUsers = JSON.parse(localStorage.getItem('finai_users') || '[]');
    
    // Check if user already exists
    if (storedUsers.some((u: any) => u.email === email)) {
      setIsLoading(false);
      return false;
    }
    
    // Create new user
    const newUser = {
      id: Date.now().toString(),
      name,
      email,
      password, // In production, this would be hashed
      createdAt: new Date().toISOString()
    };
    
    // Save to storage
    storedUsers.push(newUser);
    localStorage.setItem('finai_users', JSON.stringify(storedUsers));
    
    // Create user session
    const userSession = {
      id: newUser.id,
      email: newUser.email,
      name: newUser.name,
      createdAt: newUser.createdAt
    };
    
    setUser(userSession);
    localStorage.setItem('finai_user', JSON.stringify(userSession));
    setIsLoading(false);
    return true;
  };

  const logout = () => {
    if (USE_BACKEND) {
      apiLogout();
    }
    setUser(null);
    localStorage.removeItem('finai_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}