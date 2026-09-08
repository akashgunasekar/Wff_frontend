"use client";

import { useState, useEffect, useCallback } from 'react';
import AdminShell from '@/components/admin/AdminShell';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Loader2, Plus, Trophy, Edit, Trash2 } from 'lucide-react';
import Image from 'next/image';
import { resolveImageUrl } from '@/lib/api';

interface Champion {
  id: number;
  athlete_name: string;
  title_won: string;
  event_name: string;
  event_id: number | null;
  category: string;
  photo: string;
  year: string;
  sort_order: number;
}

export default function AdminChampionsPage() {
  const [champions, setChampions] = useState<Champion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  
  const [form, setForm] = useState<Partial<Champion>>({
    athlete_name: '',
    title_won: '',
    event_name: '',
    category: '',
    photo: '',
    year: '',
    sort_order: 0
  });
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState('');

  const fetchChampions = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;
      const res = await fetch(`${API_BASE}/admin/champions/index.php`, {
        credentials: 'include'
      });
      if (!res.ok) throw new Error(res.status === 401 ? 'Unauthorized' : 'Failed to fetch');
      const json = await res.json();
      if (json.success) {
        setChampions(json.data);
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
    fetchChampions();
  }, [fetchChampions]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    setFormError('');
    
    try {
      const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;
      const endpoint = modalMode === 'create' ? '/admin/champions/create.php' : '/admin/champions/update.php';
      const res = await fetch(`${API_BASE}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(form)
      });
      const json = await res.json();
      if (json.success) {
        setShowModal(false);
        fetchChampions();
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
    if (!confirm('Are you sure you want to delete this champion?')) return;
    try {
      const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;
      const res = await fetch(`${API_BASE}/admin/champions/delete.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ id })
      });
      const json = await res.json();
      if (json.success) {
        fetchChampions();
      } else {
        alert(json.message);
      }
    } catch (err: any) {
      alert(err.message);
    }
  };

  const openCreateModal = () => {
    setModalMode('create');
    setForm({ athlete_name: '', title_won: '', event_name: '', category: '', photo: '', year: '', sort_order: 0 });
    setFormError('');
    setShowModal(true);
  };

  const openEditModal = (champ: Champion) => {
    setModalMode('edit');
    setForm({ ...champ });
    setFormError('');
    setShowModal(true);
  };

  return (
    <AdminShell title="Champions">
      <div className="bg-[var(--surface)] border border-[var(--border-color)] p-4 md:p-6 mb-6 flex justify-between items-center">
        <h2 className="font-display uppercase tracking-widest text-sm text-[var(--muted)]">Manage Champions</h2>
        <Button onClick={openCreateModal} variant="primary" className="uppercase tracking-widest text-xs h-10 px-6">
          <Plus size={16} className="mr-2" /> Add Champion
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
        ) : champions.length === 0 ? (
          <div className="p-12 text-center flex flex-col items-center">
            <Trophy className="w-12 h-12 text-[var(--muted)] mb-4 opacity-50" />
            <h3 className="font-display text-lg uppercase tracking-widest text-[var(--text-primary)] mb-2">NO CHAMPIONS YET</h3>
            <p className="text-[var(--muted)] text-sm max-w-md">
              Add verified champions to populate the public Hall of Champions.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[var(--border-color)] bg-black/5 dark:bg-white/5">
                  <th className="p-4 text-xs font-display tracking-widest uppercase text-[var(--muted)] font-normal">Photo</th>
                  <th className="p-4 text-xs font-display tracking-widest uppercase text-[var(--muted)] font-normal">Athlete & Title</th>
                  <th className="p-4 text-xs font-display tracking-widest uppercase text-[var(--muted)] font-normal">Event / Year</th>
                  <th className="p-4 text-xs font-display tracking-widest uppercase text-[var(--muted)] font-normal">Sort Order</th>
                  <th className="p-4 text-xs font-display tracking-widest uppercase text-[var(--muted)] font-normal text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-color)] text-sm">
                {champions.map(champion => (
                  <tr key={champion.id} className="hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
                    <td className="p-4">
                      {champion.photo ? (
                        <div className="relative w-12 h-12 rounded-sm overflow-hidden border border-[var(--border-color)]">
                          <Image src={resolveImageUrl(champion.photo)!} alt={champion.athlete_name} fill className="object-cover" />
                        </div>
                      ) : (
                        <div className="w-12 h-12 rounded-sm bg-black/10 dark:bg-white/10 flex items-center justify-center border border-[var(--border-color)] text-[var(--muted)]">
                          <Trophy size={20} />
                        </div>
                      )}
                    </td>
                    <td className="p-4">
                      <div className="font-display font-medium text-[var(--text-primary)]">{champion.athlete_name}</div>
                      <div className="text-[11px] text-[var(--gold)] uppercase">{champion.title_won}</div>
                      {champion.category && <div className="text-[11px] text-[var(--muted)]">{champion.category}</div>}
                    </td>
                    <td className="p-4">
                      <div className="font-medium">{champion.event_name}</div>
                      <div className="text-[11px] text-[var(--muted)]">{champion.year}</div>
                    </td>
                    <td className="p-4">
                      <span className="font-medium">{champion.sort_order}</span>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex justify-end gap-2">
                        <Button onClick={() => openEditModal(champion)} variant="secondary" className="h-8 px-3">
                          <Edit size={14} />
                        </Button>
                        <Button onClick={() => handleDelete(champion.id)} variant="secondary" className="h-8 px-3 text-red-500 hover:text-red-600 hover:border-red-500/50">
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
                {modalMode === 'create' ? 'Add Champion' : 'Edit Champion'}
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
                  <label className="block text-xs font-display tracking-widest uppercase text-[var(--muted)] mb-2">Athlete Name *</label>
                  <Input required value={form.athlete_name} onChange={e => setForm({...form, athlete_name: e.target.value})} />
                </div>
                
                <div>
                  <label className="block text-xs font-display tracking-widest uppercase text-[var(--muted)] mb-2">Title Won *</label>
                  <Input required value={form.title_won} onChange={e => setForm({...form, title_won: e.target.value})} placeholder="e.g. Mr. Tamil Nadu" />
                </div>

                <div>
                  <label className="block text-xs font-display tracking-widest uppercase text-[var(--muted)] mb-2">Event Name *</label>
                  <Input required value={form.event_name} onChange={e => setForm({...form, event_name: e.target.value})} placeholder="e.g. WFF State Championship" />
                </div>
                
                <div>
                  <label className="block text-xs font-display tracking-widest uppercase text-[var(--muted)] mb-2">Category</label>
                  <Input value={form.category} onChange={e => setForm({...form, category: e.target.value})} placeholder="e.g. Senior Bodybuilding 70kg" />
                </div>
                
                <div>
                  <label className="block text-xs font-display tracking-widest uppercase text-[var(--muted)] mb-2">Year</label>
                  <Input value={form.year} onChange={e => setForm({...form, year: e.target.value})} placeholder="e.g. 2026" />
                </div>

                <div>
                  <label className="block text-xs font-display tracking-widest uppercase text-[var(--muted)] mb-2">Photo URL (Optional)</label>
                  <Input value={form.photo} onChange={e => setForm({...form, photo: e.target.value})} placeholder="/assets/champions/xyz.jpg" />
                </div>

                <div>
                  <label className="block text-xs font-display tracking-widest uppercase text-[var(--muted)] mb-2">Sort Order</label>
                  <Input type="number" value={form.sort_order} onChange={e => setForm({...form, sort_order: parseInt(e.target.value) || 0})} />
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
