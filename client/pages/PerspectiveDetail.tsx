import { ArrowLeft, ArrowRight, CalendarDays, Share2, Bookmark, Clock, User } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { Layout } from "@/components/site/Layout";
import { Reveal } from "@/components/site/Reveal";
import { perspectives } from "@/data/site";
import { cn } from "@/lib/utils";

export default function PerspectiveDetail() {
  const { slug } = useParams();
  const index = perspectives.findIndex((item) => item.slug === slug);
  const perspective = perspectives[index];

  if (!perspective) {
    return (
      <Layout>
        <section data-header-theme="dark" className="section-padding bg-neutral-950 pt-40 text-white">
          <div className="mx-auto max-w-4xl text-center py-40">
            <p className="eyebrow text-brand-light">Perspective not found</p>
            <h1 className="mt-8 text-5xl font-black tracking-tighter">This article is not available.</h1>
            <Link to="/perspectives" className="btn-brand mt-12 inline-flex items-center">
              <ArrowLeft className="mr-3 h-5 w-5" /> Back to perspectives
            </Link>
          </div>
        </section>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Immersive Article Hero */}
      <section data-header-theme="dark" className="relative isolate min-h-[70vh] overflow-hidden bg-neutral-950 pt-32 text-white">
        <div className="absolute inset-0 -z-10">
          <div className={cn("service-detail-visual absolute inset-0 scale-105 opacity-30 blur-sm", perspective.visual)} />
          <div className="absolute inset-0 bg-gradient-to-b from-neutral-950 via-neutral-950/60 to-neutral-950" />
        </div>
        
        <div className="relative mx-auto max-w-5xl px-4 py-20 sm:px-6 md:px-8">
           <Reveal direction="down">
              <Link to="/perspectives" className="group inline-flex items-center gap-3 text-[0.65rem] font-black uppercase tracking-widest text-white/50 transition hover:text-brand-light">
                 <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
                 Back to Journal
              </Link>
           </Reveal>
           
           <div className="mt-16">
              <Reveal direction="up" delay={0.1}>
                 <div className="flex items-center gap-6">
                    <span className="text-[0.65rem] font-black uppercase tracking-[0.3em] text-brand-light">{perspective.category}</span>
                    <div className="flex items-center gap-2 text-[0.65rem] font-bold text-white/30">
                       <Clock className="h-3 w-3" />
                       <span>5 MIN READ</span>
                    </div>
                 </div>
                 <h1 className="mt-8 text-[clamp(2.5rem,7vw,5.5rem)] font-black leading-[0.95] tracking-tighter text-white">
                   {perspective.title}
                 </h1>
                 <p className="mt-10 text-xl md:text-2xl leading-relaxed text-neutral-300 max-w-3xl antialiased">
                   {perspective.intro}
                 </p>
                 
                 <div className="mt-12 flex items-center justify-between border-t border-white/10 pt-10">
                    <div className="flex items-center gap-4">
                       <div className="h-12 w-12 rounded-full bg-brand/20 flex items-center justify-center text-brand font-black text-sm">TQ</div>
                       <div>
                          <div className="text-sm font-black text-white">T&W Editorial</div>
                          <div className="text-xs text-neutral-500 mt-0.5">{perspective.date}</div>
                       </div>
                    </div>
                    <div className="flex items-center gap-4">
                       <button className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 hover:bg-white/5 transition-colors"><Share2 className="h-4 w-4" /></button>
                       <button className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 hover:bg-white/5 transition-colors"><Bookmark className="h-4 w-4" /></button>
                    </div>
                 </div>
              </Reveal>
           </div>
        </div>
      </section>

      {/* Article Content */}
      <section data-header-theme="light" className="bg-white py-24 lg:py-40">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 md:px-8">
           <div className="grid gap-20">
              {perspective.sections.map((section, idx) => (
                <Reveal key={section.title} delay={idx * 0.1} direction="up">
                   <article className="grid gap-12 lg:grid-cols-[0.35fr_1fr] lg:gap-20">
                      <div className="lg:sticky lg:top-32 h-fit">
                         <span className="text-[0.65rem] font-black uppercase tracking-[0.4em] text-brand">Section 0{idx + 1}</span>
                         <h2 className="mt-6 text-3xl font-black leading-tight tracking-tight text-neutral-950">{section.title}</h2>
                      </div>
                      <div className="prose prose-neutral max-w-none">
                         <p className="text-lg leading-[1.8] text-neutral-600 antialiased">
                            {section.body}
                         </p>
                      </div>
                   </article>
                </Reveal>
              ))}
           </div>
           
           <div className="mt-32 pt-20 border-t border-black/5">
              <Reveal direction="zoom" className="flex flex-col items-center text-center max-w-3xl mx-auto">
                 <h2 className="text-3xl font-black tracking-tighter text-neutral-950">Expert advice is just a <span className="text-brand">conversation away.</span></h2>
                 <p className="mt-6 text-neutral-500 text-lg">Align your project goals with our cost intelligence and technical delivery standards.</p>
                 <div className="mt-10 flex flex-wrap justify-center gap-4">
                    <Link to="/contact" className="btn-brand">Enquire Now</Link>
                    <Link to="/perspectives" className="btn-dark">More Insights</Link>
                 </div>
              </Reveal>
           </div>
        </div>
      </section>
    </Layout>
  );
}
