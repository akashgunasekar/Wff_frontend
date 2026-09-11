
"use client";

import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import AdminShell from '@/components/admin/AdminShell';
import { Button } from '@/components/ui/Button';
import { Loader2, ArrowLeft, Upload, Trash2, Image as ImageIcon, Star, CheckCircle2, XCircle, X } from 'lucide-react';
import { resolveImageUrl } from '@/lib/api';
import { use } from 'react';

interface UploadItem {
  id: string;
  file: File;
  progress: number;
  status: 'pending' | 'uploading' | 'success' | 'error';
  error?: string;
}

export default function AdminGalleryDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const [album, setAlbum] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [uploadQueue, setUploadQueue] = useState<UploadItem[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchAlbum = useCallback(async () => {
    try {
      const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || '/api';
      const res = await fetch(`${API_BASE}/admin/gallery/show.php?id=${resolvedParams.id}`, { credentials: 'include' });
      const json = await res.json();
      if (json.success) setAlbum(json.data);
      else {
        if (res.status === 404) router.push('/admin/gallery');
        throw new Error(json.message);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [resolvedParams.id, router]);

  useEffect(() => {
    fetchAlbum();
  }, [fetchAlbum]);

  const processQueue = async (queue: UploadItem[]) => {
    const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || '/api';
    let refreshNeeded = false;

    for (const item of queue) {
      if (item.status !== 'pending' && item.status !== 'error') continue;

      setUploadQueue(prev => prev.map(q => q.id === item.id ? { ...q, status: 'uploading', progress: 10 } : q));

      const formData = new FormData();
      formData.append('album_id', resolvedParams.id);
      formData.append('image', item.file);

      try {
        const res = await fetch(`${API_BASE}/admin/gallery/images/upload.php`, {
          method: 'POST',
          credentials: 'include',
          body: formData
        });
        const json = await res.json();
        
        if (json.success) {
          setUploadQueue(prev => prev.map(q => q.id === item.id ? { ...q, status: 'success', progress: 100 } : q));
          refreshNeeded = true;
        } else {
          setUploadQueue(prev => prev.map(q => q.id === item.id ? { ...q, status: 'error', error: json.message } : q));
        }
      } catch (err: any) {
        setUploadQueue(prev => prev.map(q => q.id === item.id ? { ...q, status: 'error', error: 'Network error' } : q));
      }
    }

    if (refreshNeeded) {
      fetchAlbum();
    }
  };

  const handleFiles = (files: FileList | File[]) => {
    const newItems: UploadItem[] = Array.from(files).map(file => ({
      id: Math.random().toString(36).substring(7),
      file,
      progress: 0,
      status: 'pending'
    }));
    
    setUploadQueue(prev => {
      const combined = [...prev, ...newItems];
      processQueue(combined);
      return combined;
    });
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const removeQueueItem = (id: string) => {
    setUploadQueue(prev => prev.filter(q => q.id !== id));
  };

  const retryQueueItem = (id: string) => {
    setUploadQueue(prev => {
      const newState = prev.map(q => q.id === id ? { ...q, status: 'pending' as const, error: undefined } : q);
      processQueue(newState.filter(q => q.id === id));
      return newState;
    });
  };

  const clearSuccessful = () => {
    setUploadQueue(prev => prev.filter(q => q.status !== 'success'));
  };

  const handleDeleteImage = async (imageId: number) => {
    if (!confirm("Permanently delete this image?")) return;
    try {
      const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || '/api';
      const res = await fetch(`${API_BASE}/admin/gallery/images/delete.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ id: imageId })
      });
      const json = await res.json();
      if (json.success) fetchAlbum();
      else alert(json.message);
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleSetCover = async (imageUrl: string) => {
    try {
      const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || '/api';
      const payload = {
        id: album.id,
        title: album.title,
        date: album.date,
        status: album.status,
        cover_image: imageUrl
      };
      
      const res = await fetch(`${API_BASE}/admin/gallery/update.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(payload)
      });
      const json = await res.json();
      if (json.success) fetchAlbum();
      else alert(json.message);
    } catch (err: any) {
      alert(err.message);
    }
  };

  if (loading) return <AdminShell title="Album"><div className="p-12 flex justify-center"><Loader2 className="animate-spin w-8 h-8 text-[var(--gold)]" /></div></AdminShell>;
  if (!album) return null;

  return (
    <AdminShell title={`Album: ${album.title}`}>
      <div className="flex items-center gap-4 mb-6">
        <Button variant="secondary" className="h-10 px-4" onClick={() => router.push('/admin/gallery')}>
          <ArrowLeft size={16} className="mr-2" /> Back
        </Button>
        <div>
          <h2 className="font-display text-2xl font-bold uppercase tracking-widest text-[var(--text-primary)]">{album.title}</h2>
          <div className="text-sm text-[var(--muted)]">{album.images?.length || 0} images • {album.date}</div>
        </div>
      </div>

      <div 
        className={`bg-[var(--surface)] border-2 border-dashed ${isDragging ? 'border-[var(--gold)] bg-[var(--gold)]/5' : 'border-[var(--border-color)]'} p-8 mb-8 text-center transition-colors rounded-lg cursor-pointer`}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <Upload size={32} className={`mx-auto mb-4 ${isDragging ? 'text-[var(--gold)]' : 'text-[var(--muted)]'}`} />
        <h3 className="font-display text-lg uppercase tracking-widest text-[var(--text-primary)] mb-2">Drag & Drop Images</h3>
        <p className="text-sm text-[var(--muted)]">or click here to select files. Max 5MB per file (JPEG, PNG, WebP).</p>
        <input 
          type="file" 
          ref={fileInputRef} 
          multiple 
          accept="image/jpeg,image/png,image/webp" 
          className="hidden" 
          onChange={e => e.target.files && handleFiles(e.target.files)} 
        />
      </div>

      {uploadQueue.length > 0 && (
        <div className="bg-[var(--surface)] border border-[var(--border-color)] p-4 rounded-lg mb-8">
          <div className="flex justify-between items-center mb-4 border-b border-[var(--border-color)] pb-2">
            <h4 className="font-display text-sm uppercase tracking-widest text-[var(--text-primary)]">Upload Queue</h4>
            {uploadQueue.some(q => q.status === 'success') && (
              <button onClick={clearSuccessful} className="text-xs text-[var(--gold)] hover:underline">Clear Successful</button>
            )}
          </div>
          <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
            {uploadQueue.map(item => (
              <div key={item.id} className="flex items-center justify-between bg-black/20 p-2 rounded text-sm">
                <div className="flex items-center gap-3 overflow-hidden flex-1">
                  {item.status === 'pending' && <Loader2 size={16} className="text-[var(--muted)]" />}
                  {item.status === 'uploading' && <Loader2 size={16} className="animate-spin text-[var(--gold)]" />}
                  {item.status === 'success' && <CheckCircle2 size={16} className="text-green-500" />}
                  {item.status === 'error' && <XCircle size={16} className="text-red-500" />}
                  <span className="truncate max-w-[200px] md:max-w-[400px] text-[var(--text-primary)]">{item.file.name}</span>
                  {item.status === 'error' && <span className="text-xs text-red-400 truncate">{item.error}</span>}
                </div>
                <div className="flex items-center gap-2">
                  {item.status === 'error' && (
                    <button onClick={() => retryQueueItem(item.id)} className="text-xs bg-[var(--gold)]/20 text-[var(--gold)] px-2 py-1 rounded">Retry</button>
                  )}
                  {(item.status === 'error' || item.status === 'success') && (
                    <button onClick={() => removeQueueItem(item.id)} className="text-[var(--muted)] hover:text-white p-1"><X size={14} /></button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {album.images?.map((img: any) => (
          <div key={img.id} className="relative group bg-black border border-[var(--border-color)] aspect-square overflow-hidden rounded-md">
            <img src={resolveImageUrl(img.image) || '/assets/wff_hero_banner.png'} alt="Gallery" className="w-full h-full object-cover transition-opacity group-hover:opacity-50" />
            
            {/* Overlay Actions */}
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity bg-black/70">
              <Button 
                variant="secondary" 
                className="h-8 px-3 text-xs w-28 flex justify-center border-white/20 hover:border-white/40"
                onClick={() => handleSetCover(img.image)}
              >
                Set Cover
              </Button>
              <Button 
                variant="secondary" 
                className="h-8 px-3 text-xs w-28 flex justify-center text-red-400 border-red-500/30 hover:border-red-500/60"
                onClick={() => handleDeleteImage(img.id)}
              >
                Delete
              </Button>
            </div>

            {/* Cover Badge */}
            {album.cover_image === img.image && (
              <div className="absolute top-2 left-2 bg-[var(--gold)] text-[var(--deep-navy)] px-2 py-1 text-[10px] font-bold uppercase tracking-widest rounded-sm flex items-center shadow-md z-10">
                <Star size={10} className="mr-1 fill-current" /> Cover
              </div>
            )}
          </div>
        ))}
      </div>

      {(!album.images || album.images.length === 0) && (
        <div className="text-center py-20 border border-[var(--border-color)] bg-[var(--surface)] text-[var(--muted)] flex flex-col items-center rounded-lg">
          <ImageIcon size={48} className="mb-4 opacity-30" />
          <h3 className="font-display text-lg uppercase tracking-widest text-white mb-2">Album is Empty</h3>
          <p className="text-sm max-w-sm">Upload official photos to populate this album.</p>
        </div>
      )}
    </AdminShell>
  );
}
