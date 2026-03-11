import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface AuthContextType {
  isAuthenticated: boolean;
  token: string | null;
  storeId: number | null;
  login: (token: string, storeId: number) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  token: null,
  storeId: null,
  login: () => {},
  logout: () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(localStorage.getItem('admin_token'));
  const [storeId, setStoreId] = useState<number | null>(() => {
    const v = localStorage.getItem('admin_store_id');
    return v ? Number(v) : null;
  });

  const isAuthenticated = !!token;

  const login = (newToken: string, newStoreId: number) => {
    localStorage.setItem('admin_token', newToken);
    localStorage.setItem('admin_store_id', String(newStoreId));
    setToken(newToken);
    setStoreId(newStoreId);
  };

  const logout = () => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_store_id');
    setToken(null);
    setStoreId(null);
  };

  useEffect(() => {
    const handleStorage = () => {
      setToken(localStorage.getItem('admin_token'));
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, token, storeId, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
