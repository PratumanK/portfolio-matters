import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { User, LoginPayload, RegisterPayload } from '../types';
import { authApi } from '../api/auth.api';
import { TOKEN_STORAGE_KEY, USER_STORAGE_KEY } from '../api/client';

/**
 * SECURITY NOTE:
 * Storing JWT tokens in localStorage is acceptable for local development and internship portfolios.
 * However, in production banking/financial applications, tokens stored in localStorage are vulnerable
 * to Cross-Site Scripting (XSS). An httpOnly, secure, SameSite cookie architecture with CSRF protection
 * is recommended for production enterprise financial products.
 */

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (payload: LoginPayload) => Promise<void>;
  register: (payload: RegisterPayload) => Promise<string>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Initialize auth state from localStorage on startup
  useEffect(() => {
    try {
      const storedToken = localStorage.getItem(TOKEN_STORAGE_KEY);
      const storedUser = localStorage.getItem(USER_STORAGE_KEY);

      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      }
    } catch (e) {
      console.error('Failed to parse cached auth state:', e);
      localStorage.removeItem(TOKEN_STORAGE_KEY);
      localStorage.removeItem(USER_STORAGE_KEY);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    localStorage.removeItem(USER_STORAGE_KEY);
    setToken(null);
    setUser(null);
  }, []);

  // Handle unauthorized events dispatched by API client
  useEffect(() => {
    const handleUnauthorized = () => {
      logout();
    };

    window.addEventListener('auth:unauthorized', handleUnauthorized);
    return () => {
      window.removeEventListener('auth:unauthorized', handleUnauthorized);
    };
  }, [logout]);

  const login = async (payload: LoginPayload): Promise<void> => {
    const response = await authApi.login(payload);
    if (response.token && response.user) {
      localStorage.setItem(TOKEN_STORAGE_KEY, response.token);
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(response.user));
      setToken(response.token);
      setUser(response.user);
    } else {
      throw new Error(response.message || 'Login failed - no token received');
    }
  };

  const register = async (payload: RegisterPayload): Promise<string> => {
    const response = await authApi.register(payload);
    return response.message || 'Registration successful. Please log in.';
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token && !!user,
        isLoading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
