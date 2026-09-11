"use client";

import { useState, useEffect, useCallback } from 'react';
import AdminShell from '@/components/admin/AdminShell';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Loader2, Save, Trash2, Plus, Edit2, AlertTriangle, X } from 'lucide-react';

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Drawer state
  const [showCatModal, setShowCatModal] = useState(false);
  const [editingCat, setEditingCat] = useState<any>(null);
  const [catForm, setCatForm] = useState({
    name: '',
    short_description: '',
    age_group: '',
    gender: 'Male',
    structure_type: 'single',
    weight_divisions: [] as string[],
    height_divisions: [] as string[],
    display_order: 0,
    status: 'active'
  });
  const [catSaving, setCatSaving] = useState(false);
  const [catError, setCatError] = useState('');

  const fetchCategories = useCallback(async () => {
    try {
      const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || '/api';
      const res = await fetch(`${API_BASE}/admin/categories/index.php`, {
        credentials: 'include'
      });
      const json = await res.json();
      if (json.success) {
        setCategories(json.data);
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
    fetchCategories();
  }, [fetchCategories]);

  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    setCatSaving(true);
    setCatError('');

    if (catForm.structure_type === 'weight' && catForm.weight_divisions.some(d => !d.trim())) {
      setCatError("Please fill out all weight division fields or remove empty ones.");
      setCatSaving(false);
      return;
    }
    if (catForm.structure_type === 'height' && catForm.height_divisions.some(d => !d.trim())) {
      setCatError("Please fill out all height division fields or remove empty ones.");
      setCatSaving(false);
      return;
    }

    try {
      const isEdit = !!editingCat;
      const endpoint = isEdit ? 'update.php' : 'create.php';
      
      const payload = {
        ...catForm,
        id: editingCat?.id
      };
      
      const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || '/api';
      const res = await fetch(`${API_BASE}/admin/categories/${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(payload)
      });
      
      const json = await res.json();
      if (json.success) {
        setShowCatModal(false);
        fetchCategories();
      } else {
        throw new Error(json.message);
      }
    } catch (err: any) {
      setCatError(err.message);
    } finally {
      setCatSaving(false);
    }
  };

  const handleDeleteCategory = async (categoryId: string) => {
    if (!confirm("Are you sure? This does NOT affect existing events using this category, but will remove it from the reusable library.")) return;
    
    try {
      const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || '/api';
      const res = await fetch(`${API_BASE}/admin/categories/delete.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ id: categoryId })
      });
      
      const json = await res.json();
      if (json.success) {
        fetchCategories();
      } else {
        alert(json.message);
      }
    } catch (err: any) {
      alert(err.message);
    }
  };

  if (loading) {
    return (
      <AdminShell title="Category Library">
        <div className="p-12 flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-[var(--gold)]" /></div>
      </AdminShell>
    );
  }

  return (
    <AdminShell title="Category Library">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-4">
        <div>
           <h1 className="font-heading font-bold text-3xl uppercase tracking-widest text-[#040A12] mb-2">Master Category Library</h1>
           <p className="text-sm font-medium text-[#040A12]/60">Create reusable category definitions to quickly assign to any event.</p>
        </div>
        <Button 
          className="uppercase tracking-[0.15em] font-bold text-[11px] h-12 px-6 bg-[#040A12] text-white hover:bg-[#040A12]/90 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 rounded shrink-0 border-0"
          onClick={() => {
            setEditingCat(null);
            setCatForm({ 
              name: '', short_description: '', age_group: '', gender: 'Male', 
              structure_type: 'single', weight_divisions: [], height_divisions: [], display_order: 0, status: 'active'
            });
            setShowCatModal(true);
          }}
        >
          <Plus size={16} className="mr-2 inline" /> Add Category
        </Button>
      </div>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 mb-8 rounded shadow-sm flex items-center font-medium text-sm">
          <AlertTriangle size={18} className="mr-3 flex-shrink-0" />
          {error}
        </div>
      )}

      {categories.length === 0 ? (
        <div className="bg-white border border-black/5 rounded-xl p-16 text-center shadow-sm">
          <div className="w-16 h-16 bg-[#F4F5F7] rounded-full flex items-center justify-center mx-auto mb-4 text-[#040A12]/30">
            <Plus size={24} />
          </div>
          <div className="text-sm font-bold uppercase tracking-[0.2em] text-[#040A12] mb-2">No Categories Found</div>
          <p className="text-xs font-medium text-[#040A12]/50 max-w-md mx-auto">Create your first master category to use across your upcoming events and championships.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {categories.map((cat) => (
            <div key={cat.id} className="bg-white rounded-xl border border-black/5 p-6 group hover:shadow-[0_15px_40px_rgba(0,0,0,0.06)] transition-all duration-300 relative flex flex-col hover:-translate-y-1">
               
               {cat.status === 'inactive' && (
                 <div className="absolute top-0 right-0 bg-red-50 text-red-600 text-[9px] font-bold tracking-widest uppercase px-3 py-1.5 rounded-bl-lg rounded-tr-xl">
                   Inactive
                 </div>
               )}
               
               <div className="mb-5">
                 <div className="text-[9px] text-[#C9A44A] font-bold uppercase tracking-[0.2em] mb-2 bg-[#FDF8E7] inline-block px-2 py-1 rounded-sm">
                    {cat.structure_type === 'single' ? 'Single' : cat.structure_type === 'weight' ? 'Weight' : 'Height'} • {cat.gender || 'Any'} • {cat.age_group || 'Open'}
                 </div>
                 <h3 className="font-heading font-bold text-xl text-[#040A12] uppercase tracking-wide pr-16 leading-tight">{cat.name}</h3>
                 {cat.short_description && <p className="text-xs text-[#040A12]/50 mt-1.5 font-medium">{cat.short_description}</p>}
               </div>

               {(cat.structure_type === 'weight' && cat.weight_divisions && cat.weight_divisions.length > 0) && (
                  <div className="text-[12px] font-medium text-[#040A12]/70 bg-[#F4F5F7] p-3.5 rounded border border-black/5 leading-relaxed mb-6">
                     {cat.weight_divisions.join(' • ')}
                  </div>
               )}
               
               {(cat.structure_type === 'height' && cat.height_divisions && cat.height_divisions.length > 0) && (
                  <div className="text-[12px] font-medium text-[#040A12]/70 bg-[#F4F5F7] p-3.5 rounded border border-black/5 leading-relaxed mb-6">
                     {cat.height_divisions.join(' • ')}
                  </div>
               )}
               
               <div className="flex gap-3 mt-auto pt-4 border-t border-black/5">
                 <button 
                   className="flex-1 py-2.5 text-[10px] font-bold tracking-[0.2em] uppercase bg-[#F4F5F7] hover:bg-[#040A12] text-[#040A12] hover:text-white rounded transition-colors flex items-center justify-center"
                   onClick={() => {
                     setEditingCat(cat);
                     setCatForm({
                       name: cat.name,
                       short_description: cat.short_description || '',
                       age_group: cat.age_group || '',
                       gender: cat.gender || 'Male',
                       structure_type: cat.structure_type || 'single',
                       weight_divisions: cat.weight_divisions || [],
                       height_divisions: cat.height_divisions || [],
                       display_order: cat.display_order || 0,
                       status: cat.status || 'active'
                     });
                     setShowCatModal(true);
                   }}
                 >
                   <Edit2 size={14} className="mr-2" /> Edit
                 </button>
                 <button 
                   className="w-11 flex items-center justify-center text-red-500/70 hover:text-white bg-red-50 hover:bg-red-500 rounded transition-colors shrink-0"
                   onClick={() => handleDeleteCategory(cat.id)}
                   title="Delete Master Category"
                 >
                   <Trash2 size={16} />
                 </button>
               </div>
            </div>
          ))}
        </div>
      )}

      {/* RIGHT SIDE DRAWER */}
      {showCatModal && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" onClick={() => setShowCatModal(false)}></div>
          <div className="relative w-full max-w-lg bg-[var(--surface)] h-full overflow-y-auto border-l border-[var(--border-color)] shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
            
            <div className="p-6 border-b border-[var(--border-color)] flex justify-between items-center sticky top-0 bg-[var(--surface)] z-10">
              <h2 className="font-display text-xl uppercase tracking-widest text-[var(--text-primary)]">
                {editingCat ? 'Edit Master Category' : 'Add Master Category'}
              </h2>
              <button type="button" onClick={() => setShowCatModal(false)} className="text-[var(--muted)] hover:text-white transition-colors p-1">
                 <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSaveCategory} className="p-6 space-y-6 flex-grow flex flex-col">
              
              {catError && (
                <div className="bg-red-500/10 border border-red-500/50 text-red-600 p-4 rounded text-sm shrink-0">
                  {catError}
                </div>
              )}
              
              <div className="space-y-5">
                <div>
                  <label className="block text-xs font-display tracking-widest uppercase text-[var(--muted)] mb-2">Category Name *</label>
                  <Input required value={catForm.name} onChange={e => setCatForm({...catForm, name: e.target.value})} placeholder="e.g. Men's Physique" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-display tracking-widest uppercase text-[var(--muted)] mb-2">Short Description</label>
                    <Input value={catForm.short_description} onChange={e => setCatForm({...catForm, short_description: e.target.value})} placeholder="e.g. Height Classes" />
                  </div>
                  <div>
                    <label className="block text-xs font-display tracking-widest uppercase text-[var(--muted)] mb-2">Division / Age Label</label>
                    <Input value={catForm.age_group} onChange={e => setCatForm({...catForm, age_group: e.target.value})} placeholder="e.g. Open Age" />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-display tracking-widest uppercase text-[var(--muted)] mb-2">Gender</label>
                    <Select value={catForm.gender} onChange={e => setCatForm({...catForm, gender: e.target.value})}>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Mixed">Mixed</option>
                      <option value="Not Specified">Not Specified</option>
                    </Select>
                  </div>
                  <div>
                    <label className="block text-xs font-display tracking-widest uppercase text-[var(--muted)] mb-2">Library Status *</label>
                    <Select required value={catForm.status} onChange={e => setCatForm({...catForm, status: e.target.value})}>
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </Select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-display tracking-widest uppercase text-[var(--muted)] mb-2">Display Order</label>
                  <Input type="number" value={catForm.display_order} onChange={e => setCatForm({...catForm, display_order: parseInt(e.target.value)||0})} />
                </div>

                <div className="border-t border-[var(--border-color)] pt-5 mt-5">
                   <label className="block text-sm font-display tracking-widest uppercase text-[var(--text-primary)] mb-4">Category Structure</label>
                   
                   <div className="grid grid-cols-3 gap-3 mb-5">
                      {['single', 'weight', 'height'].map(type => (
                         <button 
                            key={type}
                            type="button"
                            onClick={() => setCatForm({...catForm, structure_type: type})}
                            className={`p-3 text-center border text-xs tracking-wider uppercase transition-colors ${catForm.structure_type === type ? 'border-[var(--gold)] bg-[var(--gold)]/10 text-[var(--gold)]' : 'border-[var(--border-color)] text-[var(--muted)] hover:border-white/30'}`}
                         >
                            {type === 'single' ? 'Single' : type === 'weight' ? 'Weight' : 'Height'}
                         </button>
                      ))}
                   </div>

                   {catForm.structure_type === 'single' && (
                     <div className="p-4 bg-black/20 border border-[var(--border-color)] text-sm text-[var(--muted)] text-center">
                        No divisions. Athletes register directly into this category.
                     </div>
                   )}

                   {catForm.structure_type === 'weight' && (
                     <div>
                       <label className="block text-xs font-display tracking-widest uppercase text-[var(--gold)] mb-3">Weight Classes</label>
                       <div className="space-y-2 mb-3">
                          {catForm.weight_divisions.map((div, idx) => (
                            <div key={idx} className="flex items-center gap-2 bg-black/20 p-2 border border-white/10">
                              <Input className="h-9 text-sm font-medium" placeholder="e.g. Up to 55 kg" value={div} onChange={e => {
                                 const newDivs = [...catForm.weight_divisions];
                                 newDivs[idx] = e.target.value;
                                 setCatForm({...catForm, weight_divisions: newDivs});
                              }} />
                              <button type="button" onClick={() => {
                                 const newDivs = catForm.weight_divisions.filter((_, i) => i !== idx);
                                 setCatForm({...catForm, weight_divisions: newDivs});
                              }} className="w-9 h-9 flex items-center justify-center text-red-500/70 hover:text-red-500 bg-red-500/10 hover:bg-red-500/20 shrink-0"><Trash2 size={16}/></button>
                            </div>
                          ))}
                       </div>
                       <Button type="button" variant="secondary" className="w-full text-xs h-10 border-dashed border-white/20 hover:border-white/50" onClick={() => setCatForm({...catForm, weight_divisions: [...catForm.weight_divisions, '']})}>
                          + Add Weight Division
                       </Button>
                     </div>
                   )}

                   {catForm.structure_type === 'height' && (
                     <div>
                       <label className="block text-xs font-display tracking-widest uppercase text-[var(--gold)] mb-3">Height Classes</label>
                       <div className="space-y-2 mb-3">
                          {catForm.height_divisions.map((div, idx) => (
                            <div key={idx} className="flex items-center gap-2 bg-black/20 p-2 border border-white/10">
                              <Input className="h-9 text-sm font-medium" placeholder="e.g. Up to 170 cm" value={div} onChange={e => {
                                 const newDivs = [...catForm.height_divisions];
                                 newDivs[idx] = e.target.value;
                                 setCatForm({...catForm, height_divisions: newDivs});
                              }} />
                              <button type="button" onClick={() => {
                                 const newDivs = catForm.height_divisions.filter((_, i) => i !== idx);
                                 setCatForm({...catForm, height_divisions: newDivs});
                              }} className="w-9 h-9 flex items-center justify-center text-red-500/70 hover:text-red-500 bg-red-500/10 hover:bg-red-500/20 shrink-0"><Trash2 size={16}/></button>
                            </div>
                          ))}
                       </div>
                       <Button type="button" variant="secondary" className="w-full text-xs h-10 border-dashed border-white/20 hover:border-white/50" onClick={() => setCatForm({...catForm, height_divisions: [...catForm.height_divisions, '']})}>
                          + Add Height Division
                       </Button>
                     </div>
                   )}
                </div>
              </div>
              
              <div className="mt-auto pt-8 flex justify-end gap-3 sticky bottom-0 bg-[var(--surface)] border-t border-[var(--border-color)] pb-2">
                <Button type="button" variant="secondary" className="px-6" onClick={() => setShowCatModal(false)} disabled={catSaving}>
                  Cancel
                </Button>
                <Button type="submit" variant="primary" disabled={catSaving} className="min-w-[140px]">
                  {catSaving ? <Loader2 size={16} className="animate-spin mx-auto" /> : 'Save Master Category'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminShell>
  );
}
