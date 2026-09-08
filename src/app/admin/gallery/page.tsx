"use client";

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import AdminShell from '@/components/admin/AdminShell';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Loader2, Plus, Image as ImageIcon, Calendar } from 'lucide-react';
import { resolveImageUrl } from '@/lib/api';

export default function AdminGalleryPage() {
  const router = useRouter();
  const [albums, setAlbums] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ title: '', date: '', status: 1, event_id: '' });
  const [editingAlbum, setEditingAlbum] = useState<any>(null);
  const [eventsList, setEventsList] = useState<any[]>([]);

  const fetchAlbums = useCallback(async () => {
    setLoading(true);
    try {
      const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;
      const res = await fetch(`${API_BASE}/admin/gallery/index.php`, { credentials: 'include' });
      const json = await res.json();
      if (json.success) setAlbums(json.data);
      else throw new Error(json.message);
      
      const eventsRes = await fetch(`${API_BASE}/events/index.php`, { cache: 'no-store' });
      const eventsJson = await eventsRes.json();
      if (eventsJson.success) setEventsList(eventsJson.data || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAlbums();
  }, [fetchAlbums]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;
      const endpoint = editingAlbum ? 'update.php' : 'create.php';
      const payload = editingAlbum ? { ...form, id: editingAlbum.id, cover_image: editingAlbum.cover_image } : form;
      
      const res = await fetch(`${API_BASE}/admin/gallery/${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(payload)
      });
      const json = await res.json();
      if (json.success) {
        setShowModal(false);
        if (!editingAlbum && json.data?.id) {
          router.push(`/admin/gallery/${json.data.id}`);
        } else {
          fetchAlbums();
        }
      } else throw new Error(json.message);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this album? This will permanently delete all its images.")) return;
    try {
      const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;
      const res = await fetch(`${API_BASE}/admin/gallery/delete.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ id })
      });
      const json = await res.json();
      if (json.success) fetchAlbums();
      else alert(json.message);
    } catch (err: any) {
      alert(err.message);
    }
  };

  if (loading) return <AdminShell title="Gallery"><div className="p-12 flex justify-center"><Loader2 className="animate-spin w-8 h-8 text-[var(--gold)]" /></div></AdminShell>;

  return (
    <AdminShell title="Gallery Management">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="font-display text-lg uppercase tracking-widest text-[var(--text-primary)]">Manage Official Championship Albums and Photography.</h2>
        </div>
        <Button onClick={() => { setEditingAlbum(null); setForm({ title: '', date: '', status: 1, event_id: '' }); setShowModal(true); }} variant="primary" className="text-xs h-10 px-6 uppercase tracking-widest">
          <Plus size={16} className="mr-2" /> Create Album
        </Button>
      </div>

      {error && <div className="bg-red-500/10 text-red-500 p-4 mb-6">{error}</div>}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {albums.map(album => (
          <div key={album.id} className="bg-[var(--surface)] border border-[var(--border-color)] group flex flex-col">
            <div 
              className="aspect-video bg-black/20 overflow-hidden relative cursor-pointer"
              onClick={() => router.push(`/admin/gallery/${album.id}`)}
            >
              {album.cover_image ? (
                <img src={resolveImageUrl(album.cover_image) || '/assets/wff_hero_banner.png'} alt={album.title} className="w-full h-full object-cover transition-transform group-hover:scale-105" />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-[var(--muted)]">
                  <ImageIcon size={32} className="mb-2 opacity-50" />
                  <span className="text-xs uppercase tracking-widest">No Cover</span>
                </div>
              )}
              <div className="absolute top-2 right-2 bg-black/60 backdrop-blur text-white text-[10px] px-2 py-1 rounded-sm flex items-center">
                <ImageIcon size={12} className="mr-1" /> {album.image_count}
              </div>
              {!album.status && (
                <div className="absolute top-2 left-2 bg-red-500/80 text-white text-[10px] px-2 py-1 rounded-sm uppercase tracking-widest">Draft</div>
              )}
            </div>
            <div className="p-4 flex flex-col flex-1">
              <h3 className="font-display font-semibold uppercase tracking-wider text-[var(--text-primary)] truncate mb-1" title={album.title}>{album.title}</h3>
              {album.date && <div className="flex items-center text-[var(--muted)] text-xs mb-4"><Calendar size={12} className="mr-1" /> {album.date}</div>}
              <div className="mt-auto flex justify-between pt-4 border-t border-[var(--border-color)]">
                <Button variant="secondary" className="h-8 px-3 text-xs" onClick={() => router.push(`/admin/gallery/${album.id}`)}>Open</Button>
                <div className="flex gap-2">
                  <Button variant="secondary" className="h-8 px-3 text-xs" onClick={() => { setEditingAlbum(album); setForm({ title: album.title, date: album.date || '', status: album.status, event_id: album.event_id ? String(album.event_id) : '' }); setShowModal(true); }}>Edit</Button>
                  <Button variant="secondary" className="h-8 px-3 text-xs text-red-400 hover:text-red-300" onClick={() => handleDelete(album.id)}>Delete</Button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {albums.length === 0 && (
        <div className="text-center py-16 border border-[var(--border-color)] bg-[var(--surface)] text-[var(--muted)] flex flex-col items-center">
          <ImageIcon size={48} className="mb-4 opacity-30" />
          <h3 className="font-display text-lg uppercase tracking-widest text-white mb-2">No Albums Yet</h3>
          <p className="text-sm max-w-sm mb-6">Create an album to start uploading official championship photography.</p>
          <Button onClick={() => { setEditingAlbum(null); setForm({ title: '', date: '', status: 1, event_id: '' }); setShowModal(true); }} variant="primary" className="text-xs h-10 px-6 uppercase tracking-widest">
            <Plus size={16} className="mr-2" /> Create Album
          </Button>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-[var(--surface)] border border-[var(--border-color)] w-full max-w-md p-6 shadow-2xl">
            <h2 className="font-display text-lg uppercase tracking-widest text-[var(--text-primary)] mb-6">{editingAlbum ? 'Edit Album' : 'Create Album'}</h2>
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-display tracking-widest uppercase text-[var(--muted)] mb-2">Link to Event (Optional)</label>
                <Select value={form.event_id} onChange={e => {
                  const evId = e.target.value;
                  const ev = eventsList.find(x => x.id.toString() === evId);
                  if (ev) {
                    setForm({...form, event_id: evId, title: ev.title, date: ev.date});
                  } else {
                    setForm({...form, event_id: ''});
                  }
                }}>
                  <option value="">-- No Event Link (Custom Album) --</option>
                  {eventsList.map(ev => (
                    <option key={ev.id} value={ev.id}>{ev.title}</option>
                  ))}
                </Select>
                <p className="text-[10px] text-[var(--muted)] mt-1">If selected, the album will automatically use the event's title and date.</p>
              </div>

              <div>
                <label className="block text-xs font-display tracking-widest uppercase text-[var(--muted)] mb-2">Title *</label>
                <Input required value={form.title} onChange={e => setForm({...form, title: e.target.value})} placeholder="e.g. WFF Rudra Classic 2026" disabled={!!form.event_id} />
              </div>
              <div>
                <label className="block text-xs font-display tracking-widest uppercase text-[var(--muted)] mb-2">Event Date</label>
                <Input type="date" value={form.date} onChange={e => setForm({...form, date: e.target.value})} disabled={!!form.event_id} />
              </div>
              <div>
                <label className="block text-xs font-display tracking-widest uppercase text-[var(--muted)] mb-2">Status</label>
                <Select value={form.status} onChange={e => setForm({...form, status: parseInt(e.target.value)})}>
                  <option value={1}>Published</option>
                  <option value={0}>Draft / Hidden</option>
                </Select>
              </div>
              <div className="flex justify-end gap-2 pt-4">
                <Button type="button" variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
                <Button type="submit" variant="primary" disabled={saving}>{saving ? 'Saving...' : 'Save Album'}</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminShell>
  );
}
