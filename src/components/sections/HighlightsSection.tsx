import { ChampionshipHighlight } from '@/types';

interface HighlightsSectionProps {
  highlights: ChampionshipHighlight[];
}

export function HighlightsSection({ highlights }: HighlightsSectionProps) {
  if (!highlights || highlights.length === 0) return null;

  return (
    <section className="py-20 lg:py-24 bg-[var(--surface)]">
      <div className="max-w-[1500px] mx-auto px-6 sm:px-10 lg:px-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-6">

          {/* Left — 5 columns — Large Display */}
          <div className="lg:col-span-5 lg:pr-8">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-px bg-[var(--gold)]" />
              <span className="championship-label">02 / Federation</span>
            </div>

            <h2 className="font-display font-bold text-[clamp(2.2rem,5vw,3.8rem)] uppercase text-[var(--text-primary)] leading-[0.92] tracking-[-0.01em]">
              Why<br />
              Compete<br />
              With <span className="text-[var(--gold)]">WFF?</span>
            </h2>

            <p className="font-body text-[var(--muted)] text-[15px] mt-5 max-w-sm leading-relaxed">
              Every championship is built on the commitment to fair competition, professional production, and athlete-first values.
            </p>
          </div>

          {/* Right — 7 columns — Numbered Items */}
          <div className="lg:col-span-7">
            {highlights.map((item, i) => (
              <div key={item.title} className={`flex items-start gap-5 py-6 ${i > 0 ? 'border-t border-[var(--border-color)]' : ''}`}>
                {/* Number */}
                <span className="font-display font-bold text-[1.75rem] text-[var(--gold)] leading-none shrink-0 w-12 mt-0.5">
                  {String(i + 1).padStart(2, '0')}
                </span>
                {/* Content */}
                <div className="flex-1">
                  <h3 className="font-display font-semibold text-[15px] uppercase tracking-[0.06em] text-[var(--text-primary)] mb-1">
                    {item.title}
                  </h3>
                  <p className="font-body text-[var(--muted)] text-sm leading-relaxed max-w-lg">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
