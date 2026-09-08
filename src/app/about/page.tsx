import { fetchAboutData } from '@/lib/api';
import { Container } from '@/components/ui/Container';
import { Target, Eye, Star, User } from 'lucide-react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About | WFF Tamil Nadu',
  description: 'Learn about the World Fitness Federation Tamil Nadu branch, our mission, vision, and leadership.',
};

export default async function AboutPage() {
  const data: any = await fetchAboutData();

  // Create an array for the mission/vision/values to render easily
  const principles = [
    {
      icon: <Target size={36} className="text-[#C9A44A]" />,
      title: data.mission.title,
      description: data.mission.description,
    },
    {
      icon: <Eye size={36} className="text-[#C9A44A]" />,
      title: data.vision.title,
      description: data.vision.description,
    }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-[#F4F5F7] pb-24">
      {/* Hero Section */}
      <section className="relative w-full h-[60vh] min-h-[450px] flex items-center justify-center overflow-hidden border-b-2 border-[#C9A44A]">
        <div className="absolute inset-0 z-0 bg-[#040A12]">
          <img 
            src={data.heroImage || '/assets/wff_hero_banner.png'} 
            alt={data.heroTitle}
            className="w-full h-full object-cover object-center opacity-40 mix-blend-overlay grayscale"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#040A12]/90 via-[#040A12]/60 to-[#040A12]"></div>
        </div>
        
        <Container className="relative z-10 text-center">
          <div className="inline-block mb-8 rounded-full bg-gradient-to-r from-[#BF953F] via-[#FCF6BA] to-[#B38728] text-[#040A12] font-heading font-bold px-8 py-2.5 text-[12px] tracking-[0.25em] uppercase shadow-[0_4px_15px_rgba(198,161,91,0.2)] animate-fade-up">
            Official State Chapter
          </div>
          <h1 className="font-heading text-5xl md:text-7xl lg:text-[80px] text-white uppercase leading-[0.95] tracking-tight mb-6 drop-shadow-2xl animate-fade-up [animation-delay:100ms] max-w-5xl mx-auto font-bold">
            {(() => {
              const text = data.heroTitle || 'About World Fitness Federation Tamil Nadu';
              const words = text.split(' ');
              if (words.length <= 2) return text;
              const lastTwo = words.slice(-2).join(' ');
              const rest = words.slice(0, -2).join(' ');
              return (
                <>
                  {rest} <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#BF953F] via-[#FCF6BA] to-[#B38728]">{lastTwo}</span>
                </>
              );
            })()}
          </h1>
          <h2 className="font-heading text-lg md:text-xl text-[#C9A44A] uppercase tracking-[0.3em] font-bold animate-fade-up [animation-delay:200ms]">
            {data.heroSubtitle}
          </h2>
        </Container>
      </section>

      <Container className="mt-24">
        {/* Our Story */}
        <div className="max-w-5xl mx-auto text-center mb-32 relative">
          <div className="absolute -top-12 left-1/2 -translate-x-1/2 text-[120px] text-[#040A12]/5 font-heading leading-none z-0 hidden md:block">STORY</div>
          <div className="relative z-10">
            <h3 className="text-[#C9A44A] font-bold tracking-[0.3em] text-xs uppercase mb-4">The Federation</h3>
            <h2 className="font-heading text-4xl md:text-5xl text-[#040A12] uppercase tracking-wide mb-10">Our Story</h2>
            
            <div className="bg-white p-10 md:p-14 rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-black/5 relative">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-[#BF953F] via-[#FCF6BA] to-[#B38728]"></div>
              <p className="text-lg md:text-2xl text-[#040A12]/80 leading-[1.8] font-medium max-w-4xl mx-auto">
                {data.introduction}
              </p>
            </div>
          </div>
        </div>

        {/* Mission & Vision */}
        <div className="grid md:grid-cols-2 gap-8 mb-32">
          {principles.map((item, i) => (
            <div key={i} className="bg-[#040A12] p-12 rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.2)] group relative overflow-hidden transition-transform duration-500 hover:-translate-y-2">
              <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-[#BF953F] via-[#FCF6BA] to-[#B38728]"></div>
              
              <div className="flex flex-col items-center text-center relative z-10">
                <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-8 shadow-sm border border-white/10 group-hover:scale-110 group-hover:bg-[#C9A44A]/10 group-hover:border-[#C9A44A]/30 transition-all duration-500">
                  {item.icon}
                </div>
                <h3 className="font-heading text-3xl text-white uppercase tracking-wider mb-5 group-hover:text-[#C9A44A] transition-colors">{item.title}</h3>
                <p className="text-white/70 leading-[1.8] font-medium text-lg">
                  {item.description}
                </p>
              </div>
              
              {/* Background accent */}
              <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-[#C9A44A]/5 rounded-full blur-3xl group-hover:bg-[#C9A44A]/10 transition-colors duration-700"></div>
            </div>
          ))}
        </div>

        {/* Values */}
        <div className="mb-32">
          <div className="text-center mb-16">
            <h3 className="text-[#C9A44A] font-bold tracking-[0.3em] text-xs uppercase mb-4">What We Stand For</h3>
            <h2 className="font-heading text-4xl md:text-5xl text-[#040A12] uppercase tracking-wide">Core Values</h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {data.values.map((value: any, idx: number) => (
              <div key={value.id || idx} className="bg-white border border-black/5 p-10 rounded-xl text-center shadow-[0_15px_40px_rgba(0,0,0,0.04)] hover:shadow-[0_20px_50px_rgba(198,161,91,0.15)] transition-all duration-500 hover:-translate-y-2 group">
                <div className="flex justify-center mb-6">
                  <div className="w-16 h-16 rounded-full bg-[#040A12] flex items-center justify-center group-hover:bg-gradient-to-br from-[#BF953F] to-[#B38728] transition-colors duration-500">
                    <Star size={24} className="text-[#C9A44A] group-hover:text-white transition-colors" />
                  </div>
                </div>
                <h4 className="font-heading text-2xl text-[#040A12] uppercase tracking-wide mb-4">{value.title}</h4>
                <p className="text-[15px] text-[#040A12]/60 font-medium leading-[1.7]">{value.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Leadership Snippet */}
        <div className="bg-[#040A12] rounded-2xl p-12 md:p-20 shadow-[0_30px_60px_rgba(0,0,0,0.4)] relative overflow-hidden mb-8">
          <div className="absolute inset-0 bg-gradient-to-br from-[#BF953F]/10 via-transparent to-transparent opacity-50 z-0"></div>
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#BF953F] via-[#FCF6BA] to-[#B38728]"></div>
          
          <div className="relative z-10 text-center max-w-4xl mx-auto">
            <User size={48} className="text-[#C9A44A] mx-auto mb-8 opacity-90" />
            <h3 className="font-heading text-3xl md:text-5xl text-transparent bg-clip-text bg-gradient-to-r from-[#BF953F] via-[#FCF6BA] to-[#B38728] uppercase tracking-wider mb-8 drop-shadow-sm">
              Championship Philosophy
            </h3>
            <p className="text-xl md:text-3xl text-white/90 font-medium leading-[1.6] italic tracking-wide">
              "{data.philosophy}"
            </p>
          </div>
        </div>
      </Container>
    </div>
  );
}
