"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { AlertCircle } from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !password) {
      setError('Email and password are required.');
      return;
    }

    setLoading(true);
    const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;
    try {
      const res = await fetch(`${API_BASE}/admin/auth/login.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
        credentials: 'include' // crucial for saving the session cookie
      });

      const contentType = res.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("Server returned an invalid response (not JSON). Please check the API base URL.");
      }
      const json = await res.json();

      if (!res.ok || !json.success) {
        throw new Error(json.message || "Invalid email or password.");
      }

      // Force hard navigation to /admin to re-trigger AuthProvider fetch
      window.location.href = '/admin';
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--surface)] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="font-display font-bold text-[10px] tracking-[0.2em] uppercase text-[var(--gold)] mb-2">
            World Fitness Federation
          </div>
          <h1 className="font-display text-3xl uppercase tracking-widest text-[var(--text-primary)]">
            Administration
          </h1>
        </div>

        <form onSubmit={handleLogin} className="bg-[var(--surface)] border border-[var(--border-color)] p-8 shadow-2xl">
          {error && (
            <div className="mb-6 bg-red-500/10 border border-red-500/50 text-red-600 dark:text-red-400 p-3 flex items-start gap-2 rounded text-sm">
              <AlertCircle className="shrink-0 mt-0.5" size={16} />
              <p>{error}</p>
            </div>
          )}

          <div className="space-y-6">
            <div>
              <label className="block text-[10px] font-display tracking-widest uppercase text-[var(--muted)] mb-2">
                Admin Email
              </label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="admin@wfftn.com"
              />
            </div>

            <div>
              <label className="block text-[10px] font-display tracking-widest uppercase text-[var(--muted)] mb-2">
                Password
              </label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              variant="gold"
              className="w-full h-12 uppercase tracking-widest shadow-[0_4px_20px_rgba(198,161,91,0.2)] mt-2"
            >
              {loading ? 'Signing in...' : 'Login'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
