/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { createContext, useContext, useState, ReactNode, useEffect } from 'react';

export type UserRole = 'Patient' | 'Driver' | 'Admin';

interface User {
  id: string;
  role: UserRole;
  name: string;
  targetId?: string; // e.g., hospitalId or ambulanceId
}

interface AuthContextType {
  user: User | null;
  login: (role: UserRole, id: string, name: string, targetId?: string) => void;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem('arogyavahini_auth');
    if (saved) setUser(JSON.parse(saved));
    setIsLoading(false);
  }, []);

  const login = (role: UserRole, id: string, name: string, targetId?: string) => {
    const newUser = { id, role, name, targetId };
    setUser(newUser);
    localStorage.setItem('arogyavahini_auth', JSON.stringify(newUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('arogyavahini_auth');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
