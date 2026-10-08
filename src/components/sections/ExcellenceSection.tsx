import { Container } from '@/components/ui/Container';
import { Reveal } from '@/components/ui/Reveal';
import { Gem, Medal, Users, BarChart3 } from 'lucide-react';
import Image from 'next/image';

export function ExcellenceSection() {
  const principles = [
    { 
      icon: Gem, 
      title: 'Precision', 
      desc: 'Exact standards for natural fitness competitions.' 
    },
    { 
      icon: Medal, 
      title: 'Fairness', 
      desc: 'A level playing field for every athlete.' 
    },
    { 
      icon: Users, 
      title: 'Support', 
      desc: 'A positive, respectful fitness community.' 
    },
    { 
      icon: BarChart3, 
      title: 'Professionalism', 
      desc: 'World-class event execution and governance.' 
    }
  ];

  return (
    <section className="w-full py-16 sm:py-20 lg:py-28 bg-white relative overflow-hidden">
      
      {/* Background Watermark Element */}
      <div className="absolute right-[-10%] top-1/2 -translate-y-1/2 opacity-[0.03] pointer-events-none z-0 rotate-12 scale-[1.2] sm:scale-[1.5]">
        <div className="w-[400px] h-[400px] sm:w-[600px] sm:h-[600px] rounded-full border-[20px] sm:border-[30px] border-dashed border-black flex items-center justify-center">
          <div className="w-[300px] h-[300px] sm:w-[500px] sm:h-[500px] rounded-full border-[8px] sm:border-[10px] border-black flex items-center justify-center">
             <span className="font-heading font-black text-[120px] sm:text-[180px] text-black">WFF</span>
          </div>
        </div>
      </div>

      <div className="w-[92%] xl:w-[90%] max-w-[1800px] mx-auto text-center relative z-10">
        
        {/* Header */}
        <Reveal direction="up">
          <div className="flex flex-col items-center mb-10 sm:mb-16 lg:mb-20">
            <div className="flex items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
              <div className="w-8 sm:w-10 h-px bg-wff-gold" />
              <span className="font-heading font-semibold text-[11px] sm:text-[13px] tracking-[0.2em] uppercase text-wff-gold">
                Our Values
              </span>
              <div className="w-8 sm:w-10 h-px bg-wff-gold" />
            </div>
            
            <h2 className="font-heading font-bold text-3xl sm:text-4xl md:text-5xl lg:text-[56px] uppercase leading-[1.08] tracking-tight mb-4 sm:mb-5">
              <span className="text-wff-deep-navy">The Mark Of </span>
              <span className="text-wff-gold">Excellence</span>
            </h2>
            
            <p className="font-body text-wff-muted text-[13.5px] sm:text-[15px] md:text-[16px] max-w-[700px] leading-[1.6]">
              The principles that shape every WFF championship, from fair judging to professional event execution, creating a platform that athletes can be proud to be part of.
            </p>
          </div>
        </Reveal>

        {/* 4 Column Values Grid with Borders */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-6 lg:gap-0">
          {principles.map((item, idx) => {
            const isLast = idx === principles.length - 1;
            const Icon = item.icon;
            
            return (
              <Reveal key={item.title} delay={idx * 150} direction="up" className={`flex flex-col items-center px-4 lg:px-8 py-2 sm:py-4 ${!isLast ? 'lg:border-r lg:border-black/[0.08]' : ''} ${idx % 2 === 0 ? 'sm:max-lg:border-r sm:max-lg:border-black/[0.08]' : ''}`}>
                {/* Icon */}
                <div className="mb-4 sm:mb-6 transform transition-transform duration-500 hover:scale-110 hover:-translate-y-1.5">
                  <Icon size={44} strokeWidth={1.5} className="text-[#C9A44A] sm:w-14 sm:h-14" />
                </div>
                
                {/* Title */}
                <h3 className="font-heading font-bold text-lg sm:text-xl uppercase tracking-wider text-wff-deep-navy mb-2 sm:mb-3">
                  {item.title}
                </h3>
                
                {/* Description */}
                <p className="font-body text-[13px] sm:text-[14px] text-wff-muted leading-[1.6] max-w-[240px]">
                  {item.desc}
                </p>
              </Reveal>
            );
          })}
        </div>
        
      </div>
    </section>
  );
}
