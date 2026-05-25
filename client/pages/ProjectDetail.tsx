import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Calendar, MapPin, User, ArrowRight, Share2, Printer } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { Layout } from "@/components/site/Layout";
import { ProjectGallery } from "@/components/site/ProjectGallery";
import { Reveal } from "@/components/site/Reveal";
import { fetchProjectBySlug } from "@/lib/api";
import { projectGalleryUrls } from "@shared/cms";
import { cn } from "@/lib/utils";

function formatDate(iso: string) {
  if (!iso) return "—";
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? iso : d.toLocaleDateString(undefined, { dateStyle: "long" });
}

function formatYmdLong(ymd: string) {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(ymd.trim());
  if (!m) return ymd;
  const y = Number(m[1]);
  const mo = Number(m[2]);
  const d = Number(m[3]);
  if (!y || mo < 1 || mo > 12 || d < 1 || d > 31) return ymd;
  return new Date(y, mo - 1, d).toLocaleDateString(undefined, { dateStyle: "long" });
}

export default function ProjectDetail() {
  const { slug = "" } = useParams<{ slug: string }>();
  const { data: project, isLoading, isError } = useQuery({
    queryKey: ["projects", "detail", slug],
    queryFn: () => fetchProjectBySlug(slug),
    enabled: !!slug,
  });

  if (isLoading) {
    return (
      <Layout>
        <div className="flex min-h-[50vh] items-center justify-center text-neutral-500">
           <div className="flex flex-col items-center gap-4">
              <div className="h-10 w-10 animate-spin rounded-full border-4 border-brand border-t-transparent" />
              <span className="text-[0.65rem] font-black uppercase tracking-widest text-neutral-400">Loading Case Study</span>
           </div>
        </div>
      </Layout>
    );
  }

  if (isError || !project) {
    return (
      <Layout>
        <div className="section-padding mx-auto max-w-2xl text-center py-40">
          <h1 className="text-4xl font-black text-neutral-950 tracking-tighter">Project not found.</h1>
          <p className="mt-4 text-neutral-500">The requested case study could not be located or has been archived.</p>
          <Link to="/projects" className="mt-10 btn-brand inline-flex items-center">
            <ArrowLeft className="mr-3 h-5 w-5" /> Back to projects
          </Link>
        </div>
      </Layout>
    );
  }

  const images = projectGalleryUrls(project);
  const meta = [
    project.location ? { icon: MapPin, label: "Location", value: project.location } : null,
    project.clientName ? { icon: User, label: "Client", value: project.clientName } : null,
    project.startDate ? { icon: Calendar, label: "Project start date", value: formatYmdLong(project.startDate) } : null,
    project.endDate ? { icon: Calendar, label: "Project end date", value: formatYmdLong(project.endDate) } : null,
    project.projectDate ? { icon: Calendar, label: "Project date", value: formatYmdLong(project.projectDate) } : null,
    project.year ? { icon: Calendar, label: "Year", value: project.year } : null,
  ].filter(Boolean) as { icon: typeof MapPin; label: string; value: string }[];

  return (
    <Layout>
      {/* Immersive Detail Hero */}
      <section data-header-theme="dark" className="relative isolate min-h-[60vh] overflow-hidden bg-neutral-950 pt-32 text-white">
        <div className="absolute inset-0 -z-10">
          <div className="page-hero-visual projects absolute inset-0 scale-105 opacity-30 blur-sm" />
          <div className="absolute inset-0 bg-gradient-to-b from-neutral-950 via-neutral-950/40 to-neutral-950" />
        </div>
        
        <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 md:px-8">
           <Reveal direction="down">
              <Link to="/projects" className="group inline-flex items-center gap-3 text-[0.65rem] font-black uppercase tracking-widest text-white/50 transition hover:text-brand-light">
                 <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
                 Back to Portfolio
              </Link>
           </Reveal>
           
           <div className="mt-12 grid gap-12 lg:grid-cols-[1fr_0.4fr] lg:items-end">
              <div>
                <Reveal direction="left" delay={0.1}>
                  <div className="flex items-center gap-4">
                    <span className="h-px w-8 bg-brand" />
                    <span className="text-[0.65rem] font-black uppercase tracking-[0.3em] text-brand-light">Case Study / {project.sector || "General"}</span>
                  </div>
                  <h1 className="mt-8 text-[clamp(2.5rem,6vw,5rem)] font-black leading-[0.92] tracking-tighter text-white">
                    {project.title}
                  </h1>
                </Reveal>
              </div>
              
              <Reveal direction="right" delay={0.2} className="hidden lg:block">
                 <div className="flex gap-4">
                    <button className="flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-white/5 transition hover:bg-white/10"><Share2 className="h-5 w-5" /></button>
                    <button className="flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-white/5 transition hover:bg-white/10"><Printer className="h-5 w-5" /></button>
                 </div>
              </Reveal>
           </div>
        </div>
      </section>

      <section data-header-theme="light" className="relative z-10 -mt-20 pb-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
          <div className="grid gap-12 lg:grid-cols-[1.2fr_0.8fr] lg:items-start lg:gap-24">
            <div className="space-y-16">
              {/* Gallery Section */}
              {images.length > 0 ? (
                <Reveal direction="up">
                  <div className="overflow-hidden rounded-[3rem] shadow-2xl">
                    <ProjectGallery images={images} title={project.title} />
                  </div>
                </Reveal>
              ) : null}

              {/* Description Section */}
              {project.description ? (
                <Reveal direction="up" delay={0.1}>
                  <div className="max-w-3xl">
                    <h2 className="text-xs font-black uppercase tracking-[0.3em] text-brand">Project Overview</h2>
                    <div className="prose prose-neutral mt-8 max-w-none whitespace-pre-wrap text-lg leading-[1.8] text-neutral-600 antialiased">
                      {project.description}
                    </div>
                  </div>
                </Reveal>
              ) : null}
            </div>

            {/* Sidebar Meta */}
            <div className="lg:sticky lg:top-32">
               <Reveal direction="right">
                  <div className="rounded-[2.5rem] border border-black/5 bg-neutral-50 p-8 lg:p-12">
                     <h3 className="text-xs font-black uppercase tracking-[0.2em] text-neutral-400 mb-10">Project Intelligence</h3>
                     
                     <div className="space-y-10">
                        {meta.map(({ icon: Icon, label, value }) => (
                          <div key={label} className="flex gap-6 group">
                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white shadow-sm text-brand transition-all duration-500 group-hover:bg-brand group-hover:text-white">
                               <Icon className="h-5 w-5" />
                            </div>
                            <div>
                               <span className="text-[0.6rem] font-black uppercase tracking-[0.2em] text-neutral-400">{label}</span>
                               <span className="mt-1 block text-base font-black text-neutral-950">{value}</span>
                            </div>
                          </div>
                        ))}
                     </div>

                     <div className="mt-16 pt-10 border-t border-black/5">
                        <Link to="/contact" className="btn-brand w-full justify-center">
                           Enquire for similar scope
                        </Link>
                     </div>
                     
                     <div className="mt-10 flex items-center justify-between text-[0.6rem] font-bold text-neutral-400 uppercase tracking-widest px-2">
                        <span>Ref: {project.slug}</span>
                        <span>{project.year || "2026"}</span>
                     </div>
                  </div>
               </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* Navigation Footer */}
      <section className="bg-neutral-950 py-24 text-white">
         <div className="mx-auto max-w-7xl px-4 flex flex-col items-center text-center">
            <Reveal direction="zoom">
               <p className="eyebrow text-brand-light">Continue Exploring</p>
               <h2 className="mt-8 text-4xl font-black tracking-tighter">Secure your project's <span className="text-brand-light">cost and delivery.</span></h2>
               <Link to="/projects" className="group mt-12 inline-flex items-center gap-4 text-sm font-black uppercase tracking-widest hover:text-brand-light transition-colors">
                  Return to all projects
                  <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
               </Link>
            </Reveal>
         </div>
      </section>
    </Layout>
  );
}
