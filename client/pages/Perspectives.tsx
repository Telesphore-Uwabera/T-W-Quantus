import { useQuery } from "@tanstack/react-query";
import { ArrowRight, CalendarDays, ExternalLink, Bookmark, Share2, Clock, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Layout } from "@/components/site/Layout";
import { Reveal } from "@/components/site/Reveal";
import { company, navigation, services } from "@/data/site";
import type { NewsArticle, PerspectiveDoc } from "@shared/cms";
import { cn } from "@/lib/utils";
import { fetchPublishedPerspectives, fetchServiceNews, readCachedPublicData, readCachedPublicList } from "@/lib/api";
import { AutoSlideBackground } from "@/components/site/AutoSlideBackground";

const staticImages: Record<string, string> = {
  "service-visual-1": "/images/quantity-surveying.webp",
  "service-visual-2": "/images/construction-management.webp",
  "service-visual-3": "/images/site-coordination.webp",
};

export default function Perspectives() {
  const { data: newsData, isLoading: isNewsLoading, isError: isNewsError } = useQuery({
    queryKey: ["news", "services", "home"],
    queryFn: () => fetchServiceNews(),
    initialData: () => readCachedPublicData<{
      articles: NewsArticle[];
      configured: boolean;
      cached?: boolean;
      service?: string | null;
    }>("/api/news/services"),
  });

  const { data: dynamicPerspectives = [], isLoading: isPerspectivesLoading, isError: isPerspectivesError } = useQuery({
    queryKey: ["perspectives", "public"],
    queryFn: fetchPublishedPerspectives,
    initialData: () => readCachedPublicList<PerspectiveDoc>("/api/perspectives"),
  });
  const isWaitingForPerspectives = (isPerspectivesLoading || isPerspectivesError) && dynamicPerspectives.length === 0;

  // Include upcoming perspectives, sorting them to the top (matching home page priority), and limit to 4
  const allPerspectives = [...dynamicPerspectives]
    .sort((a, b) => {
      const aUpcoming = a.category?.toLowerCase() === "upcoming";
      const bUpcoming = b.category?.toLowerCase() === "upcoming";

      if (aUpcoming && !bUpcoming) return -1;
      if (!aUpcoming && bUpcoming) return 1;

      const aDate = new Date(a.date);
      const bDate = new Date(b.date);
      const aValidDate = !isNaN(aDate.getTime()) ? aDate : new Date(a.createdAt);
      const bValidDate = !isNaN(bDate.getTime()) ? bDate : new Date(b.createdAt);

      return bValidDate.getTime() - aValidDate.getTime();
    })
    .slice(0, 4);

  const newsArticles = newsData?.articles ?? [];
  const isWaitingForNews = (isNewsLoading || isNewsError) && newsArticles.length === 0;
  const newsOn = newsData?.configured || isWaitingForNews;

  return (
    <Layout>
      {/* Editorial Hero */}
      <section data-header-theme="dark" className="relative isolate min-h-[70vh] overflow-hidden bg-neutral-950 pt-32 text-white">
        <div className="absolute inset-0 -z-10">
          <div className="page-hero-visual projects absolute inset-0 scale-105 opacity-20 blur-sm" />
          <div className="absolute inset-0 bg-gradient-to-b from-neutral-950 via-neutral-950/60 to-neutral-950" />
        </div>
        
        <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 md:px-8">
          <Reveal direction="down">
            <span className="text-[0.65rem] font-black uppercase tracking-[0.4em] text-brand-light">Insights & Thinking</span>
            <h1 className="mt-8 text-[clamp(2.5rem,8vw,5.5rem)] font-black leading-[0.9] tracking-tighter text-white">
              The <span className="text-brand-light italic font-serif">Quantus</span> <br />
              Perspectives.
            </h1>
            <p className="mt-10 max-w-2xl text-lg font-medium leading-relaxed text-neutral-400 sm:text-2xl">
              Exploring the intersection of cost intelligence, technical delivery, and 
              strategic procurement in the modern built environment.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Featured Insights */}
      <section data-header-theme="light" className="relative z-10 -mt-20 pb-24 lg:pb-40">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
          <div className="grid gap-12">
            {isWaitingForPerspectives ? (
              <div className="flex flex-col items-center justify-center py-32 gap-4">
                <Loader2 className="h-10 w-10 animate-spin text-brand" />
                <span className="text-[0.65rem] font-black uppercase tracking-[0.25em] text-neutral-400">Loading perspectives...</span>
              </div>
            ) : allPerspectives.map((item, index) => {
              const isDynamic = "_id" in item;
              const slug = item.slug;
              const title = item.title;
              const summary = item.summary;
              const category = item.category;
              const date = item.date;
              const visualClass = `service-visual-${(index % 3) + 1}`;
              const imageUrl = isDynamic ? (item as PerspectiveDoc).imageUrl : null;
              const imageUrls = isDynamic && (item as PerspectiveDoc).imageUrls?.length 
                ? (item as PerspectiveDoc).imageUrls 
                : [imageUrl || staticImages[visualClass] || "/images/quantity-surveying.webp"].filter(Boolean) as string[];

              return (
                <Reveal key={slug} delay={index * 0.1} direction="up">
                  <Link
                    to={`/perspectives/${slug}`}
                    className="group relative flex flex-col overflow-hidden rounded-[3rem] border border-black/5 bg-white shadow-2xl transition-all duration-700 hover:-translate-y-2 hover:shadow-brand/5"
                  >
                    <div className="relative h-[250px] sm:h-[350px] lg:h-[450px] w-full overflow-hidden bg-neutral-100 shrink-0">
                      <AutoSlideBackground 
                        images={imageUrls}
                        className="transition-transform duration-[3s] group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
                    </div>
                    <div className="p-8 md:p-12 flex flex-col flex-1 justify-between">
                      <div>
                        <div className="flex items-center gap-6">
                           <span className="text-[0.65rem] font-black uppercase tracking-[0.3em] text-brand">{category}</span>
                           <div className="flex items-center gap-2 text-[0.65rem] font-bold text-neutral-400">
                             <Clock className="h-3 w-3" />
                             <span>5 min read</span>
                           </div>
                        </div>
                        <h2 className="mt-6 text-[clamp(1.75rem,4vw,3.5rem)] font-black leading-[1.05] tracking-tight text-neutral-950 text-pretty group-hover:text-brand transition-colors">
                          {title}
                        </h2>
                        <p className="mt-6 text-lg leading-relaxed text-neutral-600 antialiased">
                          {summary}
                        </p>
                      </div>
                      
                      <div className="mt-10 flex items-center justify-between border-t border-neutral-100 pt-8">
                         <div className="flex items-center gap-4">
                            <div className="h-10 w-10 rounded-full bg-brand/10 flex items-center justify-center text-brand font-black text-xs">TQ</div>
                            <div className="text-xs">
                               <div className="font-black text-neutral-950">T&W Editorial</div>
                               <div className="text-neutral-400 mt-0.5">{date}</div>
                            </div>
                         </div>
                         <div className="flex items-center gap-2">
                            <button className="p-2 text-neutral-300 hover:text-brand transition-colors"><Bookmark className="h-4 w-4" /></button>
                            <button className="p-2 text-neutral-300 hover:text-brand transition-colors"><Share2 className="h-4 w-4" /></button>
                         </div>
                      </div>
                    </div>
                  </Link>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* Global Industry News Marquee/Grid */}
      {newsOn && (
        <section data-header-theme="dark" className="bg-neutral-950 py-32 lg:py-48 relative overflow-hidden">
           <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
           
           <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
            <Reveal className="text-center max-w-3xl mx-auto mb-20" direction="zoom">
               <p className="eyebrow text-brand-light">Market Intelligence</p>
               <h2 className="mt-6 text-5xl font-black tracking-tighter text-white">Global Industry <span className="text-neutral-500 italic font-serif lowercase">Pulse.</span></h2>
            </Reveal>

             {isWaitingForNews ? (
               <div className="flex flex-col items-center justify-center py-24 text-neutral-500 gap-4">
                 <Loader2 className="h-8 w-8 animate-spin text-brand-light" />
                 <span className="text-[0.65rem] font-black uppercase tracking-[0.25em] text-neutral-400">Fetching latest market intelligence...</span>
               </div>
             ) : (
              <div className="grid gap-8 md:grid-cols-2">
                {(newsArticles as NewsArticle[]).slice(0, 4).map((article, index) => (
                  <Reveal key={`${article.url}-${index}`} delay={index * 0.1} direction="up">
                    <a
                      href={article.url}
                      target="_blank"
                      rel="noreferrer"
                      className="group relative flex h-full flex-col overflow-hidden rounded-[2.5rem] border border-white/5 bg-white/[0.02] transition-all duration-500 hover:bg-white/[0.04] hover:border-brand/30"
                    >
                      {article.urlToImage && (
                        <div className="relative aspect-[16/9] overflow-hidden shrink-0">
                          <AutoSlideBackground 
                            images={[article.urlToImage]}
                            className="transition-transform duration-[3s] group-hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/60 to-transparent pointer-events-none" />
                        </div>
                      )}
                      <div className="flex flex-1 flex-col p-8">
                        <div className="flex items-center justify-between">
                           <span className="text-[0.6rem] font-black uppercase tracking-widest text-brand-light/60">{article.source || "Industry News"}</span>
                           <ExternalLink className="h-4 w-4 text-neutral-600 transition-colors group-hover:text-brand-light" />
                        </div>
                        <h3 className="mt-6 text-xl font-black leading-tight text-white group-hover:text-brand-light transition-colors">
                          {article.title}
                        </h3>
                        <p className="mt-4 flex-1 line-clamp-2 text-sm text-neutral-400 antialiased">
                          {article.description}
                        </p>
                        <div className="mt-8 flex items-center gap-3 text-[0.6rem] font-bold uppercase tracking-widest text-neutral-600">
                           <CalendarDays className="h-3 w-3" />
                           {article.publishedAt ? new Date(article.publishedAt).toLocaleDateString("en-GB", { day: '2-digit', month: 'short', year: 'numeric' }) : "Recent"}
                        </div>
                      </div>
                    </a>
                  </Reveal>
                ))}
              </div>
             )}
            
            <div className="mt-20" />
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="section-padding bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
           <div className="rounded-[4rem] bg-neutral-100 p-12 lg:p-24 flex flex-col items-center text-center">
              <Reveal direction="zoom">
                 <h2 className="text-[clamp(1.75rem,4vw,3.5rem)] font-black tracking-tighter text-neutral-950">
                    Stay informed. Stay ahead.
                 </h2>
                 <p className="mt-8 text-xl text-neutral-500 max-w-2xl">
                    Subscribe to our quarterly perspective summary for insights on cost certainty 
                    and project delivery in the East African market.
                 </p>
                 <div className="mt-12 flex flex-wrap justify-center gap-4">
                    <Link to="/contact" className="btn-brand">
                       Get in touch
                    </Link>
                    <Link to="/services" className="btn-dark">
                       Our Services
                    </Link>
                 </div>
              </Reveal>
           </div>
        </div>
      </section>
    </Layout>
  );
}
