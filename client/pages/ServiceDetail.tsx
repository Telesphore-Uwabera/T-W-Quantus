import { ArrowLeft, ArrowRight, CheckCircle2, ChevronRight, MapPin } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Layout } from "@/components/site/Layout";
import { Reveal } from "@/components/site/Reveal";
import { company, services } from "@/data/site";
import { cn } from "@/lib/utils";

const serviceBackdrops = [
  "service-visual-1",
  "service-visual-2",
  "service-visual-3",
  "service-visual-4",
];

export default function ServiceDetail() {
  const { slug } = useParams();
  const serviceIndex = services.findIndex((item) => item.slug === slug);
  const service = services[serviceIndex];
  const visual = serviceBackdrops[serviceIndex] ?? "service-visual-1";
  
  /** Different layout variants based on service index for a "unique" feel for each page. */
  const variant = serviceIndex % 4;
  const isMinimal = variant === 0;
  const isMosaic = variant === 1;
  const isDarkEditorial = variant === 2;
  const isTechnical = variant === 3;

  if (!service) {
    return (
      <Layout>
        <section data-header-theme="dark" className="section-padding bg-neutral-950 pt-40 text-white">
          <div className="mx-auto max-w-4xl">
            <p className="eyebrow text-brand-light">Service not found</p>
            <h1 className="mt-5 text-5xl font-black">This service page is not available.</h1>
            <Link to="/services" className="btn-brand mt-8">
              Back to services <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </section>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Dynamic Hero Section */}
      <section data-header-theme="dark" className="relative isolate min-h-[75vh] overflow-hidden bg-neutral-950 pt-32 text-white lg:min-h-[85vh]">
        <div className={cn("service-detail-visual absolute inset-0 transition-transform duration-[3s] hover:scale-110", visual)} />
        <div className="absolute inset-0 bg-gradient-to-r from-neutral-950 via-neutral-950/80 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-transparent to-transparent" />
        
        <div className="relative mx-auto h-full max-w-7xl px-4 pb-20 sm:px-6 md:px-8">
          <div className="flex h-full flex-col justify-end lg:pb-12">
            <Reveal direction="down" delay={0.1}>
              <Link
                to="/services"
                className="group inline-flex items-center gap-3 text-[0.65rem] font-black uppercase tracking-[0.25em] text-white/50 transition hover:text-brand-light"
              >
                <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
                Back to Services
              </Link>
            </Reveal>

            <div className="mt-12 grid gap-12 lg:grid-cols-[1fr_0.4fr] lg:items-end">
              <div>
                <Reveal direction="left" delay={0.2}>
                  <div className="flex items-center gap-4">
                    <span className="h-px w-8 bg-brand" />
                    <span className="text-[0.65rem] font-black uppercase tracking-[0.3em] text-brand-light">
                      {company.shortName} / Pillar {service.number}
                    </span>
                  </div>
                  <h1 className="mt-6 text-[clamp(2.5rem,7vw,5.5rem)] font-black leading-[0.92] tracking-tighter text-white">
                    {service.title}
                  </h1>
                </Reveal>
                
                <Reveal direction="up" delay={0.3}>
                  <p className="mt-10 max-w-2xl text-lg font-medium leading-relaxed text-neutral-300/90 sm:text-xl">
                    {service.pageIntro}
                  </p>
                </Reveal>
              </div>

              <Reveal direction="rotate" delay={0.4} className="hidden lg:block">
                <div className="rounded-[2.5rem] border border-white/10 bg-white/5 p-8 backdrop-blur-xl">
                  <div className="flex flex-col gap-6">
                    {service.highlights?.slice(0, 3).map((h, i) => (
                      <div key={h} className="flex items-center gap-4">
                        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand/20 text-xs font-black text-brand-light">
                          0{i + 1}
                        </span>
                        <span className="text-[0.65rem] font-black uppercase tracking-widest text-white/80">{h}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </Reveal>
            </div>
          </div>
        </div>

        {/* Floating background numbers */}
        <div className="pointer-events-none absolute -bottom-12 right-0 select-none text-[12vw] font-black leading-none text-white/[0.03]">
          {service.number}
        </div>
      </section>

      {/* Main Content Area with Variant-based layouts */}
      <section 
        data-header-theme={isDarkEditorial ? "dark" : "light"}
        className={cn(
          "section-padding relative overflow-hidden transition-colors duration-700",
          isDarkEditorial ? "bg-neutral-900 text-white" : "bg-white text-neutral-950"
        )}
      >
        {isMinimal && <div className="absolute top-0 right-0 w-1/3 h-full bg-neutral-50 -z-10" />}
        
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
          <div className={cn(
            "grid gap-16 lg:grid-cols-[0.8fr_1.2fr] lg:gap-24",
            isMosaic && "lg:grid-cols-1"
          )}>
            <div className={cn("sticky top-32 h-fit", isMosaic && "lg:static lg:max-w-4xl")}>
              <Reveal direction="up">
                <p className={cn("eyebrow", isDarkEditorial ? "text-brand-light" : "text-brand")}>Service Intelligence</p>
                <h2 className="mt-4 text-[clamp(1.8rem,4vw,3.25rem)] font-black leading-[1.05] tracking-tight">
                  {service.pageTitle}
                </h2>
                <p className={cn(
                  "mt-8 text-lg leading-relaxed",
                  isDarkEditorial ? "text-neutral-400" : "text-neutral-600"
                )}>
                  {service.summary}
                </p>
                <div className="mt-12 flex flex-col gap-5 sm:flex-row">
                  <Link to="/contact" className="btn-brand">
                    Request Consultation
                  </Link>
                  <a href={company.whatsappHref} className={cn(
                    "flex items-center justify-center gap-3 rounded-full border px-8 py-4 text-sm font-black uppercase tracking-widest transition-all",
                    isDarkEditorial ? "border-white/10 bg-white/5 hover:bg-white/10" : "border-black/10 bg-black/5 hover:bg-black/10"
                  )}>
                    Quick Query
                  </a>
                </div>
              </Reveal>
            </div>

            <div className={cn(
              "grid gap-6",
              isMosaic ? "md:grid-cols-2 lg:grid-cols-2" : "grid-cols-1"
            )}>
              {service.detailGroups.map((group, idx) => (
                <Reveal 
                  key={group.title} 
                  delay={idx * 0.1} 
                  direction={isMosaic ? "scale" : "left"}
                  className="h-full"
                >
                  <div className={cn(
                    "group h-full rounded-[2.5rem] border p-8 transition-all duration-500 md:p-12",
                    isDarkEditorial 
                      ? "border-white/5 bg-white/[0.02] hover:bg-white/[0.04]" 
                      : "border-black/5 bg-neutral-50/50 hover:bg-white hover:shadow-2xl hover:shadow-black/5"
                  )}>
                    <div className="flex items-center justify-between">
                      <span className={cn(
                        "text-[0.65rem] font-black uppercase tracking-[0.3em]",
                        isDarkEditorial ? "text-brand-light/40" : "text-brand/40"
                      )}>
                        Method 0{idx + 1}
                      </span>
                      <ChevronRight className="h-5 w-5 text-neutral-300 opacity-0 transition-all group-hover:translate-x-1 group-hover:opacity-100" />
                    </div>
                    <h3 className="mt-6 text-2xl font-black leading-tight sm:text-3xl">
                      {group.title}
                    </h3>
                    
                    <ul className="mt-10 space-y-5">
                      {group.items.map((item) => (
                        <li key={item} className="flex gap-4">
                          <CheckCircle2 className="mt-1 h-5 w-5 shrink-0 text-brand" />
                          <span className={cn(
                            "text-base font-medium leading-relaxed",
                            isDarkEditorial ? "text-neutral-400" : "text-neutral-600"
                          )}>
                            {item}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Experience / Case Study Callout */}
      <section className="bg-neutral-950 py-24 text-white lg:py-36">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
          <div className="rounded-[3rem] border border-white/5 bg-white/[0.02] p-12 lg:p-24 relative overflow-hidden">
             <div className="absolute top-0 right-0 w-64 h-64 bg-brand/10 blur-[120px]" />
             
             <div className="relative z-10 grid gap-16 lg:grid-cols-[1fr_0.8fr] lg:items-center">
                <div>
                  <Reveal direction="left">
                    <p className="eyebrow text-brand-light">Delivery assurance</p>
                    <h2 className="mt-6 text-[clamp(2rem,5vw,4rem)] font-black leading-[1.02] tracking-tighter">
                      Turning project complexity into 
                      <span className="block text-brand-light">predictable outcomes.</span>
                    </h2>
                    <p className="mt-8 text-xl text-neutral-400 max-w-xl">
                      Our {service.title.toLowerCase()} framework is built on a foundation 
                      of data-driven insights and rigorous site coordination.
                    </p>
                  </Reveal>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                   {[
                     { label: "Precision", val: "100%" },
                     { label: "Integrity", val: "A+" },
                     { label: "Regions", val: "East Africa" },
                     { label: "Standards", val: "Global" }
                   ].map((stat, i) => (
                     <Reveal key={stat.label} delay={i * 0.1} direction="zoom">
                        <div className="rounded-3xl border border-white/5 bg-white/5 p-6 text-center">
                           <div className="text-2xl font-black text-white">{stat.val}</div>
                           <div className="text-[0.6rem] font-bold uppercase tracking-widest text-neutral-500 mt-1">{stat.label}</div>
                        </div>
                     </Reveal>
                   ))}
                </div>
             </div>
          </div>
        </div>
      </section>

      <section data-header-theme="dark" className="relative isolate overflow-hidden bg-neutral-950 py-32 text-white">
        <div className={cn("service-detail-visual absolute inset-0 -z-10 opacity-20 blur-xl", visual)} />
        <div className="absolute inset-0 -z-10 bg-neutral-950/80" />
        
        <Reveal className="mx-auto flex max-w-7xl flex-col items-center text-center px-4" direction="zoom">
          <p className="eyebrow text-brand-light">Discuss a Project</p>
          <h2 className="mt-8 max-w-4xl text-[clamp(1.8rem,5vw,4rem)] font-black leading-[1.02] tracking-tighter">
            Ready to secure your project's
            <span className="block text-brand-light">cost and delivery?</span>
          </h2>
          <div className="mt-12 flex flex-wrap justify-center gap-4">
            <Link to="/contact" className="btn-brand">
              Contact T&W Quantus
            </Link>
            <Link to="/projects" className="btn-dark">
              View Our Work
            </Link>
          </div>
        </Reveal>
      </section>
    </Layout>
  );
}
