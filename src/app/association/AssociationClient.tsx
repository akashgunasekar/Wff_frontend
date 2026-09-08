"use client";

import { useState, useMemo } from 'react';
import { Official } from '@/types';
import { Container } from '@/components/ui/Container';
import { Phone } from 'lucide-react';
import { cn } from '@/lib/utils';

const InstagramIcon = ({ size = 18 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
  </svg>
);

export default function AssociationClient({ officials }: { officials: Official[] }) {
  const [filter, setFilter] = useState<string>('All');

  const roles = useMemo(() => {
    const uniqueRoles = Array.from(new Set(officials.map(o => o.role)));
    return ['All', ...uniqueRoles];
  }, [officials]);

  const filteredOfficials = useMemo(() => {
    if (filter === 'All') return officials;
    return officials.filter(o => o.role === filter);
  }, [officials, filter]);

  return (
    <div className="py-24 bg-[#F4F5F7]">
      <Container>
        
        {/* Filtering Tabs */}
        <div className="flex flex-wrap justify-center gap-4 mb-20">
          {roles.map(role => (
            <button
              key={role}
              onClick={() => setFilter(role)}
              className={cn(
                "px-7 py-3 rounded-full text-[11px] font-bold uppercase tracking-widest transition-all duration-300 shadow-sm",
                filter === role 
                  ? "bg-[#040A12] text-white border border-[#040A12] shadow-[0_8px_20px_rgba(4,10,18,0.15)]"
                  : "bg-white border border-black/5 text-[#040A12]/60 hover:text-[#040A12] hover:border-[#C9A44A]/40 hover:shadow-md"
              )}
            >
              {role}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {filteredOfficials.map((official) => (
            <div key={official.id} className="bg-white rounded-[20px] overflow-hidden group hover:shadow-[0_20px_50px_rgba(0,0,0,0.08)] shadow-[0_10px_30px_rgba(0,0,0,0.03)] transition-all duration-500 hover:-translate-y-2 border border-black/5">
              
              <div className="h-72 bg-[#040A12] relative flex items-center justify-center overflow-hidden">
                {/* Subtle background glow effect in dark area */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#040A12] via-transparent to-transparent opacity-80 z-10"></div>
                
                {/* Official Photo */}
                <div className="w-full h-full relative z-0 flex justify-center items-center">
                  {official.photo ? (
                    <img 
                      src={official.photo || '/assets/wff-india.png'} 
                      alt={official.name}
                      className="w-full h-full object-cover object-top filter grayscale group-hover:grayscale-0 transition-all duration-700 scale-100 group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-32 h-32 rounded-full bg-white flex items-center justify-center border-4 border-[#C9A44A]/20 shadow-[0_0_30px_rgba(201,164,74,0.15)] group-hover:border-[#C9A44A]/50 transition-colors duration-500 relative z-20">
                      <span className="text-5xl text-[#C9A44A] font-heading">{official.name.charAt(0)}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="p-8 text-center relative z-20 bg-white">
                {/* Glow Line */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#BF953F] via-[#FCF6BA] to-[#B38728]"></div>
                
                <span className="inline-block px-5 py-2 bg-gradient-to-r from-[#BF953F]/10 to-[#B38728]/10 text-[#C9A44A] text-[9px] font-bold uppercase tracking-[0.2em] rounded-sm mb-5">
                  {official.role}
                </span>
                
                <h3 className="font-heading text-[22px] text-[#040A12] uppercase tracking-wider mb-2 leading-snug">{official.name}</h3>
                {official.designation && (
                  <p className="text-[#040A12]/50 text-xs font-bold uppercase tracking-widest mb-6">{official.designation}</p>
                )}

                {(official.instagram || official.phone) && (
                  <div className="flex justify-center gap-4 mt-6 pt-6 border-t border-black/5">
                    {official.instagram && (
                      <a href={official.instagram} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-[#F4F5F7] border border-black/5 flex items-center justify-center text-[#040A12]/60 hover:text-white hover:bg-[#C9A44A] hover:border-[#C9A44A] transition-all duration-300">
                        <InstagramIcon size={16} />
                      </a>
                    )}
                    {official.phone && (
                      <a href={`tel:${official.phone}`} className="w-10 h-10 rounded-full bg-[#F4F5F7] border border-black/5 flex items-center justify-center text-[#040A12]/60 hover:text-white hover:bg-[#C9A44A] hover:border-[#C9A44A] transition-all duration-300">
                        <Phone size={16} />
                      </a>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </Container>
    </div>
  );
}
