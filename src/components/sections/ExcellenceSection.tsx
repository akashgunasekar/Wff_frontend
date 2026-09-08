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
    <section className="w-full py-24 lg:py-28 bg-white relative overflow-hidden">
      
      {/* Background Watermark Element */}
      <div className="absolute right-[-10%] top-1/2 -translate-y-1/2 opacity-[0.03] pointer-events-none z-0 rotate-12 scale-[1.5]">
        <div className="w-[600px] h-[600px] rounded-full border-[30px] border-dashed border-black flex items-center justify-center">
          <div className="w-[500px] h-[500px] rounded-full border-[10px] border-black flex items-center justify-center">
             <span className="font-heading font-black text-[180px] text-black">WFF</span>
          </div>
        </div>
      </div>

      <div className="w-[95%] xl:w-[90%] max-w-[1800px] mx-auto text-center relative z-10">
        
        {/* Header */}
        <Reveal direction="up">
          <div className="flex flex-col items-center mb-16 lg:mb-20">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-10 h-px bg-wff-gold" />
              <span className="font-heading font-semibold text-[13px] tracking-[0.2em] uppercase text-wff-gold">
                Our Values
              </span>
              <div className="w-10 h-px bg-wff-gold" />
            </div>
            
            <h2 className="font-heading font-bold text-4xl md:text-5xl lg:text-[56px] uppercase leading-[1.1] tracking-tight mb-5">
              <span className="text-wff-deep-navy">The Mark Of </span>
              <span className="text-wff-gold">Excellence</span>
            </h2>
            
            <p className="font-body text-wff-muted text-[15px] md:text-[16px] max-w-[700px] leading-[1.65]">
              The principles that shape every WFF championship, from fair judging to professional event execution, creating a platform that athletes can be proud to be part of.
            </p>
          </div>
        </Reveal>

        {/* 4 Column Values Grid with Borders */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-y-12">
          {principles.map((item, idx) => {
            const isLast = idx === principles.length - 1;
            const Icon = item.icon;
            
            return (
              <Reveal key={item.title} delay={idx * 150} direction="up" className={`flex flex-col items-center px-4 lg:px-8 py-4 ${!isLast ? 'lg:border-r lg:border-black/[0.08]' : ''} ${idx % 2 === 0 ? 'md:border-r md:border-black/[0.08]' : ''}`}>
                {/* Icon */}
                <div className="mb-6 transform transition-transform duration-500 hover:scale-110 hover:-translate-y-2">
                  <Icon size={56} strokeWidth={1.5} className="text-[#C9A44A]" />
                </div>
                
                {/* Title */}
                <h3 className="font-heading font-bold text-xl uppercase tracking-wider text-wff-deep-navy mb-3">
                  {item.title}
                </h3>
                
                {/* Description */}
                <p className="font-body text-[14px] text-wff-muted leading-[1.65] max-w-[220px]">
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
