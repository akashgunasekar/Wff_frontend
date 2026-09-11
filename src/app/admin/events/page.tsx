"use client";

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import AdminShell from '@/components/admin/AdminShell';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Search, Loader2, Calendar as CalendarIcon, Plus, Trash } from 'lucide-react';

interface EventList {
  id: number;
  event_name: string;
  slug: string;
  event_date: string;
  venue: string;
  status: string;
  category_count: number;
  registration_count: number;
}

export default function AdminEventsPage() {
  const [events, setEvents] = useState<EventList[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createForm, setCreateForm] = useState({
    event_name: '',
    slug: '',
    event_date: '',
    venue: '',
    status: 'upcoming'
  });
  const [createPosterFile, setCreatePosterFile] = useState<File | null>(null);
  const [createPosterPreview, setCreatePosterPreview] = useState<string>('');
  const [createLoading, setCreateLoading] = useState(false);
  const [createError, setCreateError] = useState('');

  const fetchEvents = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || '/api';
      const params = new URLSearchParams();
      if (status) params.append('status', status);
      
      const res = await fetch(`${API_BASE}/admin/events/index.php?${params.toString()}`, {
        credentials: 'include'
      });
      
      if (!res.ok) throw new Error(res.status === 401 ? 'Unauthorized' : 'Failed to fetch');
      
      const json = await res.json();
      if (json.success) {
        setEvents(json.data);
      } else {
        throw new Error(json.message);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [status]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const filteredEvents = events.filter(e => 
    e.event_name.toLowerCase().includes(search.toLowerCase()) ||
    e.venue.toLowerCase().includes(search.toLowerCase()) ||
    e.slug.toLowerCase().includes(search.toLowerCase())
  );

  const statusColors: Record<string, string> = {
    open: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
    upcoming: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
    closed: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300',
  };

  const handleDelete = async (id: number, name: string) => {
    if (!window.confirm(`Are you sure you want to delete "${name}"? This action cannot be undone.`)) return;
    try {
      const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || '/api';
      const res = await fetch(`${API_BASE}/admin/events/delete.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ id })
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.message);
      fetchEvents();
    } catch (err: any) {
      setError(err.message || 'Failed to delete event');
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreateLoading(true);
    setCreateError('');
    
    try {
      const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || '/api';
      
      let banner_image = '';
      if (createPosterFile) {
         const formData = new FormData();
         formData.append('image', createPosterFile);
         const uploadRes = await fetch(`${API_BASE}/admin/events/upload-poster.php`, {
            method: 'POST', body: formData, credentials: 'include'
         });
         const uploadJson = await uploadRes.json();
         if (!uploadJson.success) {
            throw new Error(uploadJson.message || "Failed to upload poster.");
         }
         banner_image = uploadJson.data.image;
      }
      
      const res = await fetch(`${API_BASE}/admin/events/create.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ ...createForm, banner_image })
      });
      
      const json = await res.json();
      if (json.success) {
        setShowCreateModal(false);
        setCreateForm({ event_name: '', slug: '', event_date: '', venue: '', status: 'upcoming' });
        setCreatePosterFile(null);
        setCreatePosterPreview('');
        fetchEvents();
      } else {
        throw new Error(json.message);
      }
    } catch (err: any) {
      setCreateError(err.message);
    } finally {
      setCreateLoading(false);
    }
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    const slug = val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    setCreateForm({ ...createForm, event_name: val, slug });
  };

  return (
    <AdminShell title="Events">
      <div className="bg-[var(--surface)] border border-[var(--border-color)] p-4 md:p-6 mb-6 flex flex-col md:flex-row gap-4 items-end justify-between">
        <div className="flex flex-col md:flex-row gap-4 items-end flex-1">
          <div className="flex-1 w-full max-w-sm">
            <label className="block text-xs font-display tracking-widest uppercase text-[var(--muted)] mb-2">Search</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted)] w-4 h-4" />
              <Input 
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Name, Venue..." 
                className="pl-10"
              />
            </div>
          </div>
          
          <div className="w-full md:w-48">
            <label className="block text-xs font-display tracking-widest uppercase text-[var(--muted)] mb-2">Status</label>
            <Select value={status} onChange={e => { setStatus(e.target.value); }}>
              <option value="">All Statuses</option>
              <option value="open">Registration Open</option>
              <option value="upcoming">Upcoming</option>
              <option value="closed">Closed</option>
            </Select>
          </div>
        </div>
        
        <Button onClick={() => setShowCreateModal(true)} variant="primary" className="w-full md:w-auto uppercase tracking-widest text-xs h-10 px-6 whitespace-nowrap">
          <Plus size={16} className="mr-2" /> Create Event
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
        ) : filteredEvents.length === 0 ? (
          <div className="p-12 text-center flex flex-col items-center">
            <CalendarIcon className="w-12 h-12 text-[var(--muted)] mb-4 opacity-50" />
            <h3 className="font-display text-lg uppercase tracking-widest text-[var(--text-primary)] mb-2">NO EVENTS YET</h3>
            <p className="text-[var(--muted)] text-sm max-w-md">
              Create a new event to start accepting registrations and configuring categories.
            </p>
          </div>
        ) : (
          <>
            <div className="hidden md:block">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-[var(--border-color)] bg-black/5 dark:bg-white/5">
                    <th className="p-4 text-xs font-display tracking-widest uppercase text-[var(--muted)] font-normal">Event</th>
                    <th className="p-4 text-xs font-display tracking-widest uppercase text-[var(--muted)] font-normal">Date / Venue</th>
                    <th className="p-4 text-xs font-display tracking-widest uppercase text-[var(--muted)] font-normal">Status</th>
                    <th className="p-4 text-xs font-display tracking-widest uppercase text-[var(--muted)] font-normal">Categories</th>
                    <th className="p-4 text-xs font-display tracking-widest uppercase text-[var(--muted)] font-normal">Registrations</th>
                    <th className="p-4 text-xs font-display tracking-widest uppercase text-[var(--muted)] font-normal text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border-color)] text-sm">
                  {filteredEvents.map(event => (
                    <tr key={event.id} className="hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
                      <td className="p-4">
                        <div className="font-display font-medium text-[var(--text-primary)]">{event.event_name}</div>
                        <div className="text-[11px] text-[var(--muted)]">/{event.slug}</div>
                      </td>
                      <td className="p-4">
                        <div className="text-[var(--text-primary)]">{new Date(event.event_date).toLocaleDateString()}</div>
                        <div className="text-[11px] text-[var(--muted)]">{event.venue}</div>
                      </td>
                      <td className="p-4">
                        <span className={`inline-block px-2 py-1 text-[10px] font-bold uppercase tracking-wider rounded-sm ${statusColors[event.status] || 'bg-gray-100 text-gray-800'}`}>
                          {event.status}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className="font-medium">{event.category_count}</span>
                      </td>
                      <td className="p-4">
                        <span className="font-medium">{event.registration_count}</span>
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex justify-end gap-2">
                          <Link href={`/admin/events/${event.id}`}>
                            <Button variant="secondary" className="text-xs uppercase tracking-widest h-8 px-4">
                              Manage
                            </Button>
                          </Link>
                          <Button 
                            variant="secondary"
                            className="text-red-500 border-red-500/30 hover:bg-red-500 hover:text-white h-8 w-8 p-0 bg-red-500/10"
                            onClick={() => handleDelete(event.id, event.event_name)}
                          >
                            <Trash size={14} />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="block md:hidden divide-y divide-[var(--border-color)]">
              {filteredEvents.map(event => (
                <div key={event.id} className="p-4 flex flex-col gap-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-display font-medium text-[var(--text-primary)] mb-1">{event.event_name}</div>
                      <div className="text-[11px] text-[var(--muted)]">{new Date(event.event_date).toLocaleDateString()} &bull; {event.venue}</div>
                    </div>
                    <div className="flex gap-2">
                      <Link href={`/admin/events/${event.id}`}>
                        <Button variant="secondary" className="text-[10px] uppercase tracking-widest h-7 px-3">
                          Manage
                        </Button>
                      </Link>
                      <Button 
                        variant="secondary"
                        className="text-red-500 border-red-500/30 hover:bg-red-500 hover:text-white h-7 w-7 p-0 bg-red-500/10"
                        onClick={() => handleDelete(event.id, event.event_name)}
                      >
                        <Trash size={12} />
                      </Button>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <span className={`inline-block px-2 py-1 text-[9px] font-bold uppercase tracking-wider rounded-sm ${statusColors[event.status] || 'bg-gray-100 text-gray-800'}`}>
                      {event.status}
                    </span>
                    <span className="inline-block px-2 py-1 text-[9px] font-bold uppercase tracking-wider bg-black/5 dark:bg-white/5 rounded-sm">
                      {event.category_count} Categories
                    </span>
                    <span className="inline-block px-2 py-1 text-[9px] font-bold uppercase tracking-wider bg-black/5 dark:bg-white/5 rounded-sm">
                      {event.registration_count} Regs
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-[var(--surface)] border border-[var(--border-color)] w-full max-w-lg shadow-2xl flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-[var(--border-color)] flex justify-between items-center">
              <h2 className="font-display text-xl uppercase tracking-widest text-[var(--text-primary)]">Create New Event</h2>
              <button type="button" onClick={() => {
                setShowCreateModal(false);
                setCreatePosterFile(null);
                setCreatePosterPreview('');
              }} className="text-[var(--muted)] hover:text-white">&times;</button>
            </div>
            
            <form onSubmit={handleCreate} className="p-6 overflow-y-auto">
              {createError && (
                <div className="bg-red-500/10 border border-red-500/50 text-red-600 dark:text-red-400 p-4 mb-4 rounded text-sm">
                  {createError}
                </div>
              )}
              
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-display tracking-widest uppercase text-[var(--muted)] mb-2">Event Name *</label>
                  <Input required value={createForm.event_name} onChange={handleNameChange} placeholder="e.g. Mr. Tamil Nadu 2026" />
                </div>
                
                <div>
                  <label className="block text-xs font-display tracking-widest uppercase text-[var(--muted)] mb-2">URL Slug *</label>
                  <Input required value={createForm.slug} onChange={e => setCreateForm({...createForm, slug: e.target.value})} placeholder="e.g. mr-tamil-nadu-2026" />
                </div>

                <div>
                  <label className="block text-xs font-display tracking-widest uppercase text-[var(--muted)] mb-2">Event Date *</label>
                  <Input type="date" required value={createForm.event_date} onChange={e => setCreateForm({...createForm, event_date: e.target.value})} />
                </div>

                <div>
                  <label className="block text-xs font-display tracking-widest uppercase text-[var(--muted)] mb-2">Venue *</label>
                  <Input required value={createForm.venue} onChange={e => setCreateForm({...createForm, venue: e.target.value})} placeholder="e.g. Chennai Trade Centre" />
                </div>

                <div>
                  <label className="block text-xs font-display tracking-widest uppercase text-[var(--muted)] mb-2">Initial Status *</label>
                  <Select required value={createForm.status} onChange={e => setCreateForm({...createForm, status: e.target.value})}>
                    <option value="upcoming">Upcoming</option>
                    <option value="open">Registration Open</option>
                    <option value="closed">Closed</option>
                  </Select>
                </div>

                <div className="border-t border-[var(--border-color)] pt-4 mt-4">
                  <label className="block text-xs font-display tracking-widest uppercase text-[var(--muted)] mb-2">EVENT POSTER *</label>
                  <p className="text-xs text-[var(--muted)] mb-4">500 × 700 px (Portrait)</p>
                  <div className="flex gap-4 items-start">
                    <div className="w-[120px] shrink-0 border border-dashed border-[var(--border-color)] bg-black/20 flex flex-col items-center justify-center relative overflow-hidden" style={{ aspectRatio: '5/7' }}>
                      {createPosterPreview ? (
                        <img src={createPosterPreview} alt="Poster preview" className="absolute inset-0 w-full h-full object-cover" />
                      ) : (
                        <span className="text-[10px] text-[var(--muted)] text-center px-2">No Poster</span>
                      )}
                    </div>
                    <div className="flex-grow">
                      <Input 
                        type="file" 
                        required 
                        accept="image/jpeg,image/png,image/webp" 
                        onChange={(e) => {
                          if (e.target.files && e.target.files[0]) {
                            const file = e.target.files[0];
                            setCreatePosterFile(file);
                            setCreatePosterPreview(URL.createObjectURL(file));
                          } else {
                            setCreatePosterFile(null);
                            setCreatePosterPreview('');
                          }
                        }} 
                      />
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-8 flex justify-end gap-4">
                <Button type="button" variant="secondary" onClick={() => {
                  setShowCreateModal(false);
                  setCreatePosterFile(null);
                  setCreatePosterPreview('');
                }} disabled={createLoading}>
                  Cancel
                </Button>
                <Button type="submit" variant="primary" disabled={createLoading} className="min-w-[120px]">
                  {createLoading ? <Loader2 size={16} className="animate-spin" /> : 'Create'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminShell>
  );
}
