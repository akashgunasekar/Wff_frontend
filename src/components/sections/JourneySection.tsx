import Link from 'next/link';

export function JourneySection() {
  const steps = [
    {
      id: '01',
      title: 'Discover',
      desc: 'Explore championships, categories and competition opportunities.'
    },
    {
      id: '02',
      title: 'Prepare',
      desc: 'Understand the competition requirements and prepare for the stage.'
    },
    {
      id: '03',
      title: 'Register',
      desc: 'Choose your championship and complete your official registration.'
    },
    {
      id: '04',
      title: 'Compete',
      desc: 'Step onto the WFF Tamil Nadu championship stage.'
    }
  ];

  return (
    <section className="py-20 lg:py-24 bg-white border-t border-[var(--border-color)]">
      <div className="max-w-[1500px] mx-auto px-6 sm:px-10 lg:px-16">
        
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-px bg-[var(--gold)]" />
              <span className="font-display font-medium text-[11px] tracking-[0.20em] uppercase text-[var(--gold)]">
                Athlete Pathway
              </span>
            </div>
            <h2 className="font-display font-bold text-[clamp(2.5rem,5vw,3.5rem)] uppercase text-[var(--text-primary)] leading-[0.92] tracking-[-0.01em]">
              Your Journey To<br />
              The WFF Stage
            </h2>
          </div>
          <Link
            href="/events"
            className="inline-flex items-center justify-center h-[46px] px-8 bg-[var(--navy)] text-white font-display font-bold text-[12px] tracking-[0.10em] uppercase rounded-sm hover:bg-[var(--gold)] hover:text-[var(--navy)] transition-all shrink-0"
          >
            Explore Championships
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6">
          {steps.map((step, i) => (
            <div key={step.id} className="relative">
              {/* Optional connector line on desktop */}
              {i < steps.length - 1 && (
                <div className="hidden lg:block absolute top-6 left-12 right-0 h-px bg-[var(--border-color)]" />
              )}
              
              <span className="relative z-10 font-display font-extrabold text-[2.5rem] text-[var(--gold)] bg-[var(--bg)] pr-4 block mb-4 leading-none">
                {step.id}
              </span>
              <h3 className="font-display font-bold text-lg uppercase tracking-[0.05em] text-[var(--text-primary)] mb-2">
                {step.title}
              </h3>
              <p className="font-body text-[var(--muted)] text-[14px] leading-relaxed max-w-[260px]">
                {step.desc}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
