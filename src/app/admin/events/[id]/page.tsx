"use client";

import { useState, useEffect, useCallback, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import AdminShell from '@/components/admin/AdminShell';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { ChevronLeft, Loader2, Save, Trash2, Plus, AlertTriangle, X, Edit3, CheckSquare, Square, Users } from 'lucide-react';

export default function AdminEventDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const [event, setEvent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const [deleting, setDeleting] = useState(false);

  // Category Modal State (Custom Category)
  const [showCatModal, setShowCatModal] = useState(false);
  const [editingCat, setEditingCat] = useState<any>(null);
  const [catForm, setCatForm] = useState({
    name: '', short_description: '', age_group: '', gender: 'Male', entry_fee: '', 
    availability: 'open', structure_type: 'single', weight_divisions: [] as string[], height_divisions: [] as string[], display_order: 0
  });
  const [catSaving, setCatSaving] = useState(false);
  const [catError, setCatError] = useState('');

  // Master Category Selection State
  const [masterCategories, setMasterCategories] = useState<any[]>([]);
  const [showMasterModal, setShowMasterModal] = useState(false);
  const [selectedMasterIds, setSelectedMasterIds] = useState<string[]>([]);
  const [masterLoading, setMasterLoading] = useState(false);
  const [masterSaving, setMasterSaving] = useState(false);
  const [masterError, setMasterError] = useState('');

  // Inline Bulk Pricing State
  const [isEditPricing, setIsEditPricing] = useState(false);
  const [pricingForm, setPricingForm] = useState<Record<number, { entry_fee: string, availability: string }>>({});
  const [pricingSaving, setPricingSaving] = useState(false);

  // Officials Modal State
  const [masterOfficials, setMasterOfficials] = useState<any[]>([]);
  const [showOfficialModal, setShowOfficialModal] = useState(false);
  const [selectedOfficialIds, setSelectedOfficialIds] = useState<number[]>([]);
  const [officialLoading, setOfficialLoading] = useState(false);
  const [officialSaving, setOfficialSaving] = useState(false);
  const [officialUpdating, setOfficialUpdating] = useState(false);

  const fetchEvent = useCallback(async () => {
    try {
      const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;
      const res = await fetch(`${API_BASE}/admin/events/show.php?id=${resolvedParams.id}`, {
        credentials: 'include'
      });
      const json = await res.json();
      if (json.success) {
        setEvent(json.data);
      } else {
        throw new Error(json.message);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [resolvedParams.id]);

  useEffect(() => {
    fetchEvent();
  }, [fetchEvent]);

  const handleBannerUpload = async (e: React.ChangeEvent<HTMLInputElement>, idx: number) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    
    const formData = new FormData();
    formData.append('image', file);

    try {
      const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || '';
      const res = await fetch(`${API_BASE}/admin/events/upload-banner.php`, {
        method: 'POST',
        credentials: 'include',
        body: formData
      });
      const json = await res.json();
      if (json.success) {
        const arr = [...(event.content_meta?.winner_slides || [])];
        arr[idx].photo = API_BASE.replace('/api', '') + json.data.image;
        setEvent({...event, content_meta: {...event.content_meta, winner_slides: arr}});
      } else {
        alert(json.message);
      }
    } catch (err: any) {
      alert("Failed to upload banner: " + err.message);
    }
  };

  // Handle Event Details Update
  const handleUpdateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');
    try {
      const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;
      const res = await fetch(`${API_BASE}/admin/events/update.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          id: event.id, event_name: event.event_name, slug: event.slug, event_date: event.event_date,
          venue: event.venue, status: event.status, banner_image: event.banner_image || '', description: event.description || '',
          tan_spray_price: event.tan_spray_price || 1000,
          cash_enabled: event.cash_enabled || false,
          content_meta: event.content_meta
        })
      });
      const json = await res.json();
      if (json.success) {
        setSuccess("Event updated successfully.");
        fetchEvent();
      } else {
        throw new Error(json.message);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteEvent = async () => {
    if (!confirm("Are you sure you want to delete this event? This cannot be undone.")) return;
    setDeleting(true);
    try {
      const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;
      const res = await fetch(`${API_BASE}/admin/events/delete.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ id: event.id })
      });
      const json = await res.json();
      if (json.success) {
        router.push('/admin/events');
      } else {
        throw new Error(json.message);
      }
    } catch (err: any) {
      setError(err.message);
      setDeleting(false);
    }
  };

  // Custom Category Handling
  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    setCatSaving(true);
    setCatError('');
    if (catForm.structure_type === 'weight' && catForm.weight_divisions.some(d => !d.trim())) {
      setCatError("Please fill out all weight division fields or remove empty ones.");
      setCatSaving(false); return;
    }
    if (catForm.structure_type === 'height' && catForm.height_divisions.some(d => !d.trim())) {
      setCatError("Please fill out all height division fields or remove empty ones.");
      setCatSaving(false); return;
    }
    try {
      const isEdit = !!editingCat;
      const endpoint = isEdit ? 'update.php' : 'create.php';
      const payload = { ...catForm, event_id: event.id, id: editingCat?.id };
      
      const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;
      const res = await fetch(`${API_BASE}/admin/event-categories/${endpoint}`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'include',
        body: JSON.stringify(payload)
      });
      const json = await res.json();
      if (json.success) {
        setShowCatModal(false);
        fetchEvent();
      } else {
        throw new Error(json.message);
      }
    } catch (err: any) {
      setCatError(err.message);
    } finally {
      setCatSaving(false);
    }
  };

  const handleDeleteCategory = async (categoryId: number) => {
    if (!confirm("Remove this category from the event? Cannot be undone.")) return;
    try {
      const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;
      const res = await fetch(`${API_BASE}/admin/event-categories/delete.php`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'include',
        body: JSON.stringify({ id: categoryId })
      });
      const json = await res.json();
      if (json.success) {
        fetchEvent();
      } else {
        alert(json.message);
      }
    } catch (err: any) {
      alert(err.message);
    }
  };

  // Master Categories Handling
  const handleOpenMasterModal = async () => {
    setShowMasterModal(true);
    setMasterLoading(true);
    setMasterError('');
    try {
      const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;
      const res = await fetch(`${API_BASE}/admin/categories/index.php`, { credentials: 'include' });
      const json = await res.json();
      if (json.success) {
        setMasterCategories(json.data.filter((c: any) => c.status !== 'inactive'));
        const existingNames = event.categories.map((c:any) => c.name.toLowerCase());
        const preSelected = json.data
          .filter((c:any) => existingNames.includes(c.name.toLowerCase()))
          .map((c:any) => c.id);
        setSelectedMasterIds(preSelected);
      }
    } catch (err: any) {
      setMasterError(err.message);
    } finally {
      setMasterLoading(false);
    }
  };

  const handleToggleMaster = (id: string) => {
    setSelectedMasterIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const handleAttachMasters = async () => {
    setMasterSaving(true);
    try {
      const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;
      const res = await fetch(`${API_BASE}/admin/event-categories/attach-master.php`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'include',
        body: JSON.stringify({ event_id: event.id, master_ids: selectedMasterIds })
      });
      const json = await res.json();
      if (json.success) {
        setShowMasterModal(false);
        fetchEvent();
      } else {
        throw new Error(json.message);
      }
    } catch (err: any) {
      setMasterError(err.message);
    } finally {
      setMasterSaving(false);
    }
  };

  // Bulk Pricing Handling
  const startEditPricing = () => {
    const initForm: any = {};
    event.categories.forEach((cat: any) => {
      initForm[cat.id] = { entry_fee: cat.entry_fee || '', availability: cat.availability || 'open' };
    });
    setPricingForm(initForm);
    setIsEditPricing(true);
  };

  const handleSavePricing = async () => {
    setPricingSaving(true);
    try {
      const pricingArray = Object.keys(pricingForm).map(id => ({
        id: parseInt(id),
        entry_fee: pricingForm[parseInt(id)].entry_fee,
        availability: pricingForm[parseInt(id)].availability
      }));
      
      const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;
      const res = await fetch(`${API_BASE}/admin/event-categories/update-pricing.php`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'include',
        body: JSON.stringify({ event_id: event.id, pricing: pricingArray })
      });
      const json = await res.json();
      if (json.success) {
        setIsEditPricing(false);
        fetchEvent();
      } else {
        throw new Error(json.message);
      }
    } catch (err: any) {
      alert(err.message);
    } finally {
      setPricingSaving(false);
    }
  };

  // Event Officials Handling
  const handleOpenOfficialModal = async () => {
    setShowOfficialModal(true);
    setOfficialLoading(true);
    try {
      const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;
      const res = await fetch(`${API_BASE}/admin/officials/index.php`, { credentials: 'include' });
      const json = await res.json();
      if (json.success) {
        setMasterOfficials(json.data.filter((o: any) => o.status == 1));
        const existingIds = event.officials ? event.officials.map((o:any) => parseInt(o.official_id)) : [];
        setSelectedOfficialIds(existingIds);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setOfficialLoading(false);
    }
  };

  const handleToggleOfficial = (id: number) => {
    setSelectedOfficialIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const handleUpdateOfficialsList = async (newList: any[]) => {
     setOfficialUpdating(true);
     try {
       const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;
       const res = await fetch(`${API_BASE}/admin/events/update-officials.php`, {
         method: 'POST', headers: {'Content-Type': 'application/json'}, credentials: 'include',
         body: JSON.stringify({ event_id: event.id, officials: newList })
       });
       const json = await res.json();
       if (json.success) {
         fetchEvent();
       } else throw new Error(json.message);
     } catch(err:any) {
       alert(err.message);
     } finally {
       setOfficialUpdating(false);
     }
  };

  const handleSaveOfficialSelection = async () => {
     setOfficialSaving(true);
     try {
       const existingDict: Record<number, any> = {};
       (event.officials || []).forEach((o:any) => { existingDict[o.official_id] = o; });
       
       const newOfficials = selectedOfficialIds.map((id, index) => {
          if (existingDict[id]) return { ...existingDict[id], display_order: index };
          return { official_id: id, role: 'Judge', display_order: index };
       });

       const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;
       const res = await fetch(`${API_BASE}/admin/events/update-officials.php`, {
         method: 'POST', headers: {'Content-Type': 'application/json'}, credentials: 'include',
         body: JSON.stringify({ event_id: event.id, officials: newOfficials })
       });
       const json = await res.json();
       if (json.success) {
         setShowOfficialModal(false);
         fetchEvent();
       } else throw new Error(json.message);
     } catch(err:any) {
       alert(err.message);
     } finally {
       setOfficialSaving(false);
     }
  };

  if (loading) {
    return <AdminShell title="Event Details"><div className="p-12 flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-[#C9A44A]" /></div></AdminShell>;
  }
  if (!event) {
    return <AdminShell title="Event Details"><div className="p-12 text-center text-[#040A12]/60">Event not found.</div></AdminShell>;
  }

  return (
    <AdminShell title="Event Details">
      <div className="mb-6 flex justify-between items-center">
        <Link href="/admin/events" className="inline-flex items-center text-xs font-display tracking-widest uppercase text-[#040A12]/60 hover:text-[#040A12] transition-colors">
          <ChevronLeft size={16} className="mr-1" /> Back to Events
        </Link>
      </div>

      {error && <div className="bg-red-500/10 border border-red-500/50 text-red-600 dark:text-red-400 p-4 mb-6 rounded text-sm flex items-center"><AlertTriangle size={16} className="mr-2 flex-shrink-0" />{error}</div>}
      {success && <div className="bg-green-500/10 border border-green-500/50 text-green-600 dark:text-green-400 p-4 mb-6 rounded text-sm">{success}</div>}

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div className="xl:col-span-1 space-y-6">
          <div className="bg-white rounded-xl border border-black/5 shadow-sm p-6">
            <h2 className="font-display text-lg uppercase tracking-widest text-[#040A12] mb-6 border-b border-black/5 pb-4">Event Stats</h2>
            <div className="space-y-4">
              <div>
                <div className="text-xs uppercase tracking-widest text-[#040A12]/60 mb-1">Registrations</div>
                <div className="text-2xl font-display">{event.registration_count}</div>
              </div>
              <div>
                <div className="text-xs uppercase tracking-widest text-[#040A12]/60 mb-1">Captured Payments</div>
                <div className="text-2xl font-display text-green-500">{event.payment_count}</div>
              </div>
            </div>
            {event.registration_count > 0 && (
              <div className="mt-6 p-4 bg-yellow-500/10 border border-yellow-500/30 text-yellow-600 text-xs rounded">
                This event has active registrations. Deletion is disabled to protect federation data. Use the status control to Archive or Cancel instead.
              </div>
            )}
            <div className="mt-8 border-t border-black/5 pt-6">
              <Button variant="secondary" className="w-full text-red-500 border-red-500/30 hover:bg-red-500/10 uppercase tracking-widest text-xs h-10" onClick={handleDeleteEvent} disabled={deleting || event.registration_count > 0}>
                <Trash2 size={14} className="mr-2" /> Delete Event
              </Button>
            </div>
          </div>
        </div>
        
        <div className="xl:col-span-2 space-y-8">
          <div className="bg-white rounded-xl border border-black/5 shadow-sm p-6">
            <h2 className="font-display text-lg uppercase tracking-widest text-[#040A12] mb-6 border-b border-black/5 pb-4">Edit Details</h2>
            <form onSubmit={handleUpdateEvent} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-display tracking-widest uppercase text-[#040A12]/60 mb-2">Event Name *</label>
                  <Input required value={event.event_name} onChange={e => setEvent({...event, event_name: e.target.value})} />
                </div>
                <div>
                  <label className="block text-xs font-display tracking-widest uppercase text-[#040A12]/60 mb-2">URL Slug *</label>
                  <Input required value={event.slug} onChange={e => setEvent({...event, slug: e.target.value})} />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-display tracking-widest uppercase text-[#040A12]/60 mb-2">Event Date *</label>
                  <Input type="date" required value={event.event_date} onChange={e => setEvent({...event, event_date: e.target.value})} />
                </div>
                <div>
                  <label className="block text-xs font-display tracking-widest uppercase text-[#040A12]/60 mb-2">Status *</label>
                  <Select required value={event.status} onChange={e => setEvent({...event, status: e.target.value})}>
                    <option value="open">Registration Open</option>
                    <option value="upcoming">Upcoming</option>
                    <option value="closed">Closed</option>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-display tracking-widest uppercase text-[#040A12]/60 mb-2">Venue *</label>
                  <Input required value={event.venue} onChange={e => setEvent({...event, venue: e.target.value})} />
                </div>
                <div>
                  <label className="block text-xs font-display tracking-widest uppercase text-[#040A12]/60 mb-2">Tan Spray Price (₹) *</label>
                  <Input type="number" required value={event.tan_spray_price || '1000'} onChange={e => setEvent({...event, tan_spray_price: e.target.value})} />
                </div>
              </div>
              
              <div className="grid grid-cols-1 gap-4">
                <div className="flex items-center gap-3 bg-gray-50 p-4 border border-black/5 rounded">
                  <input type="checkbox" id="cash_enabled" checked={event.cash_enabled || false} onChange={e => setEvent({...event, cash_enabled: e.target.checked})} className="w-5 h-5 accent-[#C9A44A]" />
                  <label htmlFor="cash_enabled" className="text-sm font-medium text-[#040A12] cursor-pointer">Enable Cash Payments at Desk</label>
                </div>
              </div>
              
              <div className="border-t border-black/5 pt-6">
                <label className="block text-xs font-display tracking-widest uppercase text-[#040A12]/60 mb-2">EVENT POSTER</label>
                <p className="text-xs text-[#040A12]/60 mb-4">500 × 700 px (Portrait)</p>
                <div className="flex gap-6 items-start">
                  <div className="w-[180px] shrink-0 border border-dashed border-black/5 bg-[#F4F5F7] flex flex-col items-center justify-center relative overflow-hidden" style={{ aspectRatio: '5/7' }}>
                    {event.banner_image ? (
                      <img src={event.banner_image} alt="Poster preview" className="absolute inset-0 w-full h-full object-cover" />
                    ) : (
                      <span className="text-xs text-[#040A12]/60">No Poster</span>
                    )}
                  </div>
                  <div className="flex-grow space-y-4">
                    <Input 
                      type="file" 
                      accept="image/jpeg,image/png,image/webp" 
                      onChange={async (e) => {
                        if (e.target.files && e.target.files[0]) {
                          const file = e.target.files[0];
                          const formData = new FormData();
                          formData.append('image', file);
                          try {
                            const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;
                            const res = await fetch(`${API_BASE}/admin/events/upload-poster.php`, {
                              method: 'POST',
                              body: formData,
                              credentials: 'include'
                            });
                            const json = await res.json();
                            if (json.success) {
                              setEvent({...event, banner_image: json.data.image});
                            } else {
                              alert(json.message);
                            }
                          } catch (err: any) {
                            alert(err.message);
                          }
                        }
                      }} 
                    />
                    {event.banner_image && (
                      <Button type="button" variant="secondary" className="text-xs h-8 text-red-500 border-red-500/20" onClick={() => setEvent({...event, banner_image: ''})}>
                        Remove Poster
                      </Button>
                    )}
                  </div>
                </div>
              </div>

              <div className="pt-4 flex justify-end">
                <Button type="submit" disabled={saving} className="bg-[#040A12] text-white hover:bg-[#040A12]/90 shadow-lg border-0 uppercase tracking-widest text-xs h-10 px-8">
                  {saving ? <Loader2 size={16} className="animate-spin" /> : <><Save size={16} className="mr-2" /> Save Changes</>}
                </Button>
              </div>
            </form>
          </div>


          {/* EVENT CONTENT CMS */}
          <div className="bg-white rounded-xl border border-black/5 shadow-sm p-6">
            <h2 className="font-display text-lg uppercase tracking-widest text-[#040A12] mb-6 border-b border-black/5 pb-4">Event Content (CMS)</h2>
            <div className="space-y-8">
              {/* About Section */}
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-[#C9A44A] uppercase tracking-widest">About This Event</h3>
                <Input 
                   value={event.content_meta?.about_title || 'About This Event'} 
                   onChange={e => setEvent({...event, content_meta: {...(event.content_meta || {}), about_title: e.target.value}})}
                   placeholder="Section Title (e.g. About This Event)"
                />
                <textarea 
                   className="w-full bg-[#F4F5F7] border border-black/5 text-[#040A12] p-3 rounded text-sm focus:ring-1 focus:ring-[#C9A44A]/50 focus:border-[#C9A44A]/50 outline-none min-h-[120px]"
                   value={event.content_meta?.about_content || ''}
                   onChange={e => setEvent({...event, content_meta: {...(event.content_meta || {}), about_content: e.target.value}})}
                   placeholder="Use HTML for rich text formatting..."
                ></textarea>
              </div>

              {/* Why This Event Matters */}
              <div className="space-y-4 pt-6 border-t border-black/5">
                <div className="flex justify-between items-center">
                   <h3 className="text-sm font-bold text-[#C9A44A] uppercase tracking-widest">Why This Event Matters</h3>
                   <Button type="button" variant="secondary" className="h-8 text-xs px-3" onClick={() => {
                      const current = event.content_meta?.why_highlights || [];
                      setEvent({...event, content_meta: {...(event.content_meta || {}), why_highlights: [...current, {icon: '', title: 'New Highlight', description: '', active: true, sort_order: current.length}]}});
                   }}>+ Add Highlight</Button>
                </div>
                <Input 
                   value={event.content_meta?.why_title || 'Why This Event Matters'} 
                   onChange={e => setEvent({...event, content_meta: {...(event.content_meta || {}), why_title: e.target.value}})}
                   placeholder="Section Title (e.g. Why This Event Matters)"
                />
                <Input 
                   value={event.content_meta?.why_intro || ''} 
                   onChange={e => setEvent({...event, content_meta: {...(event.content_meta || {}), why_intro: e.target.value}})}
                   placeholder="Intro description (optional)"
                />
                <div className="space-y-3">
                  {(event.content_meta?.why_highlights || []).map((highlight: any, idx: number) => (
                    <div key={idx} className="p-4 border border-black/5 bg-[#F4F5F7] flex gap-4">
                       <div className="flex-grow space-y-3">
                          <Input value={highlight.title} onChange={e => {
                             const arr = [...(event.content_meta?.why_highlights || [])];
                             arr[idx].title = e.target.value;
                             setEvent({...event, content_meta: {...event.content_meta, why_highlights: arr}});
                          }} placeholder="Highlight Title" />
                          <Input value={highlight.description} onChange={e => {
                             const arr = [...(event.content_meta?.why_highlights || [])];
                             arr[idx].description = e.target.value;
                             setEvent({...event, content_meta: {...event.content_meta, why_highlights: arr}});
                          }} placeholder="Description" />
                       </div>
                       <div className="shrink-0">
                          <Button type="button" variant="secondary" className="text-red-500 hover:text-red-400 h-10 w-10 p-0" onClick={() => {
                             const arr = event.content_meta.why_highlights.filter((_:any, i:number) => i !== idx);
                             setEvent({...event, content_meta: {...event.content_meta, why_highlights: arr}});
                          }}><Trash2 size={16} /></Button>
                       </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* FAQs */}
              <div className="space-y-4 pt-6 border-t border-black/5">
                <div className="flex justify-between items-center">
                   <h3 className="text-sm font-bold text-[#C9A44A] uppercase tracking-widest">FAQs</h3>
                   <Button type="button" variant="secondary" className="h-8 text-xs px-3" onClick={() => {
                      const current = event.content_meta?.faqs || [];
                      setEvent({...event, content_meta: {...(event.content_meta || {}), faqs: [...current, {question: 'New Question', answer: '', active: true, sort_order: current.length}]}});
                   }}>+ Add FAQ</Button>
                </div>
                <div className="space-y-3">
                  {(event.content_meta?.faqs || []).map((faq: any, idx: number) => (
                    <div key={idx} className="p-4 border border-black/5 bg-[#F4F5F7] flex gap-4">
                       <div className="flex-grow space-y-3">
                          <Input value={faq.question} onChange={e => {
                             const arr = [...(event.content_meta?.faqs || [])];
                             arr[idx].question = e.target.value;
                             setEvent({...event, content_meta: {...event.content_meta, faqs: arr}});
                          }} placeholder="Question" />
                          <textarea className="w-full bg-[#F4F5F7] border border-black/5 text-[#040A12] p-3 rounded text-sm focus:ring-1 focus:ring-[#C9A44A]/50 focus:border-[#C9A44A]/50 outline-none min-h-[80px]" value={faq.answer} onChange={e => {
                             const arr = [...(event.content_meta?.faqs || [])];
                             arr[idx].answer = e.target.value;
                             setEvent({...event, content_meta: {...event.content_meta, faqs: arr}});
                          }} placeholder="Answer (HTML supported)" />
                       </div>
                       <div className="shrink-0 flex flex-col gap-2">
                          <Button type="button" variant="secondary" className="text-red-500 hover:text-red-400 h-10 w-10 p-0" onClick={() => {
                             const arr = event.content_meta.faqs.filter((_:any, i:number) => i !== idx);
                             setEvent({...event, content_meta: {...event.content_meta, faqs: arr}});
                          }}><Trash2 size={16} /></Button>
                          <Button type="button" variant="secondary" className="h-10 w-10 p-0" onClick={() => {
                             const arr = [...(event.content_meta?.faqs || [])];
                             arr[idx].active = !arr[idx].active;
                             setEvent({...event, content_meta: {...event.content_meta, faqs: arr}});
                          }}>{faq.active ? <CheckSquare size={16} className="text-green-500"/> : <Square size={16} />}</Button>
                       </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Winner Announcements */}
              <div className="space-y-4 pt-6 border-t border-black/5">
                <div className="flex justify-between items-center">
                   <h3 className="text-sm font-bold text-[#C9A44A] uppercase tracking-widest">Winner Announcements (Max 3)</h3>
                   <Button type="button" variant="secondary" className="h-8 text-xs px-3" disabled={(event.content_meta?.winner_slides || []).length >= 3} onClick={() => {
                      const current = event.content_meta?.winner_slides || [];
                      if (current.length >= 3) return;
                      setEvent({...event, content_meta: {...(event.content_meta || {}), winner_slides: [...current, {photo: '', active: true, sort_order: current.length}]}});
                   }}>+ Add Banner</Button>
                </div>
                <p className="text-xs text-[#040A12]/60 -mt-2 mb-4">Upload up to 3 rectangular landscape banners (1200 × 500 px, 12:5 ratio).</p>
                
                <div className="space-y-6">
                  {(event.content_meta?.winner_slides || []).map((slide: any, idx: number) => (
                    <div key={idx} className="p-4 border border-black/5 bg-[#F4F5F7] flex flex-col gap-4 relative">
                       
                       <div className="flex justify-between items-center">
                         <span className="text-xs font-bold text-[#040A12] uppercase tracking-widest">Banner {String(idx + 1).padStart(2, '0')}</span>
                         
                         <div className="flex gap-2">
                           {/* Up / Down Reorder */}
                           <Button type="button" variant="secondary" className="h-8 w-8 p-0" disabled={idx === 0} onClick={() => {
                              const arr = [...(event.content_meta?.winner_slides || [])];
                              const temp = arr[idx];
                              arr[idx] = arr[idx - 1];
                              arr[idx - 1] = temp;
                              setEvent({...event, content_meta: {...event.content_meta, winner_slides: arr}});
                           }}>↑</Button>
                           <Button type="button" variant="secondary" className="h-8 w-8 p-0" disabled={idx === (event.content_meta?.winner_slides || []).length - 1} onClick={() => {
                              const arr = [...(event.content_meta?.winner_slides || [])];
                              const temp = arr[idx];
                              arr[idx] = arr[idx + 1];
                              arr[idx + 1] = temp;
                              setEvent({...event, content_meta: {...event.content_meta, winner_slides: arr}});
                           }}>↓</Button>
                           
                           {/* Delete */}
                           <Button type="button" variant="secondary" className="text-red-500 hover:text-red-400 h-8 w-8 p-0 ml-4" onClick={() => {
                              const arr = event.content_meta.winner_slides.filter((_:any, i:number) => i !== idx);
                              setEvent({...event, content_meta: {...event.content_meta, winner_slides: arr}});
                           }}><Trash2 size={16} /></Button>
                         </div>
                       </div>

                       <div className="w-full border border-dashed border-black/5 bg-[#F4F5F7] flex items-center justify-center relative overflow-hidden" style={{aspectRatio: '12/5'}}>
                          {slide.photo ? (
                            <>
                              <img src={slide.photo} className="w-full h-full object-contain" />
                              <label className="absolute bottom-4 right-4 bg-black/80 text-[#040A12] text-xs px-4 py-2 cursor-pointer rounded hover:bg-black uppercase font-bold tracking-widest">
                                Replace
                                <input type="file" className="hidden" accept="image/jpeg, image/png, image/webp" onChange={(e) => handleBannerUpload(e, idx)} />
                              </label>
                            </>
                          ) : (
                            <label className="text-sm font-bold text-[#C9A44A] uppercase tracking-widest cursor-pointer hover:text-[#040A12] transition-colors flex flex-col items-center gap-2">
                              <span>+ Upload Image</span>
                              <span className="text-[10px] text-[#040A12]/60">1200 × 500 px</span>
                              <input type="file" className="hidden" accept="image/jpeg, image/png, image/webp" onChange={(e) => handleBannerUpload(e, idx)} />
                            </label>
                          )}
                       </div>
                       
                       <div className="flex items-center gap-3 mt-2">
                         <span className="text-xs uppercase tracking-widest text-[#040A12]/60">Status:</span>
                         <Button type="button" variant="secondary" className="h-8 text-xs px-3" onClick={() => {
                             const arr = [...(event.content_meta?.winner_slides || [])];
                             arr[idx].active = !arr[idx].active;
                             setEvent({...event, content_meta: {...event.content_meta, winner_slides: arr}});
                          }}>{slide.active ? 'Active' : 'Inactive'}</Button>
                       </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Terms & Conditions */}
              <div className="space-y-4 pt-6 border-t border-black/5">
                <h3 className="text-sm font-bold text-[#C9A44A] uppercase tracking-widest">Terms & Conditions</h3>
                <textarea 
                   className="w-full bg-[#F4F5F7] border border-black/5 text-[#040A12] p-3 rounded text-sm focus:ring-1 focus:ring-[#C9A44A]/50 focus:border-[#C9A44A]/50 outline-none min-h-[160px]"
                   value={event.content_meta?.terms_content || ''}
                   onChange={e => setEvent({...event, content_meta: {...(event.content_meta || {}), terms_content: e.target.value}})}
                   placeholder="Use HTML for rich text formatting..."
                ></textarea>
              </div>

              <div className="pt-4 flex justify-end">
                <Button type="button" disabled={saving} className="bg-[#040A12] text-white hover:bg-[#040A12]/90 shadow-lg border-0 uppercase tracking-widest text-xs h-10 px-8" onClick={handleUpdateEvent}>
                  {saving ? <Loader2 size={16} className="animate-spin" /> : <><Save size={16} className="mr-2" /> Save Content</>}
                </Button>
              </div>
            </div>
          </div>

          {/* OFFICIALS SECTION */}
          <div className="bg-white rounded-xl border border-black/5 shadow-sm p-6">
            <div className="flex justify-between items-center border-b border-black/5 pb-4 mb-6">
              <div>
                 <h2 className="font-display text-lg uppercase tracking-widest text-[#040A12]">Officials & Judges</h2>
                 <p className="text-xs text-[#040A12]/60 mt-1">{(event.officials || []).length} assigned to event</p>
              </div>
              <Button variant="secondary" className="text-xs uppercase tracking-widest h-9" onClick={handleOpenOfficialModal}>
                <Users size={14} className="mr-2" /> Manage Officials
              </Button>
            </div>

            {(!event.officials || event.officials.length === 0) ? (
              <div className="text-center py-8 text-[#040A12]/60 border border-dashed border-black/5">
                <div className="text-sm uppercase tracking-widest mb-2 text-[#040A12]">NO OFFICIALS ASSIGNED</div>
                <div className="text-xs">Select officials from the master library to assign them a role in this event.</div>
              </div>
            ) : (
              <div className="space-y-3">
                 {(event.officials || []).map((off: any, idx: number) => (
                    <div key={off.official_id} className="flex flex-col sm:flex-row sm:items-center gap-4 p-4 bg-[#F4F5F7] border border-black/5 hover:border-[#C9A44A]/30 transition-colors">
                        <div className="flex items-center gap-4 flex-grow">
                            <div className="w-12 h-12 rounded-full bg-[#F4F5F7] overflow-hidden shrink-0 border border-black/5">
                               <img src={off.photo || '/assets/wff-india.png'} alt={off.name} className="w-full h-full object-cover" />
                            </div>
                            <div>
                               <div className="font-bold text-[15px] text-[#040A12]">{off.name}</div>
                               <div className="text-[10px] text-[#040A12]/60 uppercase tracking-widest mt-1">{off.designation}</div>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                           <Select value={off.role} onChange={(e) => {
                              const newOffs = [...event.officials];
                              newOffs[idx].role = e.target.value;
                              setEvent({...event, officials: newOffs});
                           }} className="h-9 text-xs py-0 w-40">
                              <option value="Head Judge">Head Judge</option>
                              <option value="Judge">Judge</option>
                              <option value="Special Guest">Special Guest</option>
                              <option value="Chief Guest">Chief Guest</option>
                              <option value="Organizer">Organizer</option>
                              <option value="Other">Other</option>
                           </Select>
                           <Button variant="secondary" className="h-9 w-9 p-0 shrink-0 text-red-500/70 hover:text-red-500 border-black/5" onClick={() => {
                               if(!confirm(`Remove ${off.name} from this event?`)) return;
                               const newOffs = event.officials.filter((_:any, i:number) => i !== idx);
                               handleUpdateOfficialsList(newOffs);
                           }}><Trash2 size={14}/></Button>
                        </div>
                    </div>
                 ))}
                 
                 <div className="flex justify-between items-center mt-4 pt-4 border-t border-black/5">
                    <p className="text-[10px] text-[#040A12]/60 uppercase tracking-widest">Officials display on the website in this order.</p>
                    <Button className="bg-[#040A12] text-white hover:bg-[#040A12]/90 shadow-lg border-0 h-9 text-xs uppercase px-6" disabled={officialUpdating} onClick={() => handleUpdateOfficialsList(event.officials)}>
                       {officialUpdating ? <Loader2 size={16} className="animate-spin" /> : 'Save Roles'}
                    </Button>
                 </div>
              </div>
            )}
          </div>

          <div className="bg-white rounded-xl border border-black/5 shadow-sm p-6">
            <div className="flex justify-between items-center border-b border-black/5 pb-4 mb-6">
              <div>
                 <h2 className="font-display text-lg uppercase tracking-widest text-[#040A12]">Categories</h2>
                 <p className="text-xs text-[#040A12]/60 mt-1">{event.categories.length} Categories attached</p>
              </div>
              {!isEditPricing && (
                <div className="flex gap-2">
                  <Button variant="secondary" className="text-xs uppercase tracking-widest h-9 border-black/10 hover:border-[#C9A44A] hover:text-[#C9A44A]" onClick={handleOpenMasterModal}>
                    <Plus size={14} className="mr-2" /> Select from Library
                  </Button>
                  {event.categories.length > 0 && (
                    <Button variant="secondary" className="text-xs uppercase tracking-widest h-9" onClick={startEditPricing}>
                      <Edit3 size={14} className="mr-2" /> Edit Pricing
                    </Button>
                  )}
                </div>
              )}
            </div>
            
            {isEditPricing ? (
              <div className="space-y-4 animate-in fade-in">
                <div className="text-sm font-display tracking-widest text-[#C9A44A] uppercase mb-4 flex justify-between items-center">
                   <span>Bulk Edit Pricing & Status</span>
                </div>
                
                <div className="overflow-x-auto">
                   <table className="w-full text-left border-collapse text-sm">
                     <thead>
                       <tr className="border-b border-black/5 text-xs font-display tracking-widest uppercase text-[#040A12]/60 bg-black/5 dark:bg-white/5">
                         <th className="p-3 font-normal">Category</th>
                         <th className="p-3 font-normal w-40">Base Fee (₹)</th>
                         <th className="p-3 font-normal w-40">Status</th>
                       </tr>
                     </thead>
                     <tbody className="divide-y divide-[var(--border-color)]">
                       {event.categories.map((cat: any) => (
                         <tr key={cat.id} className="hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
                           <td className="p-3 font-medium text-[#040A12]">{cat.name}</td>
                           <td className="p-3">
                              <Input type="number" min="0" value={pricingForm[cat.id]?.entry_fee || ''} onChange={(e) => setPricingForm({...pricingForm, [cat.id]: {...pricingForm[cat.id], entry_fee: e.target.value}})} className="h-8 text-sm" placeholder="e.g. 2000" />
                           </td>
                           <td className="p-3">
                              <Select value={pricingForm[cat.id]?.availability || 'open'} onChange={(e) => setPricingForm({...pricingForm, [cat.id]: {...pricingForm[cat.id], availability: e.target.value}})} className="h-8 text-sm py-0">
                                <option value="open">Open</option>
                                <option value="closed">Closed</option>
                              </Select>
                           </td>
                         </tr>
                       ))}
                     </tbody>
                   </table>
                </div>

                <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-black/5">
                   <Button variant="secondary" className="px-6 h-9" onClick={() => setIsEditPricing(false)}>Cancel</Button>
                   <Button className="bg-[#040A12] text-white hover:bg-[#040A12]/90 shadow-lg border-0 px-6 h-9" onClick={handleSavePricing} disabled={pricingSaving}>
                      {pricingSaving ? <Loader2 size={16} className="animate-spin" /> : 'Save Pricing'}
                   </Button>
                </div>
              </div>
            ) : event.categories.length === 0 ? (
              <div className="text-center py-12 text-[#040A12]/60 border border-dashed border-black/5">
                <div className="text-sm uppercase tracking-widest mb-2 text-[#040A12]">NO CATEGORIES ADDED</div>
                <div className="text-xs mb-6">Select master categories from the library to build this event.</div>
                <Button className="bg-[#040A12] text-white hover:bg-[#040A12]/90 shadow-lg border-0 text-xs uppercase tracking-widest h-10 px-8" onClick={handleOpenMasterModal}>
                  Select from Library
                </Button>
                <div className="mt-4 text-[10px] text-[#040A12]/60">OR</div>
                <button className="text-[11px] uppercase tracking-widest text-[#C9A44A] mt-2 hover:underline" onClick={() => {
                  setEditingCat(null); setCatForm({ name: '', short_description: '', age_group: '', gender: 'Male', entry_fee: '', availability: 'open', structure_type: 'single', weight_divisions: [], height_divisions: [], display_order: 0 });
                  setShowCatModal(true);
                }}>Create Custom Category for this Event Only</button>
              </div>
            ) : (
              <div className="space-y-3">
                {event.categories.map((cat: any) => (
                  <div key={cat.id} className="p-5 border border-black/5 bg-[#F4F5F7] flex flex-col md:flex-row md:items-start justify-between gap-4 group hover:border-[#C9A44A] transition-colors">
                     <div className="flex-grow">
                        <div className="flex flex-wrap items-center gap-3 mb-2">
                           <h3 className="font-display font-bold text-xl text-[#040A12]">{cat.name}</h3>
                           <span className="text-[#C9A44A] font-display tracking-widest text-[15px]">₹{cat.entry_fee || '0'}</span>
                           <span className={`px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest rounded-sm ${cat.availability === 'open' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>{cat.availability}</span>
                        </div>
                        <div className="text-xs text-[#040A12]/60 flex flex-wrap items-center gap-x-2 gap-y-1 uppercase tracking-wider mb-3">
                           <span className="text-[#040A12]/80">{cat.structure_type === 'single' ? 'Single' : cat.structure_type === 'weight' ? 'Weight Classes' : 'Height Classes'}</span>
                           <span>&bull;</span><span>{cat.gender || 'Any'}</span><span>&bull;</span><span>{cat.age_group || 'Open Age'}</span>
                           {cat.short_description && <><span className="text-[#040A12]/20">&bull;</span><span className="text-[#C9A44A]">{cat.short_description}</span></>}
                        </div>
                        {(cat.structure_type === 'weight' && cat.weight_divisions && cat.weight_divisions.length > 0) && (
                           <div className="text-[13px] text-[#040A12]/90 bg-[#F4F5F7] p-3 rounded-sm border border-black/5 leading-relaxed">{cat.weight_divisions.join(' · ')}</div>
                        )}
                        {(cat.structure_type === 'height' && cat.height_divisions && cat.height_divisions.length > 0) && (
                           <div className="text-[13px] text-[#040A12]/90 bg-[#F4F5F7] p-3 rounded-sm border border-black/5 leading-relaxed">{cat.height_divisions.join(' · ')}</div>
                        )}
                     </div>
                     <div className="flex items-center gap-2 shrink-0 md:mt-1">
                          <button 
                            className="px-3 py-1.5 text-[10px] font-display tracking-widest uppercase border border-black/10 hover:border-white text-[#040A12] transition-colors"
                            onClick={() => {
                              setEditingCat(cat);
                              setCatForm({
                                name: cat.name, short_description: cat.short_description || '', age_group: cat.age_group || '', gender: cat.gender || 'Male',
                                entry_fee: cat.entry_fee || '', availability: cat.availability, structure_type: cat.structure_type || 'single',
                                weight_divisions: cat.weight_divisions || [], height_divisions: cat.height_divisions || [], display_order: cat.display_order || 0
                              });
                              setShowCatModal(true);
                            }}
                          >Edit Structure</button>
                          <button className="p-1.5 text-red-500/70 hover:text-red-500 border border-transparent hover:border-red-500/30 transition-colors" onClick={() => handleDeleteCategory(cat.id)}>
                            <Trash2 size={16} />
                          </button>
                     </div>
                  </div>
                ))}
                
                <div className="pt-4 text-center mt-6 border-t border-black/5">
                   <button className="text-xs uppercase tracking-widest text-[#040A12]/60 hover:text-[#040A12] transition-colors" onClick={() => {
                      setEditingCat(null); setCatForm({ name: '', short_description: '', age_group: '', gender: 'Male', entry_fee: '', availability: 'open', structure_type: 'single', weight_divisions: [], height_divisions: [], display_order: 0 }); setShowCatModal(true);
                   }}>+ Create Custom Event Category</button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* MASTER OFFICIAL SELECTION DRAWER */}
      {showOfficialModal && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowOfficialModal(false)}></div>
          <div className="relative w-full max-w-md bg-white h-full overflow-y-auto border-l border-black/5 shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
            
            <div className="p-6 border-b border-black/5 flex justify-between items-center sticky top-0 bg-white z-10">
              <h2 className="font-display text-xl uppercase tracking-widest text-[#040A12]">Select Officials</h2>
              <button type="button" onClick={() => setShowOfficialModal(false)} className="text-[#040A12]/60 hover:text-[#040A12] transition-colors p-1"><X size={20} /></button>
            </div>
            
            <div className="p-6 overflow-y-auto flex-grow">
               <p className="text-xs text-[#040A12]/60 mb-6">Select master officials to assign them to this event. You can define their specific roles afterwards.</p>
               
               {officialLoading ? (
                 <div className="py-12 flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-[#C9A44A]" /></div>
               ) : masterOfficials.length === 0 ? (
                 <div className="text-center py-8 text-[#040A12]/60 border border-dashed border-black/5">No active master officials found.</div>
               ) : (
                 <div className="space-y-2">
                   {masterOfficials.map(official => {
                     const isSelected = selectedOfficialIds.includes(official.id);
                     
                     return (
                       <div key={official.id} 
                            onClick={() => handleToggleOfficial(official.id)}
                            className={`p-3 border ${isSelected ? 'border-[#C9A44A] bg-[#C9A44A]/10' : 'border-black/5 hover:border-black/10'} cursor-pointer transition-colors rounded flex items-center gap-4`}
                       >
                          <div className={`shrink-0 ${isSelected ? 'text-[#C9A44A]' : 'text-[#040A12]/60'}`}>
                             {isSelected ? <CheckSquare size={20} /> : <Square size={20} />}
                          </div>
                          <div className="w-10 h-10 rounded-full bg-[#F4F5F7] overflow-hidden shrink-0 border border-black/5">
                             <img src={official.photo || '/assets/wff-india.png'} alt={official.name} className="w-full h-full object-cover" />
                          </div>
                          <div className="flex-grow">
                             <div className="font-bold text-[14px] text-[#040A12]">{official.name}</div>
                             <div className="text-[10px] uppercase tracking-wider text-[#040A12]/60">{official.designation}</div>
                          </div>
                       </div>
                     );
                   })}
                 </div>
               )}
            </div>
            
            <div className="p-6 border-t border-black/5 bg-white sticky bottom-0">
               <Button className="bg-[#040A12] text-white hover:bg-[#040A12]/90 shadow-lg border-0 w-full h-12 uppercase tracking-widest text-xs font-bold" onClick={handleSaveOfficialSelection} disabled={officialSaving}>
                 {officialSaving ? <Loader2 size={16} className="animate-spin" /> : `Update ${selectedOfficialIds.length} Selected`}
               </Button>
            </div>
          </div>
        </div>
      )}

      {/* MASTER CATEGORY SELECTION MODAL */}
      {showMasterModal && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowMasterModal(false)}></div>
          <div className="relative w-full max-w-md bg-white h-full overflow-y-auto border-l border-black/5 shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
            
            <div className="p-6 border-b border-black/5 flex justify-between items-center sticky top-0 bg-white z-10">
              <h2 className="font-display text-xl uppercase tracking-widest text-[#040A12]">Library</h2>
              <button type="button" onClick={() => setShowMasterModal(false)} className="text-[#040A12]/60 hover:text-[#040A12] transition-colors p-1"><X size={20} /></button>
            </div>
            
            <div className="p-6 overflow-y-auto flex-grow">
               <p className="text-xs text-[#040A12]/60 mb-6">Select master categories to add to this event. Categories you check will be copied into the event, allowing you to set event-specific prices.</p>
               
               {masterError && <div className="bg-red-500/10 border border-red-500/50 text-red-600 p-3 rounded mb-4 text-xs">{masterError}</div>}
               
               {masterLoading ? (
                 <div className="py-12 flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-[#C9A44A]" /></div>
               ) : masterCategories.length === 0 ? (
                 <div className="text-center py-8 text-[#040A12]/60 border border-dashed border-black/5">No active master categories found.</div>
               ) : (
                 <div className="space-y-3">
                   {masterCategories.map(cat => {
                     const isSelected = selectedMasterIds.includes(cat.id);
                     const existingNamesLower = event.categories.map((c:any) => c.name.toLowerCase());
                     const isAlreadyInEvent = existingNamesLower.includes(cat.name.toLowerCase());
                     
                     return (
                       <div key={cat.id} 
                            onClick={() => !isAlreadyInEvent && handleToggleMaster(cat.id)}
                            className={`p-4 border ${isSelected ? 'border-[#C9A44A] bg-[#C9A44A]/10' : 'border-black/5 hover:border-black/10'} ${isAlreadyInEvent ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer transition-colors'} rounded flex gap-4`}
                       >
                          <div className={`mt-0.5 ${isSelected ? 'text-[#C9A44A]' : 'text-[#040A12]/60'}`}>
                             {isSelected ? <CheckSquare size={20} /> : <Square size={20} />}
                          </div>
                          <div>
                             <div className="font-bold text-[#040A12] mb-1">{cat.name}</div>
                             <div className="text-[10px] uppercase tracking-wider text-[#040A12]/60">
                                {cat.structure_type} &bull; {cat.gender}
                             </div>
                             {isAlreadyInEvent && <div className="text-[10px] text-green-400 mt-1 uppercase font-bold">Already Added</div>}
                          </div>
                       </div>
                     );
                   })}
                 </div>
               )}
            </div>
            
            <div className="p-6 border-t border-black/5 bg-white sticky bottom-0">
               <Button className="bg-[#040A12] text-white hover:bg-[#040A12]/90 shadow-lg border-0 w-full h-12 uppercase tracking-widest text-xs font-bold" onClick={handleAttachMasters} disabled={masterSaving || selectedMasterIds.length === 0}>
                 {masterSaving ? <Loader2 size={16} className="animate-spin" /> : `Add ${selectedMasterIds.length} Selected`}
               </Button>
            </div>
          </div>
        </div>
      )}

      {/* CUSTOM CATEGORY DRAWER */}
      {showCatModal && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowCatModal(false)}></div>
          <div className="relative w-full max-w-lg bg-white h-full overflow-y-auto border-l border-black/5 shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
            <div className="p-6 border-b border-black/5 flex justify-between items-center sticky top-0 bg-white z-10">
              <h2 className="font-display text-xl uppercase tracking-widest text-[#040A12]">{editingCat ? 'Edit Structure' : 'Add Custom Category'}</h2>
              <button type="button" onClick={() => setShowCatModal(false)} className="text-[#040A12]/60 hover:text-[#040A12] p-1"><X size={20} /></button>
            </div>
            <form onSubmit={handleSaveCategory} className="p-6 space-y-6 flex-grow flex flex-col">
              {catError && <div className="bg-red-500/10 border border-red-500/50 text-red-600 p-4 rounded text-sm shrink-0">{catError}</div>}
              
              <div className="space-y-5">
                <div><label className="block text-xs font-display tracking-widest uppercase text-[#040A12]/60 mb-2">Category Name *</label>
                  <Input required value={catForm.name} onChange={e => setCatForm({...catForm, name: e.target.value})} placeholder="e.g. Men's Physique" /></div>
                <div className="grid grid-cols-2 gap-4">
                  <div><label className="block text-xs font-display tracking-widest uppercase text-[#040A12]/60 mb-2">Short Description</label>
                    <Input value={catForm.short_description} onChange={e => setCatForm({...catForm, short_description: e.target.value})} /></div>
                  <div><label className="block text-xs font-display tracking-widest uppercase text-[#040A12]/60 mb-2">Age Label</label>
                    <Input value={catForm.age_group} onChange={e => setCatForm({...catForm, age_group: e.target.value})} /></div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div><label className="block text-xs font-display tracking-widest uppercase text-[#040A12]/60 mb-2">Gender</label>
                    <Select value={catForm.gender} onChange={e => setCatForm({...catForm, gender: e.target.value})}>
                      <option value="Male">Male</option><option value="Female">Female</option><option value="Mixed">Mixed</option><option value="Not Specified">Not Specified</option>
                    </Select></div>
                  <div><label className="block text-xs font-display tracking-widest uppercase text-[#040A12]/60 mb-2">Status *</label>
                    <Select required value={catForm.availability} onChange={e => setCatForm({...catForm, availability: e.target.value})}>
                      <option value="open">Open</option><option value="closed">Closed</option>
                    </Select></div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div><label className="block text-xs font-display tracking-widest uppercase text-[#040A12]/60 mb-2">Base Entry Fee (₹)</label>
                    <Input type="number" min="0" value={catForm.entry_fee} onChange={e => setCatForm({...catForm, entry_fee: e.target.value})} /></div>
                  <div><label className="block text-xs font-display tracking-widest uppercase text-[#040A12]/60 mb-2">Display Order</label>
                    <Input type="number" value={catForm.display_order} onChange={e => setCatForm({...catForm, display_order: parseInt(e.target.value)||0})} /></div>
                </div>
                
                <div className="border-t border-black/5 pt-5 mt-5">
                   <label className="block text-sm font-display tracking-widest uppercase text-[#040A12] mb-4">Structure</label>
                   <div className="grid grid-cols-3 gap-3 mb-5">
                      {['single', 'weight', 'height'].map(type => (
                         <button key={type} type="button" onClick={() => setCatForm({...catForm, structure_type: type})}
                            className={`p-3 text-center border text-xs tracking-wider uppercase transition-colors ${catForm.structure_type === type ? 'border-[#C9A44A] bg-[#C9A44A]/10 text-[#C9A44A]' : 'border-black/5 text-[#040A12]/60'}`}>
                            {type}
                         </button>
                      ))}
                   </div>
                   {catForm.structure_type === 'weight' && (
                     <div>
                       <div className="space-y-2 mb-3">
                          {catForm.weight_divisions.map((div, idx) => (
                            <div key={idx} className="flex items-center gap-2 bg-[#F4F5F7] p-2 border border-black/5">
                              <Input className="h-9 text-sm" value={div} onChange={e => { const n = [...catForm.weight_divisions]; n[idx] = e.target.value; setCatForm({...catForm, weight_divisions: n}); }} />
                              <button type="button" onClick={() => setCatForm({...catForm, weight_divisions: catForm.weight_divisions.filter((_, i) => i !== idx)})} className="w-9 h-9 flex items-center justify-center text-red-500 hover:bg-red-500/20"><Trash2 size={16}/></button>
                            </div>
                          ))}
                       </div>
                       <Button type="button" variant="secondary" className="w-full text-xs h-10 border-dashed" onClick={() => setCatForm({...catForm, weight_divisions: [...catForm.weight_divisions, '']})}>+ Add Weight</Button>
                     </div>
                   )}
                   {catForm.structure_type === 'height' && (
                     <div>
                       <div className="space-y-2 mb-3">
                          {catForm.height_divisions.map((div, idx) => (
                            <div key={idx} className="flex items-center gap-2 bg-[#F4F5F7] p-2 border border-black/5">
                              <Input className="h-9 text-sm" value={div} onChange={e => { const n = [...catForm.height_divisions]; n[idx] = e.target.value; setCatForm({...catForm, height_divisions: n}); }} />
                              <button type="button" onClick={() => setCatForm({...catForm, height_divisions: catForm.height_divisions.filter((_, i) => i !== idx)})} className="w-9 h-9 flex items-center justify-center text-red-500 hover:bg-red-500/20"><Trash2 size={16}/></button>
                            </div>
                          ))}
                       </div>
                       <Button type="button" variant="secondary" className="w-full text-xs h-10 border-dashed" onClick={() => setCatForm({...catForm, height_divisions: [...catForm.height_divisions, '']})}>+ Add Height</Button>
                     </div>
                   )}
                </div>
              </div>
              <div className="mt-auto pt-8 flex justify-end gap-3 sticky bottom-0 bg-white border-t border-black/5 pb-2">
                <Button type="button" variant="secondary" className="px-6" onClick={() => setShowCatModal(false)}>Cancel</Button>
                <Button type="submit" disabled={catSaving} className="bg-[#040A12] text-white hover:bg-[#040A12]/90 shadow-lg border-0 min-w-[140px]">
                  {catSaving ? <Loader2 size={16} className="animate-spin mx-auto" /> : 'Save Structure'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminShell>
  );
}
