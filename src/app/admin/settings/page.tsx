"use client";

import { useState, useEffect, useCallback } from 'react';
import AdminShell from '@/components/admin/AdminShell';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { API_BASE } from '@/lib/api';
import { Loader2, Save, AlertTriangle, Mail, Send, CheckCircle2, ShieldCheck, HelpCircle } from 'lucide-react';

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Test Email States
  const [testEmail, setTestEmail] = useState('');
  const [sendingTest, setSendingTest] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string; debug?: string } | null>(null);

  const fetchSettings = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE}/settings/index.php`, { credentials: 'include' });
      const json = await res.json();
      if (json.success) {
        setSettings(json.data || {});
        if (json.data?.contact_email && !testEmail) {
          setTestEmail(json.data.contact_email);
        }
      } else {
        throw new Error(json.message);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [testEmail]);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');
    
    try {
      const res = await fetch(`${API_BASE}/admin/settings/update.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(settings)
      });
      
      const json = await res.json();
      if (json.success) {
        setSuccess("Settings updated successfully.");
        await fetchSettings();
      } else {
        throw new Error(json.message);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleSendTestEmail = async () => {
    if (!testEmail.trim()) {
      alert("Please enter a recipient email address to send the test email.");
      return;
    }

    setSendingTest(true);
    setTestResult(null);

    try {
      const res = await fetch(`${API_BASE}/admin/settings/test-email.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ test_email: testEmail.trim() })
      });

      const json = await res.json();
      if (json.success) {
        setTestResult({
          success: true,
          message: json.data?.message || "Live test email sent successfully!",
          debug: json.data?.debug
        });
      } else {
        setTestResult({
          success: false,
          message: json.message || "Failed to send test email.",
          debug: json.data?.debug
        });
      }
    } catch (err: any) {
      setTestResult({
        success: false,
        message: err.message || "Network error when attempting to dispatch test email."
      });
    } finally {
      setSendingTest(false);
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
    <AdminShell title="Site &amp; System Settings">
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

      <div className="space-y-8 max-w-4xl">
        <form onSubmit={handleSave} className="space-y-8">
          
          {/* GENERAL FEDERATION DETAILS */}
          <div className="bg-[var(--surface)] border border-[var(--border-color)] p-6 rounded-xl space-y-4 shadow-sm">
            <h3 className="font-display text-sm uppercase tracking-widest text-[var(--text-primary)] border-b border-[var(--border-color)] pb-3">
              General Information
            </h3>
            
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
                  placeholder="e.g. wfftamilnadu@gmail.com" 
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

          {/* EMAIL & SMTP CONFIGURATION */}
          <div className="bg-[var(--surface)] border border-[var(--border-color)] p-6 rounded-xl space-y-5 shadow-sm relative overflow-hidden">
            <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-3">
              <div className="flex items-center gap-2">
                <Mail className="text-[var(--gold)]" size={18} />
                <h3 className="font-display text-sm uppercase tracking-widest text-[var(--text-primary)]">
                  Email &amp; SMTP Configuration
                </h3>
              </div>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-[var(--gold)]/10 text-[var(--gold)] border border-[var(--gold)]/30 uppercase">
                PHPMailer Ready
              </span>
            </div>

            <p className="text-xs text-[var(--muted)] leading-relaxed">
              Configure your authenticated SMTP credentials so that official athlete tickets, receipts, and registration acknowledgments are reliably dispatched to candidates&apos; inboxes without landing in spam or failing.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <label className="block text-xs font-display tracking-widest uppercase text-[var(--muted)] mb-2">SMTP Host</label>
                <Input 
                  value={settings.smtp_host || ''} 
                  onChange={e => handleChange('smtp_host', e.target.value)} 
                  placeholder="e.g. smtp.gmail.com or smtp.hostinger.com" 
                />
              </div>

              <div>
                <label className="block text-xs font-display tracking-widest uppercase text-[var(--muted)] mb-2">SMTP Port</label>
                <Input 
                  type="number"
                  value={settings.smtp_port || '587'} 
                  onChange={e => handleChange('smtp_port', e.target.value)} 
                  placeholder="587 or 465" 
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-display tracking-widest uppercase text-[var(--muted)] mb-2">Encryption</label>
                <select
                  value={settings.smtp_encryption || 'tls'}
                  onChange={e => handleChange('smtp_encryption', e.target.value)}
                  className="w-full h-10 bg-[var(--background)] border border-[var(--border-color)] text-[var(--text-primary)] rounded px-3 text-sm focus:outline-none focus:border-[var(--gold)]"
                >
                  <option value="tls">TLS (STARTTLS - Port 587)</option>
                  <option value="ssl">SSL (SMTPS - Port 465)</option>
                  <option value="none">None (Port 25 / Local)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-display tracking-widest uppercase text-[var(--muted)] mb-2">SMTP Username / Email</label>
                <Input 
                  value={settings.smtp_user || ''} 
                  onChange={e => handleChange('smtp_user', e.target.value)} 
                  placeholder="e.g. wfftamilnadu@gmail.com" 
                />
              </div>

              <div>
                <label className="block text-xs font-display tracking-widest uppercase text-[var(--muted)] mb-2">
                  SMTP Password / App Password
                </label>
                <Input 
                  type="password"
                  value={settings.smtp_pass || ''} 
                  onChange={e => handleChange('smtp_pass', e.target.value)} 
                  placeholder="••••••••" 
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-display tracking-widest uppercase text-[var(--muted)] mb-2">Sender Email (&quot;From&quot;)</label>
                <Input 
                  type="email"
                  value={settings.smtp_from_email || ''} 
                  onChange={e => handleChange('smtp_from_email', e.target.value)} 
                  placeholder="e.g. no-reply@wfftamilnadu.in" 
                />
              </div>

              <div>
                <label className="block text-xs font-display tracking-widest uppercase text-[var(--muted)] mb-2">Sender Name</label>
                <Input 
                  value={settings.smtp_from_name || ''} 
                  onChange={e => handleChange('smtp_from_name', e.target.value)} 
                  placeholder="e.g. World Fitness Federation Tamil Nadu" 
                />
              </div>
            </div>

            {/* Helper tips */}
            <div className="bg-[var(--background)] p-3.5 rounded-lg border border-[var(--border-color)] flex items-start gap-2.5 text-xs text-[var(--muted)]">
              <HelpCircle size={16} className="text-[var(--gold)] shrink-0 mt-0.5" />
              <div>
                <strong>Gmail / Google Workspace Tip:</strong> Set Host to <code className="text-[var(--text-primary)]">smtp.gmail.com</code>, Port to <code className="text-[var(--text-primary)]">587</code>, Encryption to <code className="text-[var(--text-primary)]">TLS</code>, and generate an <strong>App Password</strong> in your Google Account security settings.
              </div>
            </div>
          </div>

          {/* SOCIAL LINKS */}
          <div className="bg-[var(--surface)] border border-[var(--border-color)] p-6 rounded-xl space-y-4 shadow-sm">
            <h3 className="font-display text-sm uppercase tracking-widest text-[var(--text-primary)] border-b border-[var(--border-color)] pb-3">
              Social Links
            </h3>
            
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
          
          {/* SAVE BUTTON */}
          <div className="flex justify-end pt-2">
            <Button type="submit" variant="primary" disabled={saving} className="uppercase tracking-widest text-xs h-11 px-8">
              {saving ? <Loader2 size={16} className="animate-spin" /> : <><Save size={16} className="mr-2" /> Save All Settings</>}
            </Button>
          </div>
        </form>

        {/* LIVE EMAIL TEST DISPATCHER TOOL */}
        <div className="bg-[var(--surface)] border border-[var(--border-color)] p-6 rounded-xl space-y-4 shadow-sm">
          <div className="flex items-center gap-2 border-b border-[var(--border-color)] pb-3">
            <ShieldCheck className="text-emerald-500" size={18} />
            <h3 className="font-display text-sm uppercase tracking-widest text-[var(--text-primary)]">
              Live SMTP Dispatch Test
            </h3>
          </div>

          <p className="text-xs text-[var(--muted)]">
            Before athletes register or tickets are resent, send a live test email to verify that your SMTP server connection, credentials, and port are operating smoothly.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 items-end">
            <div className="flex-1 w-full">
              <label className="block text-xs font-display tracking-widest uppercase text-[var(--muted)] mb-2">
                Recipient Email Address
              </label>
              <Input 
                type="email"
                value={testEmail}
                onChange={e => setTestEmail(e.target.value)}
                placeholder="e.g. your-email@gmail.com"
                className="h-11"
              />
            </div>

            <Button
              type="button"
              onClick={handleSendTestEmail}
              disabled={sendingTest || !testEmail}
              className="h-11 px-6 bg-[var(--gold)] hover:brightness-110 text-black font-semibold text-xs uppercase tracking-wider whitespace-nowrap cursor-pointer shrink-0"
            >
              {sendingTest ? (
                <><Loader2 size={16} className="animate-spin mr-2" /> Dispatched...</>
              ) : (
                <><Send size={16} className="mr-2" /> Send Test Email</>
              )}
            </Button>
          </div>

          {testResult && (
            <div className={`p-4 rounded-lg text-xs leading-relaxed border ${
              testResult.success 
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' 
                : 'bg-red-500/10 border-red-500/30 text-red-400'
            }`}>
              <div className="flex items-start gap-2">
                {testResult.success ? (
                  <CheckCircle2 size={16} className="shrink-0 mt-0.5 text-emerald-400" />
                ) : (
                  <AlertTriangle size={16} className="shrink-0 mt-0.5 text-red-400" />
                )}
                <div>
                  <div className="font-semibold text-sm mb-1">
                    {testResult.success ? "Test Email Delivered!" : "Test Email Delivery Issue"}
                  </div>
                  <div>{testResult.message}</div>
                  {testResult.debug && (
                    <div className="mt-2 font-mono text-[11px] opacity-80 bg-black/30 p-2 rounded">
                      Transport / Debug: {testResult.debug}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

      </div>
    </AdminShell>
  );
}
