"use client";

import { useEffect, useState, createContext, useContext, useCallback } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Loader2 } from 'lucide-react';

interface AdminUser {
  id: number;
  name: string;
  email: string;
  role: string;
  csrf_token?: string;
}

interface AuthContextType {
  user: AdminUser | null;
  loading: boolean;
  logout: () => void;
  checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({ 
  user: null, 
  loading: true, 
  logout: () => {},
  checkAuth: async () => {}
});

export const useAdminAuth = () => useContext(AuthContext);

export default function AdminAuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  const checkAuth = useCallback(async () => {
    const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://api.wfftamilnadu.in/api';
    try {
      const res = await fetch(`${API_BASE}/admin/auth/me.php`, {
        credentials: 'include',
        cache: 'no-store'
      });
      
      if (res.ok) {
        const json = await res.json().catch(() => null);
        if (json?.success && json?.data) {
          setUser(json.data);
          if (pathname === '/admin/login') {
            router.replace('/admin');
          }
          setLoading(false);
          return;
        }
      }
      
      setUser(null);
      if (pathname !== '/admin/login') {
        router.replace('/admin/login');
      }
    } catch {
      setUser(null);
      if (pathname !== '/admin/login') {
        router.replace('/admin/login');
      }
    } finally {
      setLoading(false);
    }
  }, [pathname, router]);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const logout = async () => {
    setLoading(true);
    const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://api.wfftamilnadu.in/api';
    try {
      await fetch(`${API_BASE}/admin/auth/logout.php`, {
        method: 'POST',
        credentials: 'include'
      });
    } catch (error) {
      console.error("Logout error", error);
    }
    setUser(null);
    router.replace('/admin/login');
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="fixed inset-0 z-[100] bg-[var(--surface)] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[var(--gold)]" />
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user, loading, logout, checkAuth }}>
      <div className="fixed inset-0 z-[100] bg-[var(--surface)] overflow-y-auto">
        {children}
      </div>
    </AuthContext.Provider>
  );
}
