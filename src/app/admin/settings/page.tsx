"use client";

import { useState, useEffect, useCallback } from 'react';
import AdminShell from '@/components/admin/AdminShell';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Loader2, Save, AlertTriangle } from 'lucide-react';

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const fetchSettings = useCallback(async () => {
    try {
      const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;
      const res = await fetch(`${API_BASE}/settings/index.php`, { credentials: 'include' });
      const json = await res.json();
      if (json.success) {
        setSettings(json.data || {});
      } else {
        throw new Error(json.message);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');
    
    try {
      const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;
      const res = await fetch(`${API_BASE}/admin/settings/update.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(settings)
      });
      
      const json = await res.json();
      if (json.success) {
        setSuccess("Settings updated successfully.");
      } else {
        throw new Error(json.message);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (key: string, value: string) => {
    setSettings((prev: any) => ({ ...prev, [key]: value }));
  };

  if (loading) {
    return (
      <AdminShell title="Settings">
        <div className="p-12 flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-[var(--gold)]" /></div>
      </AdminShell>
    );
  }

  return (
    <AdminShell title="Site Settings">
      {error && (
        <div className="bg-red-500/10 border border-red-500/50 text-red-600 dark:text-red-400 p-4 mb-6 rounded text-sm flex items-center">
          <AlertTriangle size={16} className="mr-2 flex-shrink-0" />
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-500/10 border border-green-500/50 text-green-600 dark:text-green-400 p-4 mb-6 rounded text-sm">
          {success}
        </div>
      )}

      <div className="bg-[var(--surface)] border border-[var(--border-color)] p-6 max-w-3xl">
        <form onSubmit={handleSave} className="space-y-6">
          
          <div className="space-y-4">
            <h3 className="font-display text-sm uppercase tracking-widest text-[var(--text-primary)] border-b border-[var(--border-color)] pb-2">General Information</h3>
            
            <div>
              <label className="block text-xs font-display tracking-widest uppercase text-[var(--muted)] mb-2">Site/Federation Name</label>
              <Input 
                value={settings.site_name || ''} 
                onChange={e => handleChange('site_name', e.target.value)} 
                placeholder="e.g. WFF Tamil Nadu" 
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-display tracking-widest uppercase text-[var(--muted)] mb-2">Contact Email</label>
                <Input 
                  type="email"
                  value={settings.contact_email || ''} 
                  onChange={e => handleChange('contact_email', e.target.value)} 
                  placeholder="e.g. info@wffindia.com" 
                />
              </div>
              <div>
                <label className="block text-xs font-display tracking-widest uppercase text-[var(--muted)] mb-2">Phone Number</label>
                <Input 
                  value={settings.phone || ''} 
                  onChange={e => handleChange('phone', e.target.value)} 
                  placeholder="e.g. +91 99999 99999" 
                />
              </div>
            </div>
            
            <div>
              <label className="block text-xs font-display tracking-widest uppercase text-[var(--muted)] mb-2">Address / Headquarters</label>
              <textarea 
                value={settings.contact_address || ''} 
                onChange={e => handleChange('contact_address', e.target.value)} 
                placeholder="e.g. Chennai, Tamil Nadu"
                rows={3}
                className="w-full bg-[var(--background)] border border-[var(--border-color)] text-[var(--text-primary)] rounded px-3 py-2 text-sm focus:outline-none focus:border-[var(--gold)] resize-y"
              ></textarea>
            </div>
            
            <div>
              <label className="block text-xs font-display tracking-widest uppercase text-[var(--muted)] mb-2">Google Maps URL</label>
              <Input 
                value={settings.contact_map_url || ''} 
                onChange={e => handleChange('contact_map_url', e.target.value)} 
                placeholder="https://maps.google.com/..." 
              />
            </div>
          </div>

          <div className="space-y-4 pt-4">
            <h3 className="font-display text-sm uppercase tracking-widest text-[var(--text-primary)] border-b border-[var(--border-color)] pb-2">Social Links</h3>
            
            <div>
              <label className="block text-xs font-display tracking-widest uppercase text-[var(--muted)] mb-2">Facebook URL</label>
              <Input 
                value={settings.facebook_url || ''} 
                onChange={e => handleChange('facebook_url', e.target.value)} 
                placeholder="https://facebook.com/..." 
              />
            </div>
            <div>
              <label className="block text-xs font-display tracking-widest uppercase text-[var(--muted)] mb-2">Instagram URL</label>
              <Input 
                value={settings.instagram_url || ''} 
                onChange={e => handleChange('instagram_url', e.target.value)} 
                placeholder="https://instagram.com/..." 
              />
            </div>
            <div>
              <label className="block text-xs font-display tracking-widest uppercase text-[var(--muted)] mb-2">YouTube URL</label>
              <Input 
                value={settings.youtube_url || ''} 
                onChange={e => handleChange('youtube_url', e.target.value)} 
                placeholder="https://youtube.com/..." 
              />
            </div>
            <div>
              <label className="block text-xs font-display tracking-widest uppercase text-[var(--muted)] mb-2">Website URL</label>
              <Input 
                value={settings.website_url || ''} 
                onChange={e => handleChange('website_url', e.target.value)} 
                placeholder="https://example.com" 
              />
            </div>
          </div>
          
          <div className="pt-6 flex justify-end border-t border-[var(--border-color)]">
            <Button type="submit" variant="primary" disabled={saving} className="uppercase tracking-widest text-xs h-10 px-8">
              {saving ? <Loader2 size={16} className="animate-spin" /> : <><Save size={16} className="mr-2" /> Save Settings</>}
            </Button>
          </div>
        </form>
      </div>
    </AdminShell>
  );
}
