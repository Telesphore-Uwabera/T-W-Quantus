import { useQuery } from "@tanstack/react-query";
import { ArrowRight, MapPin, Filter, SortAsc, LayoutGrid, Calendar } from "lucide-react";
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Layout } from "@/components/site/Layout";
import { Reveal } from "@/components/site/Reveal";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { company, projectTypes } from "@/data/site";
import { fetchPublishedProjects } from "@/lib/api";
import { cn } from "@/lib/utils";
import { isValidProjectSector, PROJECT_SECTORS, projectGalleryUrls, type ProjectDoc } from "@shared/cms";
import { AutoSlideBackground } from "@/components/site/AutoSlideBackground";

const FILTER_ALL = "__all__";

const SORT_OPTIONS = [
  { value: "newest", label: "Latest First" },
  { value: "oldest", label: "Earliest First" },
  { value: "title", label: "Alphabetical" },
] as const;

function projectYear(p: ProjectDoc): string {
  const y = p.year?.trim();
  if (y) return y;
  const d = p.startDate?.trim();
  if (d && d.length >= 4) return d.slice(0, 4);
  return p.createdAt?.slice(0, 4) ?? "";
}

function usePortfolioFilters(projects: ProjectDoc[]) {
  const [location, setLocation] = useState(FILTER_ALL);
  const [sector, setSector] = useState(FILTER_ALL);
  const [year, setYear] = useState(FILTER_ALL);
  const [sort, setSort] = useState<string>(SORT_OPTIONS[0].value);

  const locationOptions = useMemo(() => {
    const set = new Set<string>();
    projects.forEach((p) => {
      if (p.location?.trim()) set.add(p.location.trim());
    });
    return [FILTER_ALL, ...Array.from(set).sort((a, b) => a.localeCompare(b))];
  }, [projects]);

  const yearOptions = useMemo(() => {
    const set = new Set<string>();
    projects.forEach((p) => {
      const y = projectYear(p);
      if (y) set.add(y);
    });
    return [FILTER_ALL, ...Array.from(set).sort((a, b) => b.localeCompare(a))];
  }, [projects]);

  const sectorOptions = useMemo(() => {
    const extras: string[] = [];
    projects.forEach((p) => {
      const s = p.sector?.trim();
      if (s && !isValidProjectSector(s) && !extras.includes(s)) extras.push(s);
    });
    extras.sort((a, b) => a.localeCompare(b));
    return [FILTER_ALL, ...PROJECT_SECTORS, ...extras];
  }, [projects]);

  const filtered = useMemo(() => {
    let list = projects.filter((p) => {
      if (location !== FILTER_ALL) {
        const loc = p.location?.trim() ?? "";
        if (loc !== location) return false;
      }
      if (sector !== FILTER_ALL && (p.sector ?? "") !== sector) return false;
      if (year !== FILTER_ALL) {
        if (projectYear(p) !== year) return false;
      }
      return true;
    });

    list = [...list].sort((a, b) => {
      if (sort === "newest") {
        return (b.startDate || b.createdAt).localeCompare(a.startDate || a.createdAt);
      }
      if (sort === "oldest") {
        return (a.startDate || a.createdAt).localeCompare(b.startDate || b.createdAt);
      }
      return a.title.localeCompare(b.title);
    });

    return list;
  }, [projects, location, sector, year, sort]);

  return {
    location,
    setLocation,
    sector,
    setSector,
    year,
    setYear,
    sort,
    setSort,
    locationOptions,
    yearOptions,
    sectorOptions,
    filtered,
  };
}

export default function Projects() {
  const { data: cmsProjects = [], isLoading } = useQuery({
    queryKey: ["projects", "public"],
    queryFn: fetchPublishedProjects,
  });

  const {
    location,
    setLocation,
    sector,
    setSector,
    year,
    setYear,
    sort,
    setSort,
    locationOptions,
    yearOptions,
    sectorOptions,
    filtered,
  } = usePortfolioFilters(cmsProjects);

  const [viewMode, setViewMode] = useState<"grid" | "marquee">("grid");

  return (
    <Layout>
      {/* Dynamic Hero */}
      <section data-header-theme="dark" className="relative isolate overflow-hidden bg-neutral-950 px-4 pb-24 pt-32 text-white sm:px-6 sm:pb-32 sm:pt-40 md:px-8 md:pb-40 md:pt-48">
        <div className="absolute inset-0 -z-10">
          <div className="page-hero-visual projects absolute inset-0 scale-105 opacity-30" />
          <div className="absolute inset-0 bg-gradient-to-b from-neutral-950 via-transparent to-neutral-950" />
        </div>
        
        <div className="relative mx-auto max-w-7xl">
          <Reveal direction="down">
            <span className="text-[0.65rem] font-black uppercase tracking-[0.4em] text-brand-light">Portfolio</span>
            <h1 className="mt-8 text-[clamp(2.5rem,8vw,5.5rem)] font-black leading-[0.9] tracking-tighter text-white">
              Building Excellence, <br />
              <span className="text-brand-light">Delivering Trust</span>
            </h1>
            <p className="mt-10 max-w-2xl text-lg font-medium leading-relaxed text-neutral-400 sm:text-2xl">
              From multi-unit residential developments to complex institutional infrastructure, 
              we ensure cost-certainty and technical excellence at every scale.
            </p>
          </Reveal>
        </div>
      </section>

      <div className="bg-white">
        {/* Advanced Filter Bar */}
        <div className="sticky top-[72px] z-40 border-b border-black/5 bg-white/80 backdrop-blur-2xl">
           <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 md:px-8">
              <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                 <div className="flex flex-wrap items-center gap-x-8 gap-y-4">
                    <div className="flex items-center gap-3">
                       <Filter className="h-4 w-4 text-brand" />
                       <span className="text-[0.65rem] font-black uppercase tracking-widest text-neutral-400">Filter Portfolio</span>
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-6">
                       <FilterGroup label="Location" value={location} onChange={setLocation} options={locationOptions} />
                       <FilterGroup label="Sector" value={sector} onChange={setSector} options={sectorOptions} />
                       <FilterGroup label="Year" value={year} onChange={setYear} options={yearOptions} />
                    </div>
                 </div>

                 <div className="flex items-center gap-8 border-t border-black/5 pt-4 lg:border-t-0 lg:pt-0">
                    <div className="flex items-center gap-3">
                       <SortAsc className="h-4 w-4 text-brand" />
                       <FilterGroup label="Sort" value={sort} onChange={setSort} options={SORT_OPTIONS.map(o => o.value)} labels={SORT_OPTIONS.map(o => o.label)} />
                    </div>
                    
                    <div className="flex items-center gap-1 rounded-full bg-neutral-100 p-1">
                       <button 
                        onClick={() => setViewMode("grid")}
                        className={cn("rounded-full p-2 transition-all", viewMode === "grid" ? "bg-white text-neutral-950 shadow-sm" : "text-neutral-400 hover:text-neutral-600")}
                       >
                         <LayoutGrid className="h-4 w-4" />
                       </button>
                       <button 
                        onClick={() => setViewMode("marquee")}
                        className={cn("rounded-full p-2 transition-all", viewMode === "marquee" ? "bg-white text-neutral-950 shadow-sm" : "text-neutral-400 hover:text-neutral-600")}
                       >
                         <Calendar className="h-4 w-4" />
                       </button>
                    </div>
                 </div>
              </div>
           </div>
        </div>

        {/* Project Results */}
        <div className="min-h-[60vh] py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
            <AnimatePresence mode="wait">
              {filtered.length === 0 ? (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center py-40 text-center"
                >
                  <div className="h-20 w-20 rounded-full bg-neutral-50 flex items-center justify-center mb-6">
                    <Filter className="h-8 w-8 text-neutral-200" />
                  </div>
                  <h3 className="text-xl font-black text-neutral-950">No matches found</h3>
                  <p className="mt-2 text-neutral-500">Adjust your filters to explore our full portfolio.</p>
                  <button 
                    onClick={() => { setLocation(FILTER_ALL); setSector(FILTER_ALL); setYear(FILTER_ALL); }}
                    className="mt-8 text-sm font-black uppercase tracking-widest text-brand hover:text-brand-dark"
                  >
                    Reset all filters
                  </button>
                </motion.div>
              ) : viewMode === "grid" ? (
                <motion.div 
                  key="grid"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="grid gap-12 md:grid-cols-2 lg:grid-cols-3"
                >
                  {filtered.map((p, i) => (
                    <ProjectGridCard key={p._id} project={p} index={i} />
                  ))}
                </motion.div>
              ) : (
                <motion.div 
                  key="marquee"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-32"
                >
                  <div className="group/projectMarquee relative overflow-hidden bg-white py-1">
                    <div className="flex w-max will-change-transform animate-project-marquee motion-reduce:animate-none group-hover/projectMarquee:[animation-play-state:paused]">
                      <div className="flex shrink-0 flex-nowrap bg-white w-max lg:w-screen">
                        {filtered.map((p, i) => <ProjectMarqueeCard key={p._id} project={p} index={i} />)}
                      </div>
                      <div className="flex shrink-0 flex-nowrap bg-white w-max lg:w-screen motion-reduce:hidden">
                        {filtered.map((p, i) => <ProjectMarqueeCard key={`${p._id}-dup`} project={p} index={i} />)}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* CTA Section */}
        <section className="section-padding bg-neutral-950 text-white overflow-hidden relative">
           <div className="absolute top-0 left-0 w-full h-1 bg-brand/20" />
           <div className="mx-auto max-w-7xl px-4 relative z-10 sm:px-6 md:px-8">
              <Reveal direction="zoom" className="flex flex-col items-center text-center">
                 <p className="eyebrow text-brand-light">Future-Proof Delivery</p>
                 <h2 className="mt-8 text-[clamp(2rem,5vw,4.5rem)] font-black leading-none tracking-tighter">
                   Your vision, <br />
                   our <span className="text-brand-light">precision.</span>
                 </h2>
                 <p className="mt-10 max-w-2xl text-xl text-neutral-400">
                    Ready to discuss your next multi-unit development, infrastructure 
                    project, or technical renovation?
                 </p>
                 <Link to="/contact" className="btn-brand mt-12">
                   Contact Our Team <ArrowRight className="ml-3 h-5 w-5" />
                 </Link>
              </Reveal>
           </div>
        </section>
      </div>
    </Layout>
  );
}

function FilterGroup({ label, value, onChange, options, labels }: { label: string, value: string, onChange: (v: string) => void, options: string[], labels?: string[] }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-[0.6rem] font-black uppercase tracking-[0.15em] text-neutral-400">{label}</span>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="h-auto border-0 bg-transparent p-0 font-black text-neutral-950 shadow-none hover:text-brand focus:ring-0 [&_svg]:ml-2 [&_svg]:h-3 [&_svg]:w-3 [&_svg]:text-brand">
          <SelectValue />
        </SelectTrigger>
        <SelectContent align="start" className="rounded-2xl border-black/5 bg-white/95 backdrop-blur-xl">
          {options.map((opt, i) => (
            <SelectItem key={opt} value={opt} className="rounded-xl text-xs font-bold uppercase tracking-widest focus:bg-brand focus:text-white">
              {opt === FILTER_ALL ? `All ${label}s` : (labels ? labels[i] : opt)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

function ProjectGridCard({ project, index }: { project: ProjectDoc, index: number }) {
  const images = projectGalleryUrls(project);
  const visualClass = `project-visual-${(index % 4) + 1}`;
  
  return (
    <Link to={`/projects/${encodeURIComponent(project.slug)}`} className="group block">
      <div className="relative aspect-[4/3] overflow-hidden rounded-[2.5rem] bg-neutral-100 transition-all duration-700 group-hover:shadow-2xl group-hover:shadow-black/10">
        <AutoSlideBackground 
          images={images}
          visualClass={visualClass}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 transition-opacity duration-700 group-hover:opacity-100" />
        <div className="absolute bottom-8 left-8 right-8 translate-y-4 opacity-0 transition-all duration-700 group-hover:translate-y-0 group-hover:opacity-100">
          <div className="flex items-center gap-3">
             <MapPin className="h-4 w-4 text-brand-light" />
             <span className="text-[0.65rem] font-black uppercase tracking-widest text-white/80">{project.location || "Kigali, Rwanda"}</span>
          </div>
        </div>
      </div>
      <div className="mt-8 flex items-start justify-between gap-4">
        <div>
          <h3 className="text-xl font-black tracking-tight text-neutral-950 transition-colors group-hover:text-brand">{project.title}</h3>
          <p className="mt-2 text-xs font-bold uppercase tracking-[0.2em] text-neutral-400">{project.sector || "General Construction"}</p>
        </div>
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-black/5 bg-white transition-all duration-500 group-hover:bg-brand group-hover:text-white group-hover:border-brand group-hover:translate-x-1">
          <ArrowRight className="h-5 w-5" />
        </div>
      </div>
    </Link>
  );
}

function ProjectMarqueeCard({ project, index }: { project: ProjectDoc, index: number }) {
  const images = projectGalleryUrls(project);
  const visualClass = `project-visual-${(index % 4) + 1}`;
  
  return (
    <Link 
      to={`/projects/${encodeURIComponent(project.slug)}`} 
      className="group project-card-item relative min-h-[440px] w-[340px] shrink-0 overflow-hidden p-8 text-white lg:min-h-[500px]"
    >
      <AutoSlideBackground 
        images={images}
        visualClass={visualClass}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent transition duration-700 group-hover:from-brand/90" />
      <div className="relative flex h-full flex-col justify-end">
        <h3 className="max-w-xs text-2xl font-black leading-tight transition duration-700 group-hover:translate-y-[-8px]">
          {project.title}
        </h3>
        <p className="mt-4 flex items-center gap-3 text-xs font-black uppercase tracking-widest opacity-80">
          <MapPin className="h-4 w-4 text-brand-light" />
          {project.location || "Kigali"}
        </p>
      </div>
      <div className="absolute bottom-10 right-10 flex h-14 w-14 items-center justify-center rounded-full bg-white text-neutral-950 opacity-0 transition-all duration-500 group-hover:opacity-100 group-hover:scale-110 group-hover:translate-x-2">
        <ArrowRight className="h-6 w-6" />
      </div>
    </Link>
  );
}
