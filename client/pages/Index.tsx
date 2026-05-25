import { ArrowLeft, ArrowRight, CalendarDays, Loader2, MapPin, Minus, Play, Plus } from "lucide-react";
import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Layout } from "@/components/site/Layout";
import { Reveal } from "@/components/site/Reveal";
import { company, navigation, services } from "@/data/site";
import { useQuery } from "@tanstack/react-query";
import { fetchServiceNews, fetchPublishedProjects, fetchPublishedPerspectives } from "@/lib/api";
import { projectGalleryUrls, type NewsArticle, type ProjectDoc, type PerspectiveDoc } from "@shared/cms";
import { cn } from "@/lib/utils";
import { AutoSlideBackground } from "@/components/site/AutoSlideBackground";

const projectCards = [
  { title: "Residential Developments", location: "Rwanda", visual: "project-visual-1" },
  { title: "Commercial Spaces", location: "East Africa", visual: "project-visual-2" },
  { title: "Institutional Infrastructure", location: "Regional", visual: "project-visual-3" },
  { title: "Renovations & Technical Works", location: "Kigali", visual: "project-visual-4" },
];

/** Maps service index (0-based) → its WebP image in /images/ */
const serviceImages = [
  "/images/quantity-surveying.webp",
  "/images/construction-management.webp",
  "/images/construction-project-management.webp",
  "/images/construction-technical-service.webp",
];

// latestNews hardcoded array is replaced by dynamic fetching below in the component

export default function Index() {
  const [activeService, setActiveService] = useState(0);
  const [activeNewsSlide, setActiveNewsSlide] = useState(0);

  const { data: projects = [] } = useQuery<ProjectDoc[]>({
    queryKey: ["projects", "published", "home"],
    queryFn: fetchPublishedProjects,
    staleTime: 5 * 60 * 1000,
  });

  const dynamicProjectCards = useMemo(() => {
    const mappings = [
      {
        title: "Residential Developments",
        match: (p: ProjectDoc) => p.sector === "Residential buildings" || p.sector === "Multi-unit developments",
        defaultLocation: "Rwanda",
        visual: "project-visual-1"
      },
      {
        title: "Commercial Spaces",
        match: (p: ProjectDoc) => p.sector === "Commercial spaces",
        defaultLocation: "East Africa",
        visual: "project-visual-2"
      },
      {
        title: "Institutional Infrastructure",
        match: (p: ProjectDoc) => p.sector === "Institutional infrastructure",
        defaultLocation: "Regional",
        visual: "project-visual-3"
      },
      {
        title: "Renovations & Technical Works",
        match: (p: ProjectDoc) => p.sector === "Renovations and repairs" || p.sector === "Civil and structural works",
        defaultLocation: "Kigali",
        visual: "project-visual-4"
      }
    ];

    return mappings.map((m) => {
      const matchingProjects = projects
        .filter((p) => p.published && m.match(p))
        .sort((a, b) => (b.startDate || b.createdAt).localeCompare(a.startDate || a.createdAt));
      
      const latestProject = matchingProjects[0];
      const images = latestProject ? projectGalleryUrls(latestProject) : [];
      
      return {
        title: m.title,
        location: latestProject?.location || m.defaultLocation,
        visual: m.visual,
        images,
        slug: latestProject?.slug || "",
      };
    });
  }, [projects]);

  const { data: newsData, isLoading: isNewsLoading } = useQuery({
    queryKey: ["news", "services", "home"],
    queryFn: () => fetchServiceNews(),
    staleTime: 10 * 60 * 1000,
  });

  const { data: dynamicPerspectives = [], isLoading: isPerspectivesLoading } = useQuery({
    queryKey: ["perspectives", "public"],
    queryFn: fetchPublishedPerspectives,
  });

  const isLoading = isNewsLoading || isPerspectivesLoading;

  const perspectivesItems = dynamicPerspectives.map((p: PerspectiveDoc) => {
    const pDate = new Date(p.date);
    const validDate = !isNaN(pDate.getTime()) ? pDate : new Date(p.createdAt);
    
    return {
      title: p.title,
      category: p.category || "Perspective",
      publicationDate: p.date || new Date(p.createdAt).toLocaleDateString("en-GB", { day: '2-digit', month: 'short', year: 'numeric' }),
      sortDate: validDate.getTime(),
      summary: p.summary,
      visual: "",
      imageUrl: p.imageUrl,
      href: `/perspectives/${p.slug}`,
      external: false
    };
  });

  const industryNews = (newsData?.articles || []).map((a: NewsArticle) => {
    const pDate = a.publishedAt ? new Date(a.publishedAt) : new Date();
    return {
      title: a.title,
      category: a.source || "Industry News",
      publicationDate: a.publishedAt ? pDate.toLocaleDateString("en-GB", { day: '2-digit', month: 'short', year: 'numeric' }) : "Recent",
      sortDate: pDate.getTime(),
      summary: a.description,
      visual: "",
      imageUrl: a.urlToImage,
      href: a.url,
      external: true
    };
  });

  const combinedNews = [...perspectivesItems, ...industryNews].sort((a, b) => b.sortDate - a.sortDate);
  const latestNews = combinedNews.slice(0, 8);
  const newsSlideCount = Math.max(1, Math.ceil(latestNews.length / 2));
  const activeNews = latestNews.slice(activeNewsSlide * 2, activeNewsSlide * 2 + 2);

  const goToPreviousNews = () =>
    setActiveNewsSlide((slide) => (slide === 0 ? Math.max(0, newsSlideCount - 1) : slide - 1));
  const goToNextNews = () =>
    setActiveNewsSlide((slide) => (slide === Math.max(0, newsSlideCount - 1) ? 0 : slide + 1));

  return (
    <Layout>
      <section data-home-hero data-header-theme="dark" className="hero-section relative min-h-screen overflow-hidden bg-neutral-950 text-white">
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,0.78),rgba(0,0,0,0.38)_48%,rgba(0,0,0,0.64)),radial-gradient(circle_at_28%_75%,rgba(23,102,106,0.28),transparent_13%)]" />
        <motion.div
          className="absolute right-[-11rem] top-28 h-[34rem] w-[34rem] rounded-full border border-white/15"
          animate={{ rotate: 360 }}
          transition={{ duration: 38, repeat: Infinity, ease: "linear" }}
        />
        <div className="absolute inset-0 grid place-items-center px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 34, scale: 0.94, filter: "blur(14px)" }}
            animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
            transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1], delay: 0.25 }}
            className="max-w-5xl"
          >
            <motion.p
              className="text-xs font-black uppercase tracking-[0.4em] text-brand-light md:text-sm"
              animate={{ opacity: [0.7, 1, 0.7] }}
              transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
            >
              T&W QUANTUS
            </motion.p>
            <h1 className="mt-6 text-[clamp(2.6rem,8vw,6rem)] font-black leading-[0.98] tracking-tight text-white">
              Building Excellence,
              <span className="block text-brand-light">Delivering Trust</span>
            </h1>
            <motion.div
              className="mx-auto mt-8 h-px w-28 bg-gradient-to-r from-transparent via-brand-light to-transparent"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 1.1, delay: 0.8, ease: [0.22, 1, 0.36, 1] }}
            />
          </motion.div>
        </div>
        <motion.div
          className="absolute bottom-[12%] left-[12%] grid h-16 w-16 place-items-center rounded-full bg-brand text-white shadow-2xl shadow-brand/40 ring-[18px] ring-brand/20"
          animate={{ scale: [1, 1.08, 1] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
        >
          <Play className="h-6 w-6 fill-current" />
        </motion.div>
      </section>

      <section id="services-overview" data-header-theme="light" className="what-we-do-section relative overflow-hidden bg-white px-4 py-14 sm:px-6 md:px-8 md:py-24 lg:py-28">
        <div className="absolute left-[11%] top-40 hidden h-6 w-px bg-brand lg:block" />
        <div className="absolute left-[11%] top-[46%] hidden h-6 w-px bg-brand lg:block" />

        <div className="relative mx-auto grid max-w-7xl gap-10 lg:grid-cols-[80px_1fr] lg:gap-14">
          <div className="hidden justify-center lg:flex">
            <div className="origin-top rotate-180 [writing-mode:vertical-rl] text-xs font-black uppercase tracking-[0.22em] text-neutral-400">
              What we do
            </div>
          </div>

          <div>
            <Reveal direction="clip">
              <h2 className="max-w-5xl text-[clamp(1.625rem,3.65vw,3.25rem)] font-black leading-[1.05] tracking-tight text-neutral-950">
                From the beginning to the end of the built asset lifecycle, {company.shortName} provides
                a comprehensive suite of integrated services.
              </h2>
            </Reveal>

            <div className="mt-10 grid gap-8 sm:mt-12 lg:mt-16 lg:grid-cols-[0.82fr_1.05fr] lg:items-start lg:gap-14">
              <Reveal direction="left">
                <div className="relative min-h-[240px] overflow-hidden rounded-3xl shadow-2xl shadow-black/10 sm:min-h-[320px] lg:min-h-[360px] lg:rounded-none">
                  <AnimatePresence mode="wait">
                    <motion.img
                      key={activeService}
                      src={serviceImages[activeService]}
                      alt={services[activeService].title}
                      className="absolute inset-0 h-full w-full object-cover"
                      initial={{ opacity: 0, scale: 1.06, filter: "blur(8px)" }}
                      animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                      exit={{ opacity: 0, scale: 0.97, filter: "blur(8px)" }}
                      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                    />
                  </AnimatePresence>
                  {/* subtle dark gradient at the bottom for label legibility */}
                  <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/50 to-transparent" />
                </div>
              </Reveal>

              <Reveal delay={0.1} direction="right">
                <div className="divide-y divide-neutral-200">
                  {services.map((service, index) => {
                    const isActive = index === activeService;

                    return (
                      <div key={service.title} className="py-6 first:pt-0">
                        <button
                          type="button"
                          className="flex w-full items-center justify-between gap-6 text-left"
                          onClick={() => setActiveService(index)}
                        >
                          <span className="flex items-baseline gap-5">
                            <span className="text-xs font-black text-brand">{service.number}</span>
                            <span className="text-lg font-black text-neutral-950 sm:text-xl md:text-2xl">
                              {service.title}
                            </span>
                          </span>
                          <span className="text-brand">
                            {isActive ? <Minus className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                          </span>
                        </button>

                        {isActive && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            transition={{ duration: 0.3 }}
                            className="overflow-hidden"
                          >
                            <p className="mt-7 max-w-md text-sm leading-7 text-neutral-600 md:text-base">
                              {service.summary}
                            </p>
                            <Link
                              to={`/services/${service.slug}`}
                              className="mt-5 inline-flex border-b-2 border-brand text-sm font-black text-neutral-950 transition hover:text-brand"
                            >
                              View More
                            </Link>
                          </motion.div>
                        )}
                      </div>
                    );
                  })}
                </div>

                <Link to="/services" className="mt-10 inline-flex items-center rounded-full bg-brand px-10 py-4 text-sm font-black text-white transition hover:bg-brand-light">
                  View all services <ArrowRight className="ml-3 h-4 w-4" />
                </Link>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      <section data-header-theme="light" className="what-we-do-section relative overflow-hidden bg-white px-4 py-14 sm:px-6 md:px-8 md:py-24 lg:py-28">
        <div className="relative mx-auto max-w-5xl">
          <Reveal direction="rotate">
            <h2 className="max-w-4xl text-[clamp(1.625rem,3.25vw,2.875rem)] font-black leading-[1.06] tracking-tight text-neutral-950">
              We focus on providing added value to clients' portfolios and minimizing risk by
              understanding exactly what they need, working collaboratively and transparently to
              gain the insights that bring results.
            </h2>
            <Link to="/projects" className="mt-10 inline-flex items-center rounded-full bg-brand px-10 py-4 text-sm font-black text-white transition hover:bg-brand-light">
              View all projects <ArrowRight className="ml-3 h-4 w-4" />
            </Link>
          </Reveal>
        </div>
      </section>

      <section id="projects" data-header-theme="dark" className="project-strip grid bg-neutral-950 md:grid-cols-2 lg:flex">
        {dynamicProjectCards.map((project, index) => {
          const toLink = project.slug ? `/projects/${encodeURIComponent(project.slug)}` : "/projects";
          return (
            <Link
              key={project.title}
              to={toLink}
              className={`group project-card project-card-item ${project.visual} relative min-h-[320px] overflow-hidden p-6 text-white sm:min-h-[380px] sm:p-8 lg:min-h-[440px]`}
            >
              <AutoSlideBackground 
                images={project.images} 
                visualClass={`project-card-bg ${project.visual}`} 
              />
              <div className="absolute inset-0 bg-[linear-gradient(rgba(23,102,106,0.12),rgba(0,0,0,0.35)),radial-gradient(ellipse_at_42%_12%,rgba(255,255,255,0.55),transparent_26%)] mix-blend-overlay pointer-events-none" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent transition duration-700 group-hover:from-brand-dark/85" />
              <div className="relative flex h-full flex-col justify-end">
                <h3 className="max-w-xs text-xl font-black transition duration-700 group-hover:translate-y-[-4px] group-hover:text-2xl">
                  {project.title}
                </h3>
                <p className="mt-4 flex items-center gap-2 text-sm font-bold">
                  <MapPin className="h-4 w-4 text-brand-light" />
                  {project.location}
                </p>
              </div>
              <div className="absolute bottom-8 right-8 grid h-12 w-12 place-items-center rounded-full bg-brand opacity-0 transition duration-500 group-hover:opacity-100">
                <ArrowRight className="h-5 w-5" />
              </div>
            </Link>
          );
        })}
      </section>

      <section id="perspectives" data-header-theme="light" className="relative overflow-hidden bg-white px-4 py-14 sm:px-6 md:px-8 md:py-24 lg:py-28">
        <div className="absolute bottom-0 left-0 top-0 hidden w-[28%] bg-brand-dark lg:block" />
        <div className="absolute left-[15%] top-64 hidden origin-top rotate-180 [writing-mode:vertical-rl] text-xs font-black uppercase tracking-[0.22em] text-white lg:block">
          Perspectives & News
        </div>
        <div className="relative mx-auto grid max-w-7xl gap-10 lg:grid-cols-[260px_minmax(0,1fr)] xl:grid-cols-[320px_minmax(0,1fr)]">
          <Reveal className="hidden self-end lg:block" direction="skew">
            <div className="space-y-8 text-white">
              <div className="flex items-center gap-5 text-xs font-black">
                <button
                  type="button"
                  onClick={goToPreviousNews}
                  className="transition hover:-translate-x-1 hover:text-brand-light"
                  aria-label="Previous news slide"
                >
                  <ArrowLeft className="h-4 w-4" />
                </button>
                <span>{String(activeNewsSlide + 1).padStart(2, "0")}</span>
                <span className="text-white/45">|</span>
                <span>{String(newsSlideCount).padStart(2, "0")}</span>
                <button
                  type="button"
                  onClick={goToNextNews}
                  className="transition hover:translate-x-1 hover:text-brand-light"
                  aria-label="Next news slide"
                >
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
              <Link to="/perspectives" className="inline-flex border-b-2 border-brand-light text-sm font-black text-white">
                All Perspectives & Insights
              </Link>
            </div>
          </Reveal>

          <div>
            <div className="mb-10 flex items-center justify-between text-sm font-bold text-neutral-500">
              <span>Perspectives</span>
              <div className="flex items-center gap-4 lg:hidden">
                <button type="button" onClick={goToPreviousNews} aria-label="Previous news slide">
                  <ArrowLeft className="h-4 w-4 text-brand" />
                </button>
                <span className="text-neutral-900">
                  {String(activeNewsSlide + 1).padStart(2, "0")} | {String(newsSlideCount).padStart(2, "0")}
                </span>
                <button type="button" onClick={goToNextNews} aria-label="Next news slide">
                  <ArrowRight className="h-4 w-4 text-brand" />
                </button>
              </div>
            </div>
            <AnimatePresence mode="wait">
              {isLoading ? (
                <motion.div
                  key="loading"
                  className="flex flex-col items-center justify-center py-24 text-neutral-500 gap-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <Loader2 className="h-8 w-8 animate-spin text-brand" />
                  <span className="text-[0.65rem] font-black uppercase tracking-[0.25em] text-neutral-400">Loading latest news...</span>
                </motion.div>
              ) : (
                <motion.div
                  key={activeNewsSlide}
                  className="grid gap-10 md:grid-cols-2"
                  initial={{ opacity: 0, x: 36, filter: "blur(10px)" }}
                  animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                  exit={{ opacity: 0, x: -36, filter: "blur(10px)" }}
                  transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                >
                  {activeNews.map((news) => (
                    <article key={news.title}>
                      <div className="mb-6 text-sm font-bold text-neutral-500">
                        {news.publicationDate}
                      </div>
                      {news.external ? (
                        <a href={news.href} target="_blank" rel="noreferrer" className="group/news">
                          <div className={cn(
                            "relative min-h-[250px] overflow-hidden rounded-3xl sm:min-h-[320px] lg:min-h-[370px] lg:rounded-none transition-transform duration-500 group-hover/news:scale-[1.02]",
                            news.visual
                          )}
                          style={news.imageUrl ? { backgroundImage: `url(${news.imageUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}}
                          >
                            <div className="absolute bottom-6 right-6 grid h-14 w-14 place-items-center rounded-full bg-brand text-white transition hover:bg-brand-light">
                              <ArrowRight className="h-5 w-5" />
                            </div>
                          </div>
                          <div className="mt-9 flex items-center gap-3 text-xs font-black uppercase tracking-[0.18em] text-brand">
                            <CalendarDays className="h-4 w-4" />
                            {news.category}
                          </div>
                          <h3 className="mt-4 text-2xl font-black leading-tight text-neutral-950 group-hover/news:text-brand transition-colors">
                            {news.title}
                          </h3>
                          <p className="mt-5 leading-7 text-neutral-600">{news.summary}</p>
                        </a>
                      ) : (
                        <Link to={news.href} className="group/news">
                          <div className={cn(
                            "relative min-h-[250px] overflow-hidden rounded-3xl sm:min-h-[320px] lg:min-h-[370px] lg:rounded-none transition-transform duration-500 group-hover/news:scale-[1.02]",
                            news.visual
                          )}
                          style={news.imageUrl ? { backgroundImage: `url(${news.imageUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}}
                          >
                            <div className="absolute bottom-6 right-6 grid h-14 w-14 place-items-center rounded-full bg-brand text-white transition hover:bg-brand-light">
                              <ArrowRight className="h-5 w-5" />
                            </div>
                          </div>
                          <div className="mt-9 flex items-center gap-3 text-xs font-black uppercase tracking-[0.18em] text-brand">
                            <CalendarDays className="h-4 w-4" />
                            {news.category}
                          </div>
                          <h3 className="mt-4 text-2xl font-black leading-tight text-neutral-950 group-hover/news:text-brand transition-colors">
                            {news.title}
                          </h3>
                          <p className="mt-5 leading-7 text-neutral-600">{news.summary}</p>
                        </Link>
                      )}
                    </article>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </section>


      <section data-header-theme="dark" className="relative overflow-hidden bg-brand px-5 py-16 text-white md:px-8">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,rgba(255,255,255,0.22),transparent_24%)]" />
        <Reveal className="relative mx-auto flex max-w-7xl flex-col items-start justify-between gap-8 md:flex-row md:items-center" direction="clip">
          <div>
            <p className="eyebrow text-white/70">Ready to discuss your project?</p>
            <h2 className="mt-3 max-w-3xl text-[clamp(1.625rem,3.9vw,3.25rem)] font-black leading-[1.05] tracking-tight">
              Start with a precise view of cost, scope, and delivery.
            </h2>
          </div>
          <Link to="/contact" className="btn-dark shrink-0">
            Contact T&W Quantus
          </Link>
        </Reveal>
      </section>
    </Layout>
  );
}
