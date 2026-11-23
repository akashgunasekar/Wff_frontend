import { getActiveAnnouncements } from '@/lib/api';
import { decodeHtml } from '@/lib/utils';
import Link from 'next/link';

export async function TopAnnouncementBar() {
  const data = await getActiveAnnouncements();

  const announcements: any[] = Array.isArray(data)
    ? data
    : (data ? [data] : []);

  if (!announcements.length) {
    return null;
  }

  // Repeat items so marquee loop is smooth
  const repeatCount = announcements.length === 1 ? 6 : (announcements.length === 2 ? 3 : 2);
  const items = Array.from({ length: repeatCount }).flatMap(() => announcements);

  return (
    <div className="bg-[#040A12] border-b border-white/5 overflow-hidden w-full max-w-full">
      <div className="w-full max-w-full overflow-hidden flex items-center justify-between h-[36px] text-xs tracking-[0.05em] uppercase font-heading font-bold min-w-0">
        
        {/* Marquee Section */}
        <div 
          className="flex-1 min-w-0 max-w-full overflow-hidden relative flex items-center h-full"
          style={{ WebkitMaskImage: 'linear-gradient(to right, transparent, black 2%, black 98%, transparent)' }}
        >
          <div className="flex whitespace-nowrap animate-ticker items-center">
            {items.map((ann, i) => {
              const cleanMsg = decodeHtml(ann.message || '').replace(/<[^>]*>?/gm, '');
              const cleanLinkText = ann.link_text ? decodeHtml(ann.link_text).replace(/<[^>]*>?/gm, '') : '';
              return (
                <div key={i} className="flex items-center">
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#C9A44A] mx-4 shrink-0 shadow-[0_0_8px_rgba(201,164,74,0.6)]" />
                  {ann.link_url ? (
                    <Link 
                      href={ann.link_url} 
                      className="group/link flex items-center gap-2 hover:opacity-90 transition-opacity"
                    >
                      <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#BF953F] via-[#FCF6BA] to-[#B38728] drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
                        {cleanMsg}
                      </span>
                      {cleanLinkText && (
                        <span className="text-[10px] tracking-wider text-[#FCF6BA] border border-[#C9A44A]/40 px-1.5 py-0.5 rounded uppercase font-semibold bg-[#C9A44A]/10 group-hover/link:bg-[#C9A44A]/20 transition-colors">
                          {cleanLinkText} &rarr;
                        </span>
                      )}
                    </Link>
                  ) : (
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#BF953F] via-[#FCF6BA] to-[#B38728] drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
                      {cleanMsg}
                    </span>
                  )}
                  <span className="mx-8 text-white/20">•</span>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}
