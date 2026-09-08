import { Award } from '@/types';

interface AwardsSectionProps {
  awards: Award[];
}

export function AwardsSection({ awards }: AwardsSectionProps) {
  return (
    <section className="relative bg-[var(--navy)] text-white overflow-hidden">
      <div className="max-w-[1500px] mx-auto px-6 sm:px-10 lg:px-16 py-16 lg:py-20">

        {/* Large Statement */}
        <h2 className="font-display font-extrabold text-[clamp(2.5rem,7vw,5.5rem)] uppercase leading-[0.88] tracking-[-0.02em] mb-10 lg:mb-12">
          Discipline.<br />
          Determination.<br />
          <span className="text-[var(--gold)]">Excellence.</span>
        </h2>

        {/* 4 Principles — Horizontal */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-0">
          {(awards || [
            { id: 1, title: 'Top 5 Positions', description: 'Exclusive WFF trophies, custom medals, and merit certificates.' },
            { id: 2, title: 'Cash Prizes', description: 'Overall champions and category winners awarded generous prizes.' },
            { id: 3, title: 'Participation Certificates', description: 'Every athlete on stage receives official WFF recognition.' },
            { id: 4, title: 'Media Spotlight', description: 'Featured on WFF India social channels and publications.' },
          ]).map((award, i) => (
            <div key={award.title} className={`py-6 lg:py-0 ${i > 0 ? 'border-t lg:border-t-0 lg:border-l border-white/10 lg:pl-7' : ''} ${i > 1 ? 'border-t lg:border-t-0' : ''}`}>
              <span className="font-display font-bold text-3xl lg:text-4xl text-[var(--gold)] leading-none block mb-3">
                {String(i + 1).padStart(2, '0')}
              </span>
              <h3 className="font-display font-semibold text-sm uppercase tracking-[0.08em] text-white mb-1.5">
                {award.title}
              </h3>
              <p className="font-body text-white/40 text-[13px] leading-relaxed">
                {award.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
