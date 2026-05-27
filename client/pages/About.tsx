import { ArrowRight, Globe, Target, ShieldCheck, Users, Zap, Leaf } from "lucide-react";
import {
  useRef,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import { Layout } from "@/components/site/Layout";
import { Reveal } from "@/components/site/Reveal";
import { values } from "@/data/site";
import { cn } from "@/lib/utils";

const ABOUT_NAV = [
  { id: "who-we-are", label: "Who we are", icon: Globe },
  { id: "vision-mission", label: "Vision & mission", icon: Target },
  { id: "core-values", label: "Core values", icon: ShieldCheck },
  { id: "collaborate", label: "Collaborate", icon: Users },
] as const;

export default function About() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const [activeSection, setActiveSection] = useState<(typeof ABOUT_NAV)[number]["id"]>(ABOUT_NAV[0].id);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id as (typeof ABOUT_NAV)[number]["id"]);
          }
        });
      },
      { threshold: 0.3 }
    );

    ABOUT_NAV.forEach((nav) => {
      const el = document.getElementById(nav.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <Layout>
      {/* Immersive Hero */}
      <section data-header-theme="dark" className="relative isolate min-h-[90vh] overflow-hidden bg-neutral-950 pt-32 text-white">
        <div className="absolute inset-0 z-0">
          <div className="page-hero-visual about absolute inset-0 scale-110 opacity-40 blur-[2px]" />
          <div className="absolute inset-0 bg-gradient-to-b from-neutral-950 via-transparent to-neutral-950" />
        </div>

        <div className="relative z-10 mx-auto max-w-7xl px-4 py-20 sm:px-6 md:px-8">
          <div className="max-w-4xl">
            <Reveal direction="down" delay={0.1}>
              <span className="inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-[0.65rem] font-black uppercase tracking-[0.3em] text-brand-light backdrop-blur-md">
                Established 2025
              </span>
            </Reveal>
            <Reveal direction="clip" delay={0.2}>
              <h1 className="mt-8 text-[clamp(2.5rem,8vw,6.5rem)] font-black leading-[0.88] tracking-tighter text-white text-pretty">
                Construction <br />
                <span className="text-brand-light">Cost certainty.</span>
              </h1>
            </Reveal>
            <Reveal direction="up" delay={0.3}>
              <p className="mt-12 max-w-2xl text-lg font-medium leading-relaxed text-neutral-400 sm:text-2xl">
                T&W Quantus is a Kigali-based consultancy redefining the standards of 
                Quantity Surveying and Project Delivery across the East African landscape.
              </p>
            </Reveal>
          </div>
        </div>

      </section>

      {/* Floating Navigation Rail */}
      <nav className="sticky top-[72px] z-40 hidden border-b border-black/5 bg-white/80 backdrop-blur-2xl lg:block">
        <div className="mx-auto flex max-w-7xl justify-center gap-12 px-8 py-5">
          {ABOUT_NAV.map((nav) => {
            const active = activeSection === nav.id;
            return (
              <a
                key={nav.id}
                href={`#${nav.id}`}
                className={cn(
                  "group relative flex items-center gap-3 text-[0.65rem] font-black uppercase tracking-widest transition-all",
                  active ? "text-neutral-950" : "text-neutral-400 hover:text-neutral-600"
                )}
              >
                <nav.icon className={cn("h-4 w-4 transition-colors", active ? "text-brand" : "text-neutral-300")} />
                {nav.label}
                {active && (
                  <motion.div
                    layoutId="about-nav-pill"
                    className="absolute -bottom-[21px] left-0 right-0 h-1 bg-brand"
                  />
                )}
              </a>
            );
          })}
        </div>
      </nav>

      <div ref={containerRef} className="bg-white">
        {/* Section: Who We Are */}
        <section id="who-we-are" className="relative scroll-mt-32 py-24 lg:py-40 overflow-hidden">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
            <div className="grid gap-20 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
              <Reveal direction="left" className="relative">
                <div className="aspect-[3/4] overflow-hidden rounded-[3rem] shadow-2xl">
                  <img
                    src="/images/about-us.webp"
                    alt="T&W Quantus — Precision at our core"
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-[5s] hover:scale-110"
                  />
                </div>
                <div className="absolute -bottom-10 -right-10 hidden h-64 w-64 rounded-full border-[20px] border-neutral-100 lg:block" />
              </Reveal>
              
              <div>
                <Reveal direction="up">
                  <span className="text-[0.65rem] font-black uppercase tracking-[0.4em] text-brand">The Foundation</span>
                  <h2 className="mt-6 text-[clamp(2rem,5vw,4rem)] font-black leading-none tracking-tighter text-neutral-950">
                    Precision <br /> 
                    at our core.
                  </h2>
                  <div className="mt-10 space-y-8 text-lg leading-relaxed text-neutral-600">
                    <p>
                      Derived from the Latin word <span className="font-bold text-neutral-950 italic">"Quantus,"</span> meaning 
                      "How much?" or "How great," our name reflects our core philosophy—precise evaluation and value optimization.
                    </p>
                    <p>
                      We are T&W Quantus, a Quantity Surveying team committed to delivering excellence in the built environment. 
                      Founded with a vision to provide reliable and cost-effective construction services, we bridge the gap between 
                      visionary design and financial reality.
                    </p>
                  </div>
                  
                  <div className="mt-12 flex items-center gap-6">
                    <div className="flex -space-x-3">
                       {[1,2,3,4].map(i => (
                         <div key={i} className="h-12 w-12 rounded-full border-4 border-white bg-neutral-200" />
                       ))}
                    </div>
                    <div className="text-sm font-bold text-neutral-950">
                      Expert Multidisciplinary Team
                    </div>
                  </div>
                </Reveal>
              </div>
            </div>
          </div>
        </section>

        {/* Section: Vision & Mission */}
        <section id="vision-mission" className="relative scroll-mt-32 py-24 lg:py-40 bg-neutral-950 text-white overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-brand to-transparent opacity-20" />
          
          <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
            <div className="grid gap-12 lg:grid-cols-2 lg:gap-24">
              <Reveal direction="up" className="flex flex-col justify-between p-12 rounded-[3rem] border border-white/5 bg-white/[0.02] backdrop-blur-xl">
                 <div>
                   <Target className="h-12 w-12 text-brand-light" />
                   <h3 className="mt-8 text-4xl font-black tracking-tight">Our Vision</h3>
                   <p className="mt-8 text-xl leading-relaxed text-neutral-400">
                     To be a leading force in delivering innovative, high-quality, and sustainable construction 
                     solutions that transform the built environment and enhance communities throughout East Africa.
                   </p>
                 </div>
                 <div className="mt-12 text-xs font-black uppercase tracking-[0.3em] text-white/20">Aspirations 2030</div>
              </Reveal>

              <Reveal direction="up" delay={0.1} className="flex flex-col justify-between p-12 rounded-[3rem] bg-brand text-white shadow-2xl shadow-brand/20">
                 <div>
                   <Zap className="h-12 w-12 text-white" />
                   <h3 className="mt-8 text-4xl font-black tracking-tight text-white">Our Mission</h3>
                   <p className="mt-8 text-xl leading-relaxed text-white/90">
                     To deliver exceptional services through technical ability, disciplined execution, 
                     and precise cost management, building long-term partnerships founded on trust and reliability.
                   </p>
                 </div>
                 <div className="mt-12 text-xs font-black uppercase tracking-[0.3em] text-white/40">Our Daily Commitment</div>
              </Reveal>
            </div>
          </div>
          
          <div className="pointer-events-none absolute -bottom-20 -right-20 h-96 w-96 bg-brand/10 blur-[150px] rounded-full" />
        </section>

        {/* Section: Core Values */}
        <section id="core-values" className="relative scroll-mt-32 py-24 lg:py-40 overflow-hidden">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
            <Reveal className="text-center max-w-3xl mx-auto mb-20" direction="zoom">
              <span className="text-[0.65rem] font-black uppercase tracking-[0.4em] text-brand">The Principles</span>
              <h2 className="mt-6 text-5xl font-black tracking-tighter text-neutral-950 text-pretty">
                Values that drive <span className="text-neutral-400">excellence.</span>
              </h2>
            </Reveal>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {values.map((v, i) => (
                <Reveal key={v.title} delay={i * 0.1} direction="up">
                  <div className="group relative h-full rounded-[2.5rem] border border-black/5 bg-neutral-50/50 p-10 transition-all duration-500 hover:bg-white hover:shadow-2xl hover:shadow-black/5">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-brand shadow-sm transition-all duration-500 group-hover:bg-brand group-hover:text-white">
                       {i === 0 && <ShieldCheck className="h-7 w-7" />}
                       {i === 1 && <Target className="h-7 w-7" />}
                       {i === 2 && <Zap className="h-7 w-7" />}
                       {i === 3 && <Users className="h-7 w-7" />}
                       {i === 4 && <Leaf className="h-7 w-7" />}
                       {i === 5 && <Globe className="h-7 w-7" />}
                    </div>
                    <h4 className="mt-8 text-2xl font-black tracking-tight text-neutral-950">{v.title}</h4>
                    <p className="mt-6 text-base leading-relaxed text-neutral-600">{v.description}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* Section: Collaborate */}
        <section id="collaborate" className="relative scroll-mt-32 py-24 lg:py-40 bg-neutral-50 overflow-hidden">
           <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
              <div className="rounded-[4rem] bg-neutral-950 p-12 lg:p-24 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand/10 blur-[150px] rounded-full" />
                
                <div className="relative z-10 grid gap-16 lg:grid-cols-[1fr_0.8fr] lg:items-center">
                   <div>
                     <Reveal direction="left">
                       <p className="text-xs font-black uppercase tracking-[0.4em] text-brand-light">The Partnership</p>
                       <h2 className="mt-8 text-[clamp(2rem,5vw,4.5rem)] font-black leading-none tracking-tighter text-white">
                         Let's build <br />
                         something <span className="text-brand-light">measurable.</span>
                       </h2>
                       <p className="mt-10 text-xl text-neutral-400 max-w-xl leading-relaxed">
                         Engage a team committed to precision, efficiency, and measurable value. 
                         Our approach is grounded in technical ability and disciplined cost control.
                       </p>
                       <Link to="/contact" className="btn-brand mt-12 inline-flex">
                         Start a conversation <ArrowRight className="ml-3 h-5 w-5" />
                       </Link>
                     </Reveal>
                   </div>
                   
                   <Reveal direction="scale" className="relative">
                      <div className="aspect-square rounded-[3rem] overflow-hidden">
                        <img
                           src="/images/quantity-measurement.webp"
                           alt="Quantity measurement"
                           className="absolute inset-0 h-full w-full object-cover scale-110"
                         />
                      </div>
                   </Reveal>
                </div>
              </div>
           </div>
        </section>
      </div>
    </Layout>
  );
}
