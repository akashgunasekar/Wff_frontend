"use client";

import { useState, useEffect, useCallback } from 'react';
import AdminShell from '@/components/admin/AdminShell';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Loader2, Save, AlertTriangle, Plus, Trash2, Edit2, MoveUp, MoveDown } from 'lucide-react';

export default function AdminHomepagePage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [activeTab, setActiveTab] = useState('hero'); // hero, announcements, sections

  // Hero State
  const [heroes, setHeroes] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [heroForm, setHeroForm] = useState<any>({ title: '', subtitle: '', image: '', date: '', location: '', event_id: '', display_fee: '', sort_order: 0, status: 1 });
  const [editingHero, setEditingHero] = useState<any>(null);
  const [showHeroModal, setShowHeroModal] = useState(false);
  const [heroSaving, setHeroSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  // Announcements State
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [annForm, setAnnForm] = useState<any>({ message: '', link_text: '', link_url: '', status: 1 });
  const [editingAnn, setEditingAnn] = useState<any>(null);
  const [showAnnModal, setShowAnnModal] = useState(false);
  const [annSaving, setAnnSaving] = useState(false);

  // Sections State
  const [sections, setSections] = useState<any>({});
  const [sectionSaving, setSectionSaving] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || '/api';
      
      const [heroRes, annRes, secRes, eventsRes] = await Promise.all([
        fetch(`${API_BASE}/admin/homepage/hero/index.php`, { credentials: 'include' }),
        fetch(`${API_BASE}/admin/homepage/announcements/index.php`, { credentials: 'include' }),
        fetch(`${API_BASE}/homepage/sections.php`, { credentials: 'include' }),
        fetch(`${API_BASE}/admin/events/index.php`, { credentials: 'include' })
      ]);
      
      const [heroJson, annJson, secJson, eventsJson] = await Promise.all([
        heroRes.json(), annRes.json(), secRes.json(), eventsRes.json()
      ]);
      
      if (heroJson.success) setHeroes(heroJson.data);
      if (annJson.success) setAnnouncements(annJson.data);
      if (secJson.success) setSections(secJson.data);
      if (eventsJson.success) setEvents(eventsJson.data);
      
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const getImageUrl = (url: string | null) => {
    if (!url) return '/assets/wff_hero_banner.png';
    return url;
  };

  // HERO ACTIONS
  const handleUploadHeroImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append('image', file);

    setUploadingImage(true);
    try {
      const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || '/api';
      const res = await fetch(`${API_BASE}/admin/homepage/hero/upload.php`, {
        method: 'POST',
        credentials: 'include',
        body: formData
      });
      const json = await res.json();
      if (json.success) {
        setHeroForm({ ...heroForm, image: json.data.image });
      } else {
        alert(json.message);
      }
    } catch (err: any) {
      alert("Image upload failed.");
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSaveHero = async (e: React.FormEvent) => {
    e.preventDefault();
    setHeroSaving(true);
    try {
      const endpoint = editingHero ? 'update.php' : 'create.php';
      const payload = editingHero ? { ...heroForm, id: editingHero.id } : heroForm;
      if (heroForm.display_fee) {
          payload.display_fee = heroForm.display_fee.toString();
      }
      
      const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || '/api';
      const res = await fetch(`${API_BASE}/admin/homepage/hero/${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(payload)
      });
      const json = await res.json();
      if (json.success) {
        setShowHeroModal(false);
        fetchData();
      } else throw new Error(json.message);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setHeroSaving(false);
    }
  };

  const handleDeleteHero = async (id: number) => {
    if (!confirm("Delete this hero slide?")) return;
    try {
      const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || '/api';
      const res = await fetch(`${API_BASE}/admin/homepage/hero/delete.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ id })
      });
      const json = await res.json();
      if (json.success) fetchData();
      else alert(json.message);
    } catch (err: any) {
      alert(err.message);
    }
  };

  // ANNOUNCEMENT ACTIONS
  const handleSaveAnn = async (e: React.FormEvent) => {
    e.preventDefault();
    setAnnSaving(true);
    try {
      const endpoint = editingAnn ? 'update.php' : 'create.php';
      const payload = editingAnn ? { ...annForm, id: editingAnn.id } : annForm;
      
      const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || '/api';
      const res = await fetch(`${API_BASE}/admin/homepage/announcements/${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(payload)
      });
      const json = await res.json();
      if (json.success) {
        setShowAnnModal(false);
        fetchData();
      } else throw new Error(json.message);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setAnnSaving(false);
    }
  };

  const handleDeleteAnn = async (id: number) => {
    if (!confirm("Delete this announcement?")) return;
    try {
      const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || '/api';
      const res = await fetch(`${API_BASE}/admin/homepage/announcements/delete.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ id })
      });
      const json = await res.json();
      if (json.success) fetchData();
      else alert(json.message);
    } catch (err: any) {
      alert(err.message);
    }
  };

  // SECTION ACTIONS
  const handleSaveSection = async (sectionKey: string, payload: any) => {
    setSectionSaving(sectionKey);
    try {
      const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || '/api';
      const res = await fetch(`${API_BASE}/admin/homepage/sections/update.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ section_key: sectionKey, ...payload })
      });
      const json = await res.json();
      if (json.success) {
        alert("Section updated successfully.");
        fetchData();
      } else throw new Error(json.message);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setSectionSaving(null);
    }
  };

  if (loading) {
    return <AdminShell title="Homepage CMS"><div className="p-12 flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-[var(--gold)]" /></div></AdminShell>;
  }

  return (
    <AdminShell title="Homepage CMS">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
           <h1 className="font-heading font-bold text-3xl uppercase tracking-widest text-[#040A12] mb-2">Homepage CMS</h1>
           <p className="text-sm font-medium text-[#040A12]/60">Manage the content, heroes, and announcements displayed on the front page.</p>
        </div>
      </div>

      <div className="flex border-b border-black/10 mb-8 overflow-x-auto">
        {['hero', 'announcements', 'sections'].map(tab => (
          <button 
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-8 py-4 text-[11px] font-bold tracking-[0.2em] uppercase transition-colors whitespace-nowrap ${activeTab === tab ? 'text-[#040A12] border-b-2 border-[#040A12]' : 'text-[#040A12]/40 hover:text-[#040A12]'}`}
          >
            {tab.replace('_', ' ')}
          </button>
        ))}
      </div>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 mb-8 rounded shadow-sm flex items-center font-medium text-sm">
          <AlertTriangle size={18} className="mr-3 flex-shrink-0" />
          {error}
        </div>
      )}

      {/* HERO TAB */}
      {activeTab === 'hero' && (
        <div className="bg-white rounded-xl border border-black/5 p-8 shadow-sm">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
            <h2 className="font-heading font-bold text-2xl uppercase tracking-widest text-[#040A12]">Hero Slides</h2>
            <Button onClick={() => { setEditingHero(null); setHeroForm({ title: '', subtitle: '', image: '', date: '', location: '', event_id: '', display_fee: '', sort_order: 0, status: 1 }); setShowHeroModal(true); }} className="uppercase tracking-[0.15em] font-bold text-[10px] h-10 px-5 bg-[#040A12] text-white hover:bg-[#040A12]/90 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 rounded shrink-0 border-0">
              <Plus size={14} className="mr-2 inline" /> Add Slide
            </Button>
          </div>
          <div className="space-y-4">
            {heroes.map(hero => (
              <div key={hero.id} className="bg-[#F4F5F7] border border-black/5 rounded-lg p-4 flex flex-col md:flex-row gap-6 items-center hover:border-black/10 transition-colors group">
                <div className="w-full md:w-48 h-32 rounded overflow-hidden flex-shrink-0 relative shadow-sm bg-black/10">
                  <img src={getImageUrl(hero.image)} alt={hero.title} className="object-cover w-full h-full" />
                </div>
                <div className="flex-1 w-full text-center md:text-left">
                  <div className="font-heading font-bold text-lg uppercase text-[#040A12] leading-tight">{hero.title}</div>
                  <div className="text-xs font-medium text-[#040A12]/60 mt-1">{hero.subtitle}</div>
                  <div className="mt-4">
                    <span className={`px-3 py-1.5 rounded-sm text-[9px] font-bold uppercase tracking-widest ${hero.status ? 'bg-[#040A12] text-[#C9A44A]' : 'bg-gray-200 text-gray-500'}`}>
                      {hero.status ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>
                <div className="flex flex-row md:flex-col gap-2 shrink-0 w-full md:w-auto mt-4 md:mt-0">
                  <button className="flex-1 md:flex-none h-10 px-6 text-[10px] font-bold tracking-[0.15em] uppercase bg-white hover:bg-[#040A12] text-[#040A12] hover:text-white rounded border border-black/5 transition-colors flex items-center justify-center" onClick={() => { setEditingHero(hero); setHeroForm(hero); setShowHeroModal(true); }}>Edit</button>
                  <button className="flex-1 md:flex-none h-10 px-6 text-[10px] font-bold tracking-[0.15em] uppercase text-red-500 hover:text-white bg-white hover:bg-red-500 rounded border border-black/5 hover:border-red-500 transition-colors flex items-center justify-center" onClick={() => handleDeleteHero(hero.id)}>Delete</button>
                </div>
              </div>
            ))}
            {heroes.length === 0 && <div className="text-center p-12 text-[#040A12]/40 font-bold tracking-widest uppercase text-sm border border-dashed border-black/10 rounded-lg">No hero slides found. Add one to display on the homepage.</div>}
          </div>
        </div>
      )}

      {/* ANNOUNCEMENTS TAB */}
      {activeTab === 'announcements' && (
        <div className="bg-white rounded-xl border border-black/5 p-8 shadow-sm">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
            <h2 className="font-heading font-bold text-2xl uppercase tracking-widest text-[#040A12]">Announcements</h2>
            <Button onClick={() => { setEditingAnn(null); setAnnForm({ message: '', link_text: '', link_url: '', status: 1 }); setShowAnnModal(true); }} className="uppercase tracking-[0.15em] font-bold text-[10px] h-10 px-5 bg-[#040A12] text-white hover:bg-[#040A12]/90 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 rounded shrink-0 border-0">
              <Plus size={14} className="mr-2 inline" /> Add Announcement
            </Button>
          </div>
          <div className="space-y-4">
            {announcements.map(ann => (
              <div key={ann.id} className="bg-[#F4F5F7] border border-black/5 rounded-lg p-5 flex flex-col md:flex-row gap-6 items-center hover:border-black/10 transition-colors">
                <div className="flex-1 w-full text-center md:text-left">
                  <div className="text-[15px] font-bold text-[#040A12] leading-snug">{ann.message}</div>
                  {ann.link_text && <div className="text-xs font-bold text-[#C9A44A] tracking-wider uppercase mt-2">{ann.link_text} &rarr; {ann.link_url}</div>}
                  <div className="mt-4">
                    <span className={`px-3 py-1.5 rounded-sm text-[9px] font-bold uppercase tracking-widest ${ann.status ? 'bg-[#040A12] text-[#C9A44A]' : 'bg-gray-200 text-gray-500'}`}>
                      {ann.status ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>
                <div className="flex flex-row md:flex-col gap-2 shrink-0 w-full md:w-auto mt-4 md:mt-0">
                  <button className="flex-1 md:flex-none h-10 px-6 text-[10px] font-bold tracking-[0.15em] uppercase bg-white hover:bg-[#040A12] text-[#040A12] hover:text-white rounded border border-black/5 transition-colors flex items-center justify-center" onClick={() => { setEditingAnn(ann); setAnnForm(ann); setShowAnnModal(true); }}>Edit</button>
                  <button className="flex-1 md:flex-none h-10 px-6 text-[10px] font-bold tracking-[0.15em] uppercase text-red-500 hover:text-white bg-white hover:bg-red-500 rounded border border-black/5 hover:border-red-500 transition-colors flex items-center justify-center" onClick={() => handleDeleteAnn(ann.id)}>Delete</button>
                </div>
              </div>
            ))}
            {announcements.length === 0 && <div className="text-center p-12 text-[#040A12]/40 font-bold tracking-widest uppercase text-sm border border-dashed border-black/10 rounded-lg">No announcements active.</div>}
          </div>
        </div>
      )}

      {/* SECTIONS TAB */}
      {activeTab === 'sections' && (
        <div className="space-y-8">
          
          {/* FINAL CTA SECTION */}
          <div className="bg-white rounded-xl border border-black/5 p-8 shadow-sm">
            <h2 className="font-heading font-bold text-xl uppercase tracking-widest text-[#040A12] mb-6 border-b border-black/5 pb-4">Final CTA (Ready to Compete)</h2>
            <div className="space-y-6 max-w-2xl">
              <div>
                <label className="block text-[11px] font-bold tracking-[0.15em] uppercase text-[#040A12]/60 mb-2">Heading</label>
                <Input className="bg-[#F4F5F7] border-0 h-12 focus:ring-1 focus:ring-[#C9A44A]/50 rounded text-sm font-medium" value={sections['final_cta']?.title || ''} onChange={e => setSections({...sections, final_cta: {...sections['final_cta'], title: e.target.value}})} />
              </div>
              <div>
                <label className="block text-[11px] font-bold tracking-[0.15em] uppercase text-[#040A12]/60 mb-2">Supporting Text</label>
                <Input className="bg-[#F4F5F7] border-0 h-12 focus:ring-1 focus:ring-[#C9A44A]/50 rounded text-sm font-medium" value={sections['final_cta']?.subtitle || ''} onChange={e => setSections({...sections, final_cta: {...sections['final_cta'], subtitle: e.target.value}})} />
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-[11px] font-bold tracking-[0.15em] uppercase text-[#040A12]/60 mb-2">Button Label</label>
                  <Input 
                    className="bg-[#F4F5F7] border-0 h-12 focus:ring-1 focus:ring-[#C9A44A]/50 rounded text-sm font-medium"
                    value={(() => { try { return JSON.parse(sections['final_cta']?.content || '{}').label; } catch { return ''; } })()} 
                    onChange={e => {
                      try {
                        const content = JSON.parse(sections['final_cta']?.content || '{}');
                        content.label = e.target.value;
                        setSections({...sections, final_cta: {...sections['final_cta'], content: JSON.stringify(content)}});
                      } catch {}
                    }} 
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold tracking-[0.15em] uppercase text-[#040A12]/60 mb-2">Button Destination URL</label>
                  <Input 
                    className="bg-[#F4F5F7] border-0 h-12 focus:ring-1 focus:ring-[#C9A44A]/50 rounded text-sm font-medium"
                    value={(() => { try { return JSON.parse(sections['final_cta']?.content || '{}').destination; } catch { return ''; } })()} 
                    onChange={e => {
                      try {
                        const content = JSON.parse(sections['final_cta']?.content || '{}');
                        content.destination = e.target.value;
                        setSections({...sections, final_cta: {...sections['final_cta'], content: JSON.stringify(content)}});
                      } catch {}
                    }} 
                  />
                </div>
              </div>
              <Button onClick={() => handleSaveSection('final_cta', sections['final_cta'])} className="uppercase tracking-[0.15em] font-bold text-[11px] h-12 px-8 bg-[#040A12] text-white hover:bg-[#040A12]/90 hover:-translate-y-0.5 shadow-lg transition-all border-0 rounded mt-2" disabled={sectionSaving === 'final_cta'}>
                {sectionSaving === 'final_cta' ? <Loader2 size={16} className="animate-spin" /> : 'Save CTA'}
              </Button>
            </div>
          </div>

          {/* WHY COMPETE SECTION */}
          <div className="bg-white rounded-xl border border-black/5 p-8 shadow-sm">
            <h2 className="font-heading font-bold text-xl uppercase tracking-widest text-[#040A12] mb-6 border-b border-black/5 pb-4">Why Compete (Highlights)</h2>
            <div className="space-y-6 mb-8 max-w-2xl">
              <div>
                <label className="block text-[11px] font-bold tracking-[0.15em] uppercase text-[#040A12]/60 mb-2">Section Title</label>
                <Input className="bg-[#F4F5F7] border-0 h-12 focus:ring-1 focus:ring-[#C9A44A]/50 rounded text-sm font-medium" value={sections['why_compete']?.title || ''} onChange={e => setSections({...sections, why_compete: {...sections['why_compete'], title: e.target.value}})} />
              </div>
              <div>
                <label className="block text-[11px] font-bold tracking-[0.15em] uppercase text-[#040A12]/60 mb-2">Section Subtitle</label>
                <Input className="bg-[#F4F5F7] border-0 h-12 focus:ring-1 focus:ring-[#C9A44A]/50 rounded text-sm font-medium" value={sections['why_compete']?.subtitle || ''} onChange={e => setSections({...sections, why_compete: {...sections['why_compete'], subtitle: e.target.value}})} />
              </div>
            </div>
            
            <div className="bg-[#F4F5F7] rounded-lg p-6 space-y-4 border border-black/5">
              <label className="block text-[11px] font-bold tracking-[0.15em] uppercase text-[#040A12] mb-2">Highlight Cards (JSON Content Edit)</label>
              <textarea 
                className="w-full bg-white border border-black/10 rounded focus:ring-1 focus:ring-[#C9A44A]/50 p-4 text-xs font-mono min-h-[200px]"
                value={sections['why_compete']?.content || ''}
                onChange={e => setSections({...sections, why_compete: {...sections['why_compete'], content: e.target.value}})}
              />
              <p className="text-[10px] text-[#040A12]/50 font-medium">Note: Edit JSON directly. Keys: title, description, icon.</p>
            </div>
            
            <div className="mt-6">
              <Button onClick={() => handleSaveSection('why_compete', sections['why_compete'])} className="uppercase tracking-[0.15em] font-bold text-[11px] h-12 px-8 bg-[#040A12] text-white hover:bg-[#040A12]/90 hover:-translate-y-0.5 shadow-lg transition-all border-0 rounded" disabled={sectionSaving === 'why_compete'}>
                {sectionSaving === 'why_compete' ? <Loader2 size={16} className="animate-spin" /> : 'Save Highlights'}
              </Button>
            </div>
          </div>

          {/* WFF STANDARD SECTION */}
          <div className="bg-white rounded-xl border border-black/5 p-8 shadow-sm">
            <h2 className="font-heading font-bold text-xl uppercase tracking-widest text-[#040A12] mb-6 border-b border-black/5 pb-4">WFF Standard (Awards)</h2>
            <div className="space-y-6 mb-8 max-w-2xl">
              <div>
                <label className="block text-[11px] font-bold tracking-[0.15em] uppercase text-[#040A12]/60 mb-2">Section Title</label>
                <Input className="bg-[#F4F5F7] border-0 h-12 focus:ring-1 focus:ring-[#C9A44A]/50 rounded text-sm font-medium" value={sections['wff_standard']?.title || ''} onChange={e => setSections({...sections, wff_standard: {...sections['wff_standard'], title: e.target.value}})} />
              </div>
              <div>
                <label className="block text-[11px] font-bold tracking-[0.15em] uppercase text-[#040A12]/60 mb-2">Section Subtitle</label>
                <Input className="bg-[#F4F5F7] border-0 h-12 focus:ring-1 focus:ring-[#C9A44A]/50 rounded text-sm font-medium" value={sections['wff_standard']?.subtitle || ''} onChange={e => setSections({...sections, wff_standard: {...sections['wff_standard'], subtitle: e.target.value}})} />
              </div>
            </div>
            
            <div className="bg-[#F4F5F7] rounded-lg p-6 space-y-4 border border-black/5">
              <label className="block text-[11px] font-bold tracking-[0.15em] uppercase text-[#040A12] mb-2">Award Cards (JSON Content Edit)</label>
              <textarea 
                className="w-full bg-white border border-black/10 rounded focus:ring-1 focus:ring-[#C9A44A]/50 p-4 text-xs font-mono min-h-[200px]"
                value={sections['wff_standard']?.content || ''}
                onChange={e => setSections({...sections, wff_standard: {...sections['wff_standard'], content: e.target.value}})}
              />
              <p className="text-[10px] text-[#040A12]/50 font-medium">Note: Edit JSON directly. Keys: title, description, icon.</p>
            </div>
            
            <div className="mt-6">
              <Button onClick={() => handleSaveSection('wff_standard', sections['wff_standard'])} className="uppercase tracking-[0.15em] font-bold text-[11px] h-12 px-8 bg-[#040A12] text-white hover:bg-[#040A12]/90 hover:-translate-y-0.5 shadow-lg transition-all border-0 rounded" disabled={sectionSaving === 'wff_standard'}>
                {sectionSaving === 'wff_standard' ? <Loader2 size={16} className="animate-spin" /> : 'Save WFF Standard'}
              </Button>
            </div>
          </div>

        </div>
      )}

      {/* MODALS */}
      {showHeroModal && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-[var(--surface)] border border-[var(--border-color)] w-full max-w-lg p-6">
            <h2 className="font-display text-lg uppercase tracking-widest text-[var(--text-primary)] mb-6">{editingHero ? 'Edit Slide' : 'Add Slide'}</h2>
            <form onSubmit={handleSaveHero} className="space-y-4 max-h-[80vh] overflow-y-auto pr-2">
              <div>
                <label className="block text-xs font-display tracking-widest uppercase text-[var(--muted)] mb-2">Title *</label>
                <Input required value={heroForm.title} onChange={e => setHeroForm({...heroForm, title: e.target.value})} />
              </div>
              <div>
                <label className="block text-xs font-display tracking-widest uppercase text-[var(--muted)] mb-2">Subtitle (Eyebrow)</label>
                <Input value={heroForm.subtitle} onChange={e => setHeroForm({...heroForm, subtitle: e.target.value})} />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-display tracking-widest uppercase text-[var(--muted)] mb-2">Associate Event</label>
                  <Select value={heroForm.event_id || ''} onChange={e => setHeroForm({...heroForm, event_id: e.target.value})}>
                    <option value="">None (Custom Link)</option>
                    {events.map(ev => (
                      <option key={ev.id} value={ev.id}>{ev.event_name}</option>
                    ))}
                  </Select>
                </div>
                <div>
                  <label className="block text-xs font-display tracking-widest uppercase text-[var(--muted)] mb-2">Date (Override)</label>
                  <Input value={heroForm.date || ''} onChange={e => setHeroForm({...heroForm, date: e.target.value})} placeholder="e.g. 20 SEPTEMBER 2026" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-display tracking-widest uppercase text-[var(--muted)] mb-2">Location (Override)</label>
                  <Input value={heroForm.location || ''} onChange={e => setHeroForm({...heroForm, location: e.target.value})} placeholder="e.g. Chennai, Tamil Nadu" />
                </div>
                <div>
                  <label className="block text-xs font-display tracking-widest uppercase text-[var(--muted)] mb-2">Event Fee (Display)</label>
                  <Input value={heroForm.display_fee || ''} onChange={e => setHeroForm({...heroForm, display_fee: e.target.value})} placeholder="e.g. 2000" />
                  <p className="text-[10px] text-white/50 mt-1">Display-only Hero fee. Registration amount is controlled by category fees.</p>
                </div>
              </div>

              <div>
                <label className="block text-xs font-display tracking-widest uppercase text-[var(--muted)] mb-2">Image URL *</label>
                <div className="flex gap-2">
                  <Input required value={heroForm.image} onChange={e => setHeroForm({...heroForm, image: e.target.value})} placeholder="/assets/banner.png" className="flex-1" />
                  <div className="relative overflow-hidden inline-flex">
                    <Button type="button" variant="secondary" disabled={uploadingImage} className="whitespace-nowrap">
                      {uploadingImage ? <Loader2 size={16} className="animate-spin" /> : 'Upload'}
                    </Button>
                    <input type="file" accept="image/*" onChange={handleUploadHeroImage} className="absolute inset-0 opacity-0 cursor-pointer" />
                  </div>
                </div>
                {heroForm.image && (
                  <div className="mt-2 h-32 bg-black/20 rounded border border-[var(--border-color)] overflow-hidden">
                    <img src={getImageUrl(heroForm.image)} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-display tracking-widest uppercase text-[var(--muted)] mb-2">Sort Order</label>
                  <Input type="number" value={heroForm.sort_order || 0} onChange={e => setHeroForm({...heroForm, sort_order: e.target.value})} />
                </div>
                <div>
                  <label className="block text-xs font-display tracking-widest uppercase text-[var(--muted)] mb-2">Status</label>
                  <Select value={heroForm.status} onChange={e => setHeroForm({...heroForm, status: parseInt(e.target.value)})}>
                    <option value={1}>Active</option>
                    <option value={0}>Inactive</option>
                  </Select>
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-4">
                <Button type="button" variant="secondary" onClick={() => setShowHeroModal(false)}>Cancel</Button>
                <Button type="submit" variant="primary" disabled={heroSaving}>{heroSaving ? 'Saving...' : 'Save'}</Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showAnnModal && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-[var(--surface)] border border-[var(--border-color)] w-full max-w-lg p-6">
            <h2 className="font-display text-lg uppercase tracking-widest text-[var(--text-primary)] mb-6">{editingAnn ? 'Edit Announcement' : 'Add Announcement'}</h2>
            <form onSubmit={handleSaveAnn} className="space-y-4">
              <div>
                <label className="block text-xs font-display tracking-widest uppercase text-[var(--muted)] mb-2">Message *</label>
                <Input required value={annForm.message} onChange={e => setAnnForm({...annForm, message: e.target.value})} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-display tracking-widest uppercase text-[var(--muted)] mb-2">Link Text</label>
                  <Input value={annForm.link_text} onChange={e => setAnnForm({...annForm, link_text: e.target.value})} placeholder="e.g. READ MORE" />
                </div>
                <div>
                  <label className="block text-xs font-display tracking-widest uppercase text-[var(--muted)] mb-2">Link URL</label>
                  <Input value={annForm.link_url} onChange={e => setAnnForm({...annForm, link_url: e.target.value})} placeholder="e.g. /events" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-display tracking-widest uppercase text-[var(--muted)] mb-2">Status</label>
                <Select value={annForm.status} onChange={e => setAnnForm({...annForm, status: parseInt(e.target.value)})}>
                  <option value={1}>Active</option>
                  <option value={0}>Inactive</option>
                </Select>
              </div>
              <div className="flex justify-end gap-2 pt-4">
                <Button type="button" variant="secondary" onClick={() => setShowAnnModal(false)}>Cancel</Button>
                <Button type="submit" variant="primary" disabled={annSaving}>{annSaving ? 'Saving...' : 'Save'}</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminShell>
  );
}
