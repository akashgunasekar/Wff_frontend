import { getActiveAnnouncements } from '@/lib/api';
import Link from 'next/link';

export async function TopAnnouncementBar() {
  const announcement = await getActiveAnnouncements();

  if (!announcement) {
    return null;
  }

  // Strip HTML tags if any, to keep the marquee clean, or just render it as text
  const messageText = announcement.message.replace(/<[^>]*>?/gm, '');

  return (
    <div className="bg-[#040A12] border-b border-white/5 overflow-hidden">
      <div className="w-full flex items-center justify-between h-[36px] text-[11px] md:text-xs tracking-[0.2em] uppercase font-heading font-bold">
        
        {/* Marquee Section */}
        <div 
          className="flex-1 overflow-hidden relative flex items-center h-full"
          style={{ WebkitMaskImage: 'linear-gradient(to right, transparent, black 2%, black 98%, transparent)' }}
        >
          <div className="flex whitespace-nowrap animate-ticker items-center">
            {/* Repeated for seamless scrolling */}
            {[...Array(6)].map((_, i) => (
              <div key={i} className="flex items-center">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#C9A44A] mx-4 shrink-0 shadow-[0_0_8px_rgba(201,164,74,0.6)]" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#BF953F] via-[#FCF6BA] to-[#B38728] drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
                  {messageText}
                </span>
                <span className="mx-8 text-white/20">•</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
