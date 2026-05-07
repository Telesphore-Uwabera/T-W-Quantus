import { ArrowRight, ChevronRight } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Layout } from "@/components/site/Layout";
import { Reveal } from "@/components/site/Reveal";
import { services } from "@/data/site";
import { cn } from "@/lib/utils";

const getServiceId = (title: string) =>
  title
    .toLowerCase()
    .replace(/&/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

const SECTION_IDS = services.map((s) => getServiceId(s.title));

const SCROLL_PIN_OFFSET = 140;

const SERVICE_RAIL_LABEL: Record<string, string> = {
  "quantity-surveying-cost-management": "Cost Management",
  "construction-management": "Construction Mgmt",
  "project-management": "Project Mgmt",
  "construction-technical-services": "Technical Services",
};

function railLabel(slug: string, fallback: string) {
  return SERVICE_RAIL_LABEL[slug] ?? fallback.replace(/\s+Services$/i, "").replace(/&/g, "").split(" ")[0];
}

function initialRailIndexFromHash() {
  if (typeof window === "undefined") return 0;
  const hash = window.location.hash.replace(/^#/, "");
  const idx = SECTION_IDS.indexOf(hash);
  return idx >= 0 ? idx : 0;
}

function useServicesRailActive() {
  const [activeIndex, setActiveIndex] = useState(initialRailIndexFromHash);

  useEffect(() => {
    const update = () => {
      const y = window.scrollY + SCROLL_PIN_OFFSET;
      let idx = 0;
      SECTION_IDS.forEach((id, i) => {
        const el = document.getElementById(id);
        if (!el) return;
        const top = el.getBoundingClientRect().top + window.scrollY;
        if (top <= y) idx = i;
      });
      setActiveIndex((p) => (p === idx ? p : idx));
    };

    update();
    const onHash = () => setActiveIndex(initialRailIndexFromHash());
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    window.addEventListener("hashchange", onHash);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
      window.removeEventListener("hashchange", onHash);
    };
  }, []);

  return activeIndex;
}

function detailCardKey(slug: string, groupTitle: string) {
  return `${slug}::${groupTitle}`;
}

export default function Services() {
  const activeIndex = useServicesRailActive();
  const [detailOpen, setDetailOpen] = useState<Set<string>>(() => new Set());
  const [detailHover, setDetailHover] = useState<string | null>(null);

  const toggleDetail = useCallback((key: string) => {
    setDetailOpen((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }, []);

  return (
    <Layout>
      <section
        data-header-theme="dark"
        className="relative isolate overflow-hidden bg-neutral-950 px-4 pb-24 pt-32 text-white sm:px-6 sm:pb-32 sm:pt-40 md:px-8 md:pb-40 md:pt-48"
      >
        <div className="pointer-events-none absolute inset-0 opacity-[0.65]" aria-hidden>
          <div className="page-hero-visual absolute inset-0 scale-110 page-hero-services opacity-40 blur-sm" />
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 2 }}
            className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(43,143,148,0.15),transparent_50%),radial-gradient(circle_at_80%_70%,rgba(23,102,106,0.15),transparent_50%)]" 
          />
        </div>
        
        <div className="relative mx-auto max-w-7xl">
          <div className="flex flex-col gap-12 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-4xl">
              <Reveal direction="down" delay={0.1}>
                <span className="inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-[0.65rem] font-black uppercase tracking-[0.25em] text-brand-light backdrop-blur-md">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand-light opacity-75" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-brand" />
                  </span>
                  Capabilities 2026
                </span>
              </Reveal>
              
              <Reveal direction="clip" delay={0.2}>
                <h1 className="mt-8 text-[clamp(2.5rem,8vw,5.5rem)] font-black leading-[0.9] tracking-[-0.04em] text-white text-pretty">
                  Built environment
                  <span className="block text-brand-light">solutions.</span>
                </h1>
              </Reveal>
              
              <Reveal direction="up" delay={0.3}>
                <p className="mt-10 max-w-2xl text-lg font-medium leading-relaxed text-neutral-400 sm:text-xl">
                  Integrated delivery model combining strategic cost management, 
                  site execution, and program leadership calibrated for East African realities.
                </p>
              </Reveal>
            </div>
            
            <Reveal direction="left" delay={0.4} className="hidden lg:block">
              <div className="flex items-center gap-6 border-l border-white/10 pl-10">
                <div className="text-right">
                  <div className="text-4xl font-black text-white">04</div>
                  <div className="text-[0.65rem] font-bold uppercase tracking-widest text-neutral-500">Service Pillars</div>
                </div>
                <div className="text-right">
                  <div className="text-4xl font-black text-white">20+</div>
                  <div className="text-[0.65rem] font-bold uppercase tracking-widest text-neutral-500">Workstreams</div>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <div
        className="sticky top-[72px] z-30 border-b border-black/[0.05] bg-white/80 shadow-sm backdrop-blur-2xl transition-all duration-300"
        data-header-theme="light"
      >
        <div className="mx-auto flex max-w-7xl items-stretch gap-2 overflow-x-auto px-4 py-4 sm:gap-4 sm:px-6 md:px-8 [&::-webkit-scrollbar]:h-0">
          {services.map((service, i) => {
            const active = activeIndex === i;
            const id = getServiceId(service.title);
            const label = railLabel(service.slug, service.title);
            return (
              <a
                key={service.slug}
                href={`#${id}`}
                className={cn(
                  "group relative flex min-w-[140px] shrink-0 items-center gap-3 rounded-2xl border px-4 py-3 transition-all duration-500 sm:min-w-0 sm:flex-1",
                  active
                    ? "border-brand bg-neutral-950 text-white shadow-xl shadow-black/10"
                    : "border-neutral-200 bg-white/50 text-neutral-500 hover:border-brand/40 hover:bg-white",
                )}
              >
                <span
                  className={cn(
                    "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-sm font-black transition-colors duration-500",
                    active ? "bg-brand text-white" : "bg-neutral-100 text-neutral-400 group-hover:bg-brand/10 group-hover:text-brand",
                  )}
                >
                  {service.number}
                </span>
                <span className="min-w-0 flex-1 truncate text-[0.65rem] font-black uppercase tracking-widest">
                  {label}
                </span>
                {active && (
                  <motion.div
                    layoutId="active-pill-indicator"
                    className="absolute -bottom-[1px] left-1/2 h-[2px] w-8 -translate-x-1/2 bg-brand"
                  />
                )}
              </a>
            );
          })}
        </div>
      </div>

      <div className="bg-white">
        {services.map((service, index) => {
          const isDark = index % 2 !== 0;
          const id = getServiceId(service.title);
          const imageFirst = index % 2 === 0;

          return (
            <article
              key={service.slug}
              id={id}
              data-header-theme={isDark ? "dark" : "light"}
              className={cn(
                "relative scroll-mt-32 overflow-hidden border-b border-black/[0.03] transition-colors duration-700 sm:scroll-mt-36",
                isDark ? "bg-neutral-950 text-white" : "bg-white",
              )}
            >
              <motion.span
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 1.2, ease: "easeOut" }}
                className={cn(
                  "pointer-events-none absolute -right-8 top-12 select-none text-[clamp(8rem,25vw,18rem)] font-black leading-none tracking-tighter",
                  isDark ? "text-white/[0.03]" : "text-black/[0.04]",
                )}
                aria-hidden
              >
                {service.number}
              </motion.span>

              <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28 md:px-8 lg:py-36">
                <div
                  className={cn(
                    "grid items-center gap-16 lg:grid-cols-2 lg:gap-24",
                    !imageFirst && "lg:direction-rtl",
                  )}
                >
                  <div className={cn("relative group", !imageFirst && "lg:order-2")}>
                    <Reveal direction={imageFirst ? "left" : "right"}>
                      <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[2.5rem] lg:aspect-square">
                        <div
                          className={cn(
                            "service-detail-visual absolute inset-0 transition-transform duration-1000 group-hover:scale-110",
                            `service-visual-${index + 1}`,
                          )}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity duration-700 group-hover:opacity-100" />
                        <div className="absolute bottom-10 left-10 translate-y-4 opacity-0 transition-all duration-700 group-hover:translate-y-0 group-hover:opacity-100">
                          <p className="text-xs font-bold uppercase tracking-widest text-brand-light">Service Area</p>
                          <h4 className="mt-1 text-2xl font-black text-white">{service.title}</h4>
                        </div>
                      </div>
                    </Reveal>
                    
                    {/* Decorative element */}
                    <div className={cn(
                      "absolute -bottom-6 -right-6 h-32 w-32 rounded-3xl border border-brand/20 bg-brand/5 backdrop-blur-sm transition-transform duration-700 group-hover:scale-110",
                      !imageFirst && "-left-6 -right-auto"
                    )} />
                  </div>

                  <div className={cn("relative z-10", !imageFirst && "lg:order-1")}>
                    <Reveal direction="up">
                      <div className="flex items-center gap-4">
                        <span className={cn("h-px w-12", isDark ? "bg-brand-light" : "bg-brand")} />
                        <span className={cn("text-xs font-black uppercase tracking-[0.3em]", isDark ? "text-brand-light" : "text-brand")}>
                          Pillar {service.number}
                        </span>
                      </div>
                      <h2 className={cn(
                        "mt-8 text-[clamp(2rem,5vw,3.5rem)] font-black leading-[1.05] tracking-tight",
                        isDark ? "text-white" : "text-neutral-950"
                      )}>
                        {service.title}
                      </h2>
                      <p className={cn(
                        "mt-8 text-lg leading-relaxed sm:text-xl",
                        isDark ? "text-neutral-400" : "text-neutral-600"
                      )}>
                        {service.pageIntro}
                      </p>
                      
                      <div className="mt-12 flex flex-wrap gap-3">
                        {service.highlights?.slice(0, 4).map((h) => (
                          <span 
                            key={h}
                            className={cn(
                              "rounded-full border px-4 py-1.5 text-[0.65rem] font-bold uppercase tracking-wider transition-colors",
                              isDark 
                                ? "border-white/10 bg-white/5 text-white/70 hover:border-brand-light hover:text-brand-light" 
                                : "border-black/5 bg-neutral-100 text-neutral-600 hover:border-brand hover:text-brand"
                            )}
                          >
                            {h}
                          </span>
                        ))}
                      </div>

                      <div className="mt-12 flex items-center gap-8">
                        <Link
                          to={`/services/${service.slug}`}
                          className={cn(
                            "group flex items-center gap-4 rounded-full px-8 py-4 text-sm font-black uppercase tracking-widest transition-all",
                            isDark
                              ? "bg-brand text-white hover:bg-brand-light hover:shadow-lg hover:shadow-brand/20"
                              : "bg-neutral-950 text-white hover:bg-brand hover:shadow-lg hover:shadow-brand/20"
                          )}
                        >
                          Explore Service
                          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </Link>
                      </div>
                    </Reveal>
                  </div>
                </div>

                <div className="mt-24 lg:mt-32">
                  <div className="flex items-center justify-between gap-4 border-b border-black/[0.05] pb-6">
                    <h3 className={cn("text-xs font-black uppercase tracking-[0.2em]", isDark ? "text-neutral-500" : "text-neutral-400")}>
                      Service Workstreams
                    </h3>
                    <div className="hidden h-px flex-1 bg-black/[0.05] lg:mx-8 lg:block" />
                  </div>
                  
                  <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {service.detailGroups.map((group, gIdx) => {
                      const dKey = detailCardKey(service.slug, group.title);
                      const isOpen = detailOpen.has(dKey);

                      return (
                        <Reveal key={group.title} delay={gIdx * 0.1} direction="up">
                          <div
                            className={cn(
                              "group relative h-full overflow-hidden rounded-[2rem] border transition-all duration-500",
                              isDark
                                ? "border-white/5 bg-white/[0.03] hover:border-brand-light/20 hover:bg-white/[0.05]"
                                : "border-black/5 bg-neutral-50/50 hover:border-brand/20 hover:bg-white hover:shadow-xl"
                            )}
                          >
                            <button
                              onClick={() => toggleDetail(dKey)}
                              className="flex w-full flex-col p-8 text-left"
                            >
                              <div className="flex w-full items-start justify-between">
                                <span className={cn(
                                  "flex h-10 w-10 items-center justify-center rounded-xl text-xs font-black transition-all duration-500",
                                  isDark ? "bg-white/5 text-brand-light group-hover:bg-brand-light group-hover:text-white" : "bg-black/5 text-brand group-hover:bg-brand group-hover:text-white"
                                )}>
                                  0{gIdx + 1}
                                </span>
                                <div className={cn(
                                  "flex h-10 w-10 items-center justify-center rounded-full border transition-all duration-500",
                                  isDark ? "border-white/10 group-hover:rotate-90" : "border-black/10 group-hover:rotate-90",
                                  isOpen && "rotate-90 bg-brand border-brand text-white"
                                )}>
                                  <ChevronRight className={cn("h-4 w-4", isOpen ? "text-white" : isDark ? "text-white/40" : "text-black/40")} />
                                </div>
                              </div>
                              <h4 className={cn("mt-8 text-xl font-black leading-tight", isDark ? "text-white" : "text-neutral-900")}>
                                {group.title}
                              </h4>
                              
                              <AnimatePresence>
                                {isOpen && (
                                  <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: "auto", opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                                    className="overflow-hidden"
                                  >
                                    <ul className="mt-8 space-y-4">
                                      {group.items.map((item) => (
                                        <li key={item} className="flex items-start gap-3">
                                          <div className={cn("mt-2 h-1.5 w-1.5 shrink-0 rounded-full", isDark ? "bg-brand-light" : "bg-brand")} />
                                          <span className={cn("text-sm font-medium leading-relaxed", isDark ? "text-neutral-400" : "text-neutral-600")}>
                                            {item}
                                          </span>
                                        </li>
                                      ))}
                                    </ul>
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </button>
                          </div>
                        </Reveal>
                      );
                    })}
                  </div>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      <section data-header-theme="dark" className="relative isolate overflow-hidden bg-neutral-950 py-32 text-white">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(45%_45%_at_50%_50%,rgba(43,143,148,0.1),transparent)]" />
        <Reveal className="mx-auto flex max-w-7xl flex-col items-center text-center px-4" direction="zoom">
          <p className="eyebrow text-brand-light">Standards & Compliance</p>
          <h2 className="mt-8 max-w-4xl text-[clamp(1.8rem,5vw,4rem)] font-black leading-[1.02] tracking-tighter text-pretty">
            Aligning global standards with 
            <span className="block text-brand-light">East African realities.</span>
          </h2>
          <p className="mt-8 max-w-2xl text-lg text-neutral-400">
            Comprehensive support for FIDIC, RPPA, JCT, and NEC contract models 
            across traditional, D&B, and EPC procurement frameworks.
          </p>
          <div className="mt-12 flex flex-wrap justify-center gap-4">
            <Link to="/contact" className="btn-brand">
              Request Service Advice
            </Link>
            <Link to="/about" className="btn-dark">
              Learn Our Method
            </Link>
          </div>
        </Reveal>
      </section>
    </Layout>
  );
}
