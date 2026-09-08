import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { fetchJournalArticles } from '@/lib/api';

export async function JournalSection() {
  const articles = await fetchJournalArticles();

  return (
    <section className="py-20 lg:py-24 bg-[var(--surface)]">
      <div className="max-w-[1500px] mx-auto px-6 sm:px-10 lg:px-16">
        
        <div className="mb-12">
          <h2 className="font-display font-bold text-[clamp(2.5rem,5vw,4rem)] uppercase text-[var(--text-primary)] leading-[0.92] tracking-[-0.01em]">
            WFF Championship<br />
            <span className="text-[var(--gold)]">Journal</span>
          </h2>
          <p className="font-body text-[var(--muted)] text-[15px] mt-4 max-w-lg">
            Stories, insights and updates from the WFF Tamil Nadu championship community.
          </p>
        </div>

        {articles && articles.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              {articles.map((article: any) => (
                <Link href={`/journal/${article.slug || article.id}`} key={article.id} className="group block">
                  <div className="relative aspect-[16/10] bg-[var(--navy)] rounded-sm overflow-hidden mb-5">
                    <Image src={article.cover_image} alt={article.title} fill className="object-cover group-hover:scale-[1.03] transition-transform duration-700" sizes="(max-width: 768px) 100vw, 33vw" loading="lazy" />
                  </div>
                  <span className="font-display font-semibold text-[11px] uppercase tracking-[0.16em] text-[var(--gold)] block mb-2">
                    {article.category}
                  </span>
                  <h3 className="font-display font-bold text-xl uppercase text-[var(--text-primary)] group-hover:text-[var(--gold)] transition-colors leading-tight mb-2">
                    {article.title}
                  </h3>
                  <p className="font-body text-[var(--muted)] text-[14px] leading-relaxed mb-4">
                    {article.excerpt}
                  </p>
                  <span className="font-display font-bold text-[11px] tracking-[0.12em] uppercase text-[var(--text-primary)] group-hover:text-[var(--gold)] transition-colors flex items-center gap-1.5">
                    Read Story <ArrowRight size={14} />
                  </span>
                </Link>
              ))}
            </div>
            <div className="flex justify-end">
              <Link href="/journal" className="inline-flex items-center gap-2 font-display font-bold text-[13px] tracking-[0.12em] uppercase text-[var(--text-primary)] hover:text-[var(--gold)] transition-colors border-b-2 border-transparent hover:border-[var(--gold)] pb-1">
                View All Stories <ArrowRight size={15} />
              </Link>
            </div>
          </>
        ) : (
          <div className="py-12 border-t border-[var(--border-color)]">
             <p className="font-display font-semibold text-[14px] tracking-[0.16em] uppercase text-[var(--muted)]">
               No recent journal entries. Editorial updates will appear here soon.
             </p>
          </div>
        )}

      </div>
    </section>
  );
}
