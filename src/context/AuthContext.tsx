"use client";

import { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { User } from '@/types/auth';

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (token: string) => string[];
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
}

type AuthState = {
  token: string | null;
  user: User | null;
  isLoading: boolean;
};

type AuthAction =
  | { type: 'INIT'; token: string; user: User }
  | { type: 'LOADED' }
  | { type: 'LOGIN'; token: string; user: User }
  | { type: 'LOGOUT' };

function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case 'INIT':
      return { token: action.token, user: action.user, isLoading: false };
    case 'LOADED':
      return { ...state, isLoading: false };
    case 'LOGIN':
      return { token: action.token, user: action.user, isLoading: false };
    case 'LOGOUT':
      return { token: null, user: null, isLoading: false };
  }
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

type JwtPayload = {
  id?: string;
  roles?: string[];
};

function isJwtPayload(value: unknown): value is JwtPayload {
  if (typeof value !== 'object' || value === null) return false;
  const payload = value as Record<string, unknown>;
  return (
    (payload.id === undefined || typeof payload.id === 'string') &&
    (payload.roles === undefined || Array.isArray(payload.roles))
  );
}

function decodeJwtPayload(token: string): JwtPayload | null {
  try {
    const base64Url = token.split('.')[1];
    if (!base64Url) return null;
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const padded = base64.padEnd(base64.length + (4 - (base64.length % 4)) % 4, '=');
    const jsonPayload = decodeURIComponent(
      atob(padded)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    const parsed: unknown = JSON.parse(jsonPayload);
    return isJwtPayload(parsed) ? parsed : null;
  } catch (e) {
    console.error('Failed to decode JWT payload', e);
    return null;
  }
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(authReducer, { token: null, user: null, isLoading: true });

  useEffect(() => {
    const storedToken = localStorage.getItem('auth_token');
    if (storedToken) {
      const payload = decodeJwtPayload(storedToken);
      if (payload?.id) {
        dispatch({ type: 'INIT', token: storedToken, user: { id: payload.id, roles: payload.roles || [] } });
        return;
      }
      localStorage.removeItem('auth_token');
    }
    dispatch({ type: 'LOADED' });
  }, []);

  const login = (newToken: string): string[] => {
    const payload = decodeJwtPayload(newToken);
    if (payload?.id) {
      localStorage.setItem('auth_token', newToken);
      dispatch({ type: 'LOGIN', token: newToken, user: { id: payload.id, roles: payload.roles || [] } });
      return payload.roles || [];
    }
    return [];
  };

  const logout = () => {
    localStorage.removeItem('auth_token');
    dispatch({ type: 'LOGOUT' });
  };

  return (
    <AuthContext.Provider value={{
      user: state.user,
      token: state.token,
      login,
      logout,
      isAuthenticated: !!state.token,
      isLoading: state.isLoading,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
