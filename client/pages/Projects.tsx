import { useQuery } from "@tanstack/react-query";
import { ArrowRight, MapPin } from "lucide-react";
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Layout } from "@/components/site/Layout";
import { PageHero } from "@/components/site/PageHero";
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

const FILTER_ALL = "__all__";

const SORT_OPTIONS = [
  { value: "newest", label: "Newest first" },
  { value: "oldest", label: "Oldest first" },
  { value: "title", label: "Title A–Z" },
] as const;

const exploreSelectTrigger = cn(
  "border-0 bg-transparent shadow-none h-auto gap-2 rounded-none py-2 pl-0 pr-7 font-bold text-neutral-950",
  "hover:opacity-90 focus:ring-0 focus:ring-offset-0 w-max min-w-[6.5rem]",
  "[&_svg]:h-4 [&_svg]:w-4 [&_svg]:text-brand [&_svg]:opacity-100",
);

function projectYear(p: ProjectDoc): string {
  const y = p.year?.trim();
  if (y) return y;
  const d = p.projectDate?.trim();
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
        return (b.projectDate || b.createdAt).localeCompare(a.projectDate || a.createdAt);
      }
      if (sort === "oldest") {
        return (a.projectDate || a.createdAt).localeCompare(b.projectDate || b.createdAt);
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

/** Line labels under titles — same role as home `projectCards[].location`. */
const DELIVERY_AREA_LOCATIONS = [
  "Rwanda",
  "East Africa",
  "Regional",
  "Kigali",
  "Rwanda",
  "East Africa",
] as const;

const getSectionId = (title: string) =>
  title
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

/** Below lg: fixed widths for marquee. lg+: `project-card-item` hover (45% / 18.333%). */
const deliveryMarqueeCardClass =
  "group project-card project-card-item relative min-h-[320px] w-[min(78vw,300px)] shrink-0 overflow-hidden p-6 text-white sm:min-h-[380px] sm:w-[300px] sm:p-8 lg:min-h-[440px] lg:w-auto lg:min-w-0";

function DeliveryAreaMarqueeCards({ duplicate }: { duplicate: boolean }) {
  return (
    <>
      {projectTypes.map((type, index) => {
        const visual = `project-visual-${(index % 4) + 1}`;
        const locationLine = DELIVERY_AREA_LOCATIONS[index] ?? company.location;
        return (
          <Link
            key={duplicate ? `${type}-marquee-dup` : type}
            id={duplicate ? undefined : getSectionId(type)}
            to="/projects"
            tabIndex={duplicate ? -1 : undefined}
            className={`${deliveryMarqueeCardClass} ${visual} scroll-mt-32`}
          >
            <div className={`project-card-bg ${visual}`} />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent transition duration-700 group-hover:from-brand-dark/85" />
            <div className="relative flex h-full flex-col justify-end">
              <h3 className="max-w-xs text-[clamp(1.0625rem,0.95rem+0.55vw,1.375rem)] font-black transition duration-700 group-hover:translate-y-[-4px] group-hover:text-[clamp(1.125rem,1rem+0.65vw,1.5rem)]">
                {type}
              </h3>
              <p className="mt-4 flex items-center gap-2 text-[clamp(0.8125rem,0.75rem+0.2vw,0.875rem)] font-bold">
                <MapPin className="h-4 w-4 shrink-0 text-brand-light" />
                {locationLine}
              </p>
            </div>
            <div className="absolute bottom-8 right-8 grid h-12 w-12 place-items-center rounded-full bg-brand opacity-0 transition duration-500 group-hover:opacity-100">
              <ArrowRight className="h-5 w-5" />
            </div>
          </Link>
        );
      })}
    </>
  );
}

const portfolioMarqueeCardClass = cn(
  "group project-card project-card-item relative min-h-[320px] overflow-hidden p-6 text-white sm:min-h-[380px] sm:p-8 lg:min-h-[440px]",
  "w-[min(78vw,300px)] shrink-0 sm:w-[300px] lg:w-auto lg:min-w-0",
);

function PortfolioMarqueeCards({
  projects,
  duplicate,
}: {
  projects: ProjectDoc[];
  duplicate: boolean;
}) {
  return (
    <>
      {projects.map((p, index) => {
        const cover = projectGalleryUrls(p)[0];
        const visualClass = `project-visual-${(index % 4) + 1}`;
        const pinLabel = p.location?.trim() || p.sector?.trim() || company.location;
        return (
          <Link
            key={duplicate ? `${p._id}-marquee-dup` : p._id}
            to={`/projects/${encodeURIComponent(p.slug)}`}
            tabIndex={duplicate ? -1 : undefined}
            className={portfolioMarqueeCardClass}
          >
            <div
              className={cn("project-card-bg", !cover && visualClass)}
              style={
                cover
                  ? {
                      backgroundImage: `url(${cover})`,
                    }
                  : undefined
              }
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent transition duration-700 group-hover:from-brand-dark/85" />
            <div className="relative flex h-full flex-col justify-end">
              <h3 className="max-w-xs text-xl font-black transition duration-700 group-hover:translate-y-[-4px] group-hover:text-2xl">
                {p.title}
              </h3>
              <p className="mt-4 flex items-center gap-2 text-sm font-bold">
                <MapPin className="h-4 w-4 shrink-0 text-brand-light" />
                {pinLabel}
              </p>
            </div>
            <div className="absolute bottom-8 right-8 grid h-12 w-12 place-items-center rounded-full bg-brand opacity-0 transition duration-500 group-hover:opacity-100">
              <ArrowRight className="h-5 w-5" />
            </div>
          </Link>
        );
      })}
    </>
  );
}

export default function Projects() {
  const { data: cmsProjects = [] } = useQuery({
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

  return (
    <Layout>
      <PageHero
        eyebrow="Projects and sectors"
        title="Project support for buildings, infrastructure, renovations, and technical works."
        description="The company profile describes a multidisciplinary team prepared for multi-unit developments, institutional infrastructure, renovation works, and full construction delivery."
        visual="projects"
      />

      {cmsProjects.length > 0 && (
        <section id="portfolio" data-header-theme="light" className="bg-white">
          {/* DGJ-style “Explore by” rail — our dimensions: location, sector, year, sort */}
          <div className="border-b border-neutral-200/90 bg-white">
            <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-5 sm:px-6 md:flex-row md:flex-wrap md:items-center md:gap-x-10 md:gap-y-2 md:px-8 md:py-6">
              <span className="shrink-0 text-sm font-medium text-neutral-500">Explore by</span>
              <div className="flex min-w-0 flex-1 flex-wrap items-end gap-x-8 gap-y-4 sm:gap-x-10 lg:justify-between lg:gap-x-12">
                {locationOptions.length > 1 ? (
                  <div className="flex min-w-0 flex-col gap-1">
                    <span className="text-[0.65rem] font-black uppercase tracking-[0.16em] text-neutral-400">
                      Location
                    </span>
                    <Select value={location} onValueChange={setLocation}>
                      <SelectTrigger className={exploreSelectTrigger} aria-label="Filter by location">
                        <SelectValue placeholder="Location" />
                      </SelectTrigger>
                      <SelectContent align="start">
                        {locationOptions.map((opt) => (
                          <SelectItem key={opt} value={opt}>
                            {opt === FILTER_ALL ? "All locations" : opt}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                ) : null}

                <div className="flex min-w-0 flex-col gap-1">
                  <span className="text-[0.65rem] font-black uppercase tracking-[0.16em] text-neutral-400">
                    Sector
                  </span>
                  <Select value={sector} onValueChange={setSector}>
                    <SelectTrigger className={exploreSelectTrigger} aria-label="Filter by sector">
                      <SelectValue placeholder="Sector" />
                    </SelectTrigger>
                    <SelectContent align="start">
                      {sectorOptions.map((opt) => (
                        <SelectItem key={opt} value={opt}>
                          {opt === FILTER_ALL ? "All sectors" : opt}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {yearOptions.length > 1 ? (
                  <div className="flex min-w-0 flex-col gap-1">
                    <span className="text-[0.65rem] font-black uppercase tracking-[0.16em] text-neutral-400">
                      Year
                    </span>
                    <Select value={year} onValueChange={setYear}>
                      <SelectTrigger className={exploreSelectTrigger} aria-label="Filter by year">
                        <SelectValue placeholder="Year" />
                      </SelectTrigger>
                      <SelectContent align="start">
                        {yearOptions.map((opt) => (
                          <SelectItem key={opt} value={opt}>
                            {opt === FILTER_ALL ? "All years" : opt}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                ) : null}

                <div className="flex min-w-0 flex-col gap-1">
                  <span className="text-[0.65rem] font-black uppercase tracking-[0.16em] text-neutral-400">
                    Sort
                  </span>
                  <Select value={sort} onValueChange={setSort}>
                    <SelectTrigger className={exploreSelectTrigger} aria-label="Sort projects">
                      <SelectValue placeholder="Sort" />
                    </SelectTrigger>
                    <SelectContent align="start">
                      {SORT_OPTIONS.map((o) => (
                        <SelectItem key={o.value} value={o.value}>
                          {o.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-neutral-950">
            <div className="mx-auto max-w-7xl px-4 pb-6 pt-10 text-center sm:px-6 md:px-8 md:pt-12">
              <h2 className="text-2xl font-black tracking-tight text-white sm:text-3xl md:text-4xl">All projects</h2>
            </div>

            {filtered.length === 0 ? (
              <p className="mx-auto max-w-md px-4 pb-16 text-center text-neutral-400">
                No projects match these filters. Try choosing &ldquo;All&rdquo; for sector or location.
              </p>
            ) : (
              <section
                data-header-theme="dark"
                className="group/portfolioMarquee relative overflow-hidden bg-neutral-950"
                aria-label="Project portfolio"
              >
                <div className="flex w-max will-change-transform animate-project-marquee motion-reduce:animate-none group-hover/portfolioMarquee:[animation-play-state:paused]">
                  <div className="project-strip flex shrink-0 flex-nowrap bg-neutral-950 w-max lg:w-screen">
                    <PortfolioMarqueeCards projects={filtered} duplicate={false} />
                  </div>
                  <div
                    className="project-strip flex shrink-0 flex-nowrap bg-neutral-950 w-max lg:w-screen motion-reduce:hidden"
                    aria-hidden="true"
                  >
                    <PortfolioMarqueeCards projects={filtered} duplicate />
                  </div>
                </div>
              </section>
            )}
          </div>
        </section>
      )}

      <section id="delivery-areas" data-header-theme="light" className="bg-white">
        <div className="section-padding">
          <div className="mx-auto max-w-7xl">
            <Reveal className="max-w-3xl" direction="clip">
              <p className="eyebrow">Delivery areas</p>
              <h2 className="section-title mt-4">A flexible portfolio structure ready for real case studies.</h2>
              <p className="page-lead mt-6">
                This page is arranged to receive completed project photography and case study details as the portfolio
                grows, while still clearly presenting the types of work T&W Quantus supports.
              </p>
            </Reveal>
          </div>
        </div>

        {/* Continuous marquee + same `project-strip` hover expansion as home (lg+). */}
        <section
          data-header-theme="dark"
          className="group/deliveryMarquee relative overflow-hidden bg-neutral-950 py-1"
          aria-label="Delivery areas"
        >
          <div className="flex w-max will-change-transform animate-project-marquee motion-reduce:animate-none group-hover/deliveryMarquee:[animation-play-state:paused]">
            <div className="project-strip flex shrink-0 flex-nowrap bg-neutral-950 w-max lg:w-screen">
              <DeliveryAreaMarqueeCards duplicate={false} />
            </div>
            <div
              className="project-strip flex shrink-0 flex-nowrap bg-neutral-950 w-max lg:w-screen motion-reduce:hidden"
              aria-hidden="true"
            >
              <DeliveryAreaMarqueeCards duplicate />
            </div>
          </div>
        </section>
      </section>


      <section data-header-theme="light" className="section-padding bg-white">
        <Reveal
          className="mx-auto grid max-w-7xl gap-6 rounded-[1.5rem] bg-white p-5 shadow-sm ring-1 ring-black/5 sm:rounded-[2rem] sm:p-8 md:p-12 lg:grid-cols-[1fr_0.55fr] lg:items-center"
          direction="zoom"
        >
          <div>
            <p className="eyebrow">Case study ready</p>
            <h2 className="mt-4 text-[clamp(1.625rem,3.9vw,3.25rem)] font-black leading-[1.12] tracking-tight">
              Add client stories,
              <br />
              before-and-after imagery,
              <br />
              BOQ outcomes,
              <br />
              and delivery metrics here.
            </h2>
          </div>
          <Link to="/contact" className="btn-brand justify-self-start lg:justify-self-end">
            Discuss a Project <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </Reveal>
      </section>
    </Layout>
  );
}
