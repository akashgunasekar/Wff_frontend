"use client";

import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface Faq {
  question: string;
  answer: string;
  active?: boolean;
}

export default function FaqAccordion({ faqs }: { faqs: Faq[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0); // First one open by default
  
  const activeFaqs = faqs.filter(f => f.active !== false);
  
  if (!activeFaqs || activeFaqs.length === 0) return null;

  return (
    <div className="space-y-4">
      {activeFaqs.map((faq, index) => (
        <div key={index} className="bg-wff-surface border border-wff-border dark:border-wff-gold/10 rounded-xl overflow-hidden shadow-sm">
          <button 
            className="w-full px-6 py-5 flex justify-between items-center bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 transition-colors text-left"
            onClick={() => setOpenIndex(openIndex === index ? null : index)}
          >
            <span className="font-heading text-lg uppercase tracking-wider text-wff-text-primary pr-8">{faq.question}</span>
            <span className="text-wff-gold shrink-0">
              {openIndex === index ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </span>
          </button>
          
          <div 
            className={`transition-all duration-300 ease-in-out ${openIndex === index ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}
          >
            <div className="p-6 text-wff-text-body font-medium leading-relaxed prose prose-sm dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: faq.answer }} />
          </div>
        </div>
      ))}
    </div>
  );
}
