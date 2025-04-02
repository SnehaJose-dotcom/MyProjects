'use client';

import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';

interface AuthContextType {
  isAuthenticated: boolean;
  login: (username: string, password: string) => boolean;
  logout: () => void;
}

const AdminAuthContext = createContext<AuthContextType | undefined>(undefined);

export const AdminAuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const hardcodedUsername = process.env.NEXT_PUBLIC_ADMIN_USERNAME!;
  const hardcodedPassword = process.env.NEXT_PUBLIC_ADMIN_PASSWORD!;

  useEffect(() => {
    const auth = localStorage.getItem('admin-auth') === 'true';
    setIsAuthenticated(auth);

    if (!auth && pathname !== '/login') {
      router.replace('/login');
    }
  }, [pathname, router]);

  const login = (username: string, password: string): boolean => {
    if (username === hardcodedUsername && password === hardcodedPassword) {
      setIsAuthenticated(true);
      localStorage.setItem('admin-auth', 'true');
      router.replace('/admin');
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('admin-auth');
    router.replace('/login');
  };

  return (
    <AdminAuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);

  if (!context) {
    throw new Error('useAdminAuth must be used within AdminAuthProvider');
  }
  return context;
};
