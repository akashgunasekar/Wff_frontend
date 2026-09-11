"use client";

import { useState, useEffect, useCallback } from 'react';
import AdminShell from '@/components/admin/AdminShell';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Loader2, Plus, Users, Edit, Trash2, Upload, Image as ImageIcon, X } from 'lucide-react';
import Image from 'next/image';
import { resolveImageUrl } from '@/lib/api';

interface Official {
  id: number;
  name: string;
  role: string;
  designation: string;
  photo: string;
  bio: string;
  instagram_url?: string;
  facebook_url?: string;
  youtube_url?: string;
  website_url?: string;
  sort_order: number;
  status: number;
}

export default function AdminOfficialsPage() {
  const [officials, setOfficials] = useState<Official[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  
  const [form, setForm] = useState<Partial<Official>>({
    name: '',
    role: '',
    designation: '',
    photo: '',
    bio: '',
    instagram_url: '',
    facebook_url: '',
    youtube_url: '',
    website_url: '',
    sort_order: 0,
    status: 1
  });
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState('');

  const fetchOfficials = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || '/api';
      const res = await fetch(`${API_BASE}/admin/officials/index.php`, {
        credentials: 'include'
      });
      if (!res.ok) throw new Error(res.status === 401 ? 'Unauthorized' : 'Failed to fetch');
      const json = await res.json();
      if (json.success) {
        setOfficials(json.data);
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
    fetchOfficials();
  }, [fetchOfficials]);

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    
    const formData = new FormData();
    formData.append('image', file);
    
    setFormLoading(true);
    setFormError('');
    try {
      const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || '/api';
      const res = await fetch(`${API_BASE}/admin/officials/upload-photo.php`, {
        method: 'POST',
        credentials: 'include',
        body: formData
      });
      const json = await res.json();
      if (json.success) {
        setForm({ ...form, photo: json.data.image });
      } else {
        throw new Error(json.message);
      }
    } catch (err: any) {
      setFormError(err.message);
    } finally {
      setFormLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    setFormError('');
    
    try {
      const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || '/api';
      const endpoint = modalMode === 'create' ? '/admin/officials/create.php' : '/admin/officials/update.php';
      const res = await fetch(`${API_BASE}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(form)
      });
      const json = await res.json();
      if (json.success) {
        setShowModal(false);
        fetchOfficials();
      } else {
        throw new Error(json.message);
      }
    } catch (err: any) {
      setFormError(err.message);
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this official?')) return;
    try {
      const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || '/api';
      const res = await fetch(`${API_BASE}/admin/officials/delete.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ id })
      });
      const json = await res.json();
      if (json.success) {
        fetchOfficials();
      } else {
        alert(json.message);
      }
    } catch (err: any) {
      alert(err.message);
    }
  };

  const openCreateModal = () => {
    setModalMode('create');
    setForm({ name: '', role: '', designation: '', photo: '', bio: '', instagram_url: '', facebook_url: '', youtube_url: '', website_url: '', sort_order: 0, status: 1 });
    setFormError('');
    setShowModal(true);
  };

  const openEditModal = (off: Official) => {
    setModalMode('edit');
    setForm({ ...off });
    setFormError('');
    setShowModal(true);
  };

  return (
    <AdminShell title="Officials">
      <div className="bg-[var(--surface)] border border-[var(--border-color)] p-4 md:p-6 mb-6 flex justify-between items-center">
        <h2 className="font-display uppercase tracking-widest text-sm text-[var(--muted)]">Manage Officials</h2>
        <Button onClick={openCreateModal} variant="primary" className="uppercase tracking-widest text-xs h-10 px-6">
          <Plus size={16} className="mr-2" /> Add Official
        </Button>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/50 text-red-600 dark:text-red-400 p-4 mb-6 rounded text-sm">
          {error}
        </div>
      )}

      <div className="bg-[var(--surface)] border border-[var(--border-color)] overflow-hidden">
        {loading ? (
          <div className="p-12 flex justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-[var(--gold)]" />
          </div>
        ) : officials.length === 0 ? (
          <div className="p-12 text-center flex flex-col items-center">
            <Users className="w-12 h-12 text-[var(--muted)] mb-4 opacity-50" />
            <h3 className="font-display text-lg uppercase tracking-widest text-[var(--text-primary)] mb-2">NO OFFICIALS</h3>
            <p className="text-[var(--muted)] text-sm max-w-md">
              Add federation officials to be displayed on the association page.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[var(--border-color)] bg-black/5 dark:bg-white/5">
                  <th className="p-4 text-xs font-display tracking-widest uppercase text-[var(--muted)] font-normal">Photo</th>
                  <th className="p-4 text-xs font-display tracking-widest uppercase text-[var(--muted)] font-normal">Name & Role</th>
                  <th className="p-4 text-xs font-display tracking-widest uppercase text-[var(--muted)] font-normal">Sort Order</th>
                  <th className="p-4 text-xs font-display tracking-widest uppercase text-[var(--muted)] font-normal text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-color)] text-sm">
                {officials.map(official => (
                  <tr key={official.id} className="hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
                    <td className="p-4">
                      {official.photo ? (
                        <div className="relative w-12 h-12 rounded-full overflow-hidden border border-[var(--border-color)]">
                          <Image src={resolveImageUrl(official.photo)!} alt={official.name} fill className="object-cover" />
                        </div>
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-black/10 dark:bg-white/10 flex items-center justify-center border border-[var(--border-color)] text-[var(--muted)]">
                          <Users size={20} />
                        </div>
                      )}
                    </td>
                    <td className="p-4">
                      <div className="font-display font-medium text-[var(--text-primary)] flex items-center gap-2">
                        {official.name}
                        {!official.status && <span className="text-[9px] bg-red-500/20 text-red-500 px-2 py-0.5 rounded uppercase tracking-widest">Inactive</span>}
                      </div>
                      <div className="text-[11px] text-[var(--gold)] mt-0.5">{official.designation}</div>
                      <div className="flex gap-2 mt-2">
                         {official.instagram_url && <span className="text-[10px] bg-black/20 text-[var(--muted)] px-1.5 py-0.5 rounded border border-white/5">IG</span>}
                         {official.facebook_url && <span className="text-[10px] bg-black/20 text-[var(--muted)] px-1.5 py-0.5 rounded border border-white/5">FB</span>}
                         {official.youtube_url && <span className="text-[10px] bg-black/20 text-[var(--muted)] px-1.5 py-0.5 rounded border border-white/5">YT</span>}
                         {official.website_url && <span className="text-[10px] bg-black/20 text-[var(--muted)] px-1.5 py-0.5 rounded border border-white/5">WEB</span>}
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="font-medium">{official.sort_order}</span>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex justify-end gap-2">
                        <Button onClick={() => openEditModal(official)} variant="secondary" className="h-8 px-3">
                          <Edit size={14} />
                        </Button>
                        <Button onClick={() => handleDelete(official.id)} variant="secondary" className="h-8 px-3 text-red-500 hover:text-red-600 hover:border-red-500/50">
                          <Trash2 size={14} />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-[var(--surface)] border border-[var(--border-color)] w-full max-w-lg shadow-2xl flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-[var(--border-color)] flex justify-between items-center">
              <h2 className="font-display text-xl uppercase tracking-widest text-[var(--text-primary)]">
                {modalMode === 'create' ? 'Add Official' : 'Edit Official'}
              </h2>
              <button onClick={() => setShowModal(false)} className="text-[var(--muted)] hover:text-white">&times;</button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 overflow-y-auto">
              {formError && (
                <div className="bg-red-500/10 border border-red-500/50 text-red-600 dark:text-red-400 p-4 mb-4 rounded text-sm">
                  {formError}
                </div>
              )}
              
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-display tracking-widest uppercase text-[var(--muted)] mb-2">Name *</label>
                  <Input required value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
                </div>
                
                <div>
                  <label className="block text-xs font-display tracking-widest uppercase text-[var(--muted)] mb-2">Role</label>
                  <Input value={form.role} onChange={e => setForm({...form, role: e.target.value})} placeholder="e.g. President, WFF Tamil Nadu" />
                </div>

                <div>
                  <label className="block text-xs font-display tracking-widest uppercase text-[var(--muted)] mb-2">Designation</label>
                  <Input value={form.designation} onChange={e => setForm({...form, designation: e.target.value})} placeholder="e.g. Secretary, WFF India" />
                </div>

                <div>
                  <label className="block text-xs font-display tracking-widest uppercase text-[var(--muted)] mb-2">Profile Photo (Portrait)</label>
                  {form.photo ? (
                    <div className="relative w-32 h-40 border-2 border-[var(--gold)] overflow-hidden rounded-md group">
                      <Image src={resolveImageUrl(form.photo)!} alt="Preview" fill className="object-cover" />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                         <button type="button" onClick={() => setForm({...form, photo: ''})} className="text-white hover:text-red-500 bg-black/50 p-2 rounded-full">
                           <X size={20} />
                         </button>
                      </div>
                    </div>
                  ) : (
                    <div className="relative border-2 border-dashed border-[var(--border-color)] hover:border-[var(--gold)]/50 rounded-md p-6 text-center transition-colors">
                      <input 
                        type="file" 
                        accept="image/jpeg,image/png,image/webp" 
                        onChange={handlePhotoUpload} 
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        disabled={formLoading}
                      />
                      <div className="flex flex-col items-center pointer-events-none">
                        <Upload size={24} className="text-[var(--muted)] mb-2" />
                        <span className="text-sm font-medium text-[var(--text-primary)]">Click to upload photo</span>
                        <span className="text-xs text-[var(--muted)] mt-1">JPEG, PNG, WebP (Portrait recommended)</span>
                      </div>
                    </div>
                  )}
                </div>
                
                <div>
                  <label className="block text-xs font-display tracking-widest uppercase text-[var(--muted)] mb-2">Short Bio (Optional)</label>
                  <textarea 
                    className="w-full bg-[var(--bg-color)] border border-[var(--border-color)] text-[var(--text-primary)] rounded-md px-3 py-2 text-sm focus:outline-none focus:border-[var(--gold)] transition-colors min-h-[80px]" 
                    value={form.bio || ''} 
                    onChange={e => setForm({...form, bio: e.target.value})} 
                    placeholder="Short professional biography..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-display tracking-widest uppercase text-[var(--muted)] mb-2">Instagram URL</label>
                    <Input type="url" value={form.instagram_url || ''} onChange={e => setForm({...form, instagram_url: e.target.value})} placeholder="https://instagram.com/..." />
                  </div>
                  <div>
                    <label className="block text-xs font-display tracking-widest uppercase text-[var(--muted)] mb-2">Facebook URL</label>
                    <Input type="url" value={form.facebook_url || ''} onChange={e => setForm({...form, facebook_url: e.target.value})} placeholder="https://facebook.com/..." />
                  </div>
                  <div>
                    <label className="block text-xs font-display tracking-widest uppercase text-[var(--muted)] mb-2">YouTube URL</label>
                    <Input type="url" value={form.youtube_url || ''} onChange={e => setForm({...form, youtube_url: e.target.value})} placeholder="https://youtube.com/..." />
                  </div>
                  <div>
                    <label className="block text-xs font-display tracking-widest uppercase text-[var(--muted)] mb-2">Website URL</label>
                    <Input type="url" value={form.website_url || ''} onChange={e => setForm({...form, website_url: e.target.value})} placeholder="https://example.com" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-display tracking-widest uppercase text-[var(--muted)] mb-2">Sort Order</label>
                    <Input type="number" value={form.sort_order} onChange={e => setForm({...form, sort_order: parseInt(e.target.value) || 0})} />
                  </div>
                  <div>
                    <label className="block text-xs font-display tracking-widest uppercase text-[var(--muted)] mb-2">Status</label>
                    <select 
                      className="w-full bg-[var(--bg-color)] border border-[var(--border-color)] text-[var(--text-primary)] rounded-md px-3 py-2 text-sm h-10 focus:outline-none focus:border-[var(--gold)]"
                      value={form.status} 
                      onChange={e => setForm({...form, status: parseInt(e.target.value)})}
                    >
                      <option value={1}>Active</option>
                      <option value={0}>Inactive</option>
                    </select>
                  </div>
                </div>
              </div>
              
              <div className="mt-8 flex justify-end gap-4">
                <Button type="button" variant="secondary" onClick={() => setShowModal(false)} disabled={formLoading}>
                  Cancel
                </Button>
                <Button type="submit" variant="primary" disabled={formLoading} className="min-w-[120px]">
                  {formLoading ? <Loader2 size={16} className="animate-spin" /> : 'Save'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminShell>
  );
}
