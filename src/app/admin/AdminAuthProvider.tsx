"use client";

import { useEffect, useState, createContext, useContext } from 'react';
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
}

const AuthContext = createContext<AuthContextType>({ user: null, loading: true, logout: () => {} });

export const useAdminAuth = () => useContext(AuthContext);

export default function AdminAuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    checkAuth();
  }, [pathname]);

  useEffect(() => {
    if (typeof window !== 'undefined' && user?.csrf_token) {
      const originalFetch = window.fetch;
      window.fetch = async (...args) => {
        let [resource, config] = args;
        
        if (typeof resource === 'string' && resource.includes('/api/admin/')) {
          const method = config?.method?.toUpperCase() || 'GET';
          if (method !== 'GET' && method !== 'OPTIONS') {
            config = config || {};
            config.headers = {
              ...config.headers,
              'X-CSRF-Token': user.csrf_token || ''
            };
            args[1] = config;
          }
        }
        return originalFetch(...args);
      };

      return () => {
        window.fetch = originalFetch;
      };
    }
  }, [user]);

  const checkAuth = async () => {
    const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;
    try {
      const res = await fetch(`${API_BASE}/admin/auth/me.php`, {
        credentials: 'include',
        cache: 'no-store'
      });
      
      const contentType = res.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("Invalid response");
      }
      const json = await res.json();
      
      if (res.ok && json.success) {
        setUser(json.data);
        if (pathname === '/admin/login') {
          router.replace('/admin');
        }
      } else {
        setUser(null);
        if (pathname !== '/admin/login') {
          router.replace('/admin/login');
        }
      }
    } catch (error) {
      setUser(null);
      if (pathname !== '/admin/login') {
        router.replace('/admin/login');
      }
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;
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
    <AuthContext.Provider value={{ user, loading, logout }}>
      {/* We render over the public layout using fixed inset-0 */}
      <div className="fixed inset-0 z-[100] bg-[var(--surface)] overflow-y-auto">
        {children}
      </div>
    </AuthContext.Provider>
  );
}
