import { ArrowRight } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
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

const SCROLL_PIN_OFFSET = 130;

/** Compact line for the rail — numbers stay in their own badge; text can wrap here. */
const SERVICE_RAIL_LABEL: Record<string, string> = {
  "quantity-surveying-cost-management": "Quantity surveying & cost management",
  "construction-management": "Construction management",
  "project-management": "Project management",
};

function railLabel(slug: string, fallback: string) {
  return SERVICE_RAIL_LABEL[slug] ?? fallback.replace(/\s+Services$/i, "");
}

function initialRailIndexFromHash() {
  if (typeof window === "undefined") return 0;
  const hash = window.location.hash.replace(/^#/, "");
  const idx = SECTION_IDS.indexOf(hash);
  return idx >= 0 ? idx : 0;
}

/** Which service block is “current” — drives the sticky capsule rail only. */
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

  const showDetailBullets = useCallback(
    (key: string) => detailOpen.has(key) || detailHover === key,
    [detailOpen, detailHover],
  );

  const heroLead =
    "Integrated delivery for the built environment—cost intelligence, site execution, and programme leadership—calibrated for East African projects and international standards.";

  return (
    <Layout>
      {/* Hero: mesh field + stacked type — distinct from About’s editorial layout */}
      <section
        data-header-theme="dark"
        className="relative isolate overflow-hidden bg-neutral-950 px-4 pb-16 pt-28 text-white sm:px-6 sm:pb-20 sm:pt-32 md:px-8 md:pb-24 md:pt-36"
      >
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.55]"
          aria-hidden
        >
          <div className="page-hero-visual absolute inset-0 scale-105 page-hero-services" />
        </div>
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_90%_60%_at_10%_-10%,rgba(43,143,148,0.35),transparent_55%),radial-gradient(ellipse_70%_50%_at_90%_30%,rgba(23,102,106,0.2),transparent_50%),radial-gradient(ellipse_50%_40%_at_50%_100%,rgba(0,0,0,0.5),transparent)]"
          aria-hidden
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/75 to-neutral-950" />

        <div className="relative mx-auto max-w-7xl">
          <Link
            to="/"
            className="mb-12 inline-flex items-center gap-2 text-[0.65rem] font-bold uppercase tracking-[0.22em] text-white/55 transition hover:text-brand-light"
          >
            <span aria-hidden className="text-brand-light">
              ←
            </span>
            Home
          </Link>

          <div className="max-w-4xl">
            <p className="inline-block -rotate-2 rounded-md bg-brand/90 px-3 py-1 text-[0.65rem] font-black uppercase tracking-[0.2em] text-white shadow-lg shadow-brand/20">
              Capabilities
            </p>
            <h1 className="mt-6 text-[clamp(2.25rem,7vw,4.5rem)] font-black leading-[0.95] tracking-[-0.03em] text-pretty text-white">
              Services
              <span className="block text-white/55">&amp; sectors</span>
            </h1>
            <p className="mt-8 max-w-2xl text-base font-medium leading-relaxed text-neutral-300/95 sm:text-lg">
              {heroLead}
            </p>
          </div>
        </div>
      </section>

      {/* Sticky rail: index badge (never truncated) + label column — not a single squeezed line */}
      <div
        className="sticky top-28 z-30 border-b border-black/[0.06] bg-white/75 shadow-sm shadow-black/[0.03] backdrop-blur-xl supports-[backdrop-filter]:bg-white/65"
        data-header-theme="light"
      >
        <div className="mx-auto flex max-w-7xl items-stretch gap-2 overflow-x-auto px-4 py-3 sm:gap-3 sm:px-6 md:px-8 [&::-webkit-scrollbar]:h-0">
          {services.map((service, i) => {
            const active = activeIndex === i;
            const id = getServiceId(service.title);
            const label = railLabel(service.slug, service.title);
            return (
              <a
                key={service.slug}
                href={`#${id}`}
                title={service.title}
                aria-label={`${service.number} ${service.title}`}
                className={cn(
                  "flex min-w-[min(100%,18rem)] shrink-0 snap-start items-center gap-3 rounded-2xl border px-3 py-2.5 text-left transition duration-200 sm:min-w-0 sm:flex-1 sm:gap-4 sm:px-4 sm:py-3",
                  active
                    ? "border-brand bg-brand text-white shadow-md shadow-brand/25"
                    : "border-neutral-200/80 bg-white/90 text-neutral-800 hover:border-brand/35 hover:bg-brand/[0.06]",
                )}
              >
                <span
                  className={cn(
                    "grid h-12 w-12 shrink-0 place-items-center rounded-xl text-xl font-black tabular-nums leading-none tracking-tight sm:h-14 sm:w-14 sm:text-2xl",
                    active ? "bg-white/20 text-white" : "bg-brand/10 text-brand",
                  )}
                  aria-hidden
                >
                  {service.number}
                </span>
                <span className="min-w-0 flex-1 text-[0.68rem] font-bold uppercase leading-snug tracking-[0.06em] text-pretty sm:text-[0.72rem] sm:leading-tight">
                  {label}
                </span>
              </a>
            );
          })}
        </div>
      </div>

      <div className="bg-neutral-50">
        {services.map((service, index) => {
          const isDark = index === 1;
          const id = getServiceId(service.title);
          const imageFirst = index !== 1;

          return (
            <article
              key={service.slug}
              id={id}
              data-header-theme={isDark ? "dark" : "light"}
              className={cn(
                "relative scroll-mt-36 overflow-hidden sm:scroll-mt-40",
                isDark ? "bg-neutral-900 text-white" : "bg-neutral-50",
              )}
            >
              {/* Watermark index — large ambient numeral, unique to this page */}
              <span
                className={cn(
                  "pointer-events-none absolute -right-4 top-8 select-none text-[clamp(6rem,22vw,14rem)] font-black leading-none tracking-tighter",
                  isDark ? "text-white/[0.04]" : "text-neutral-900/[0.06]",
                )}
                aria-hidden
              >
                {service.number}
              </span>

              <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 md:px-8 lg:py-24">
                <div
                  className={cn(
                    "grid items-center gap-12 lg:gap-16",
                    imageFirst ? "lg:grid-cols-[1fr_1.05fr]" : "lg:grid-cols-[1.05fr_1fr]",
                  )}
                >
                  <div
                    className={cn(
                      "relative min-h-[14rem] sm:min-h-[18rem] lg:min-h-[22rem]",
                      !imageFirst && "lg:order-2",
                    )}
                  >
                    <div
                      className={cn(
                        "service-detail-visual absolute inset-0",
                        `service-visual-${index + 1}`,
                        isDark
                          ? "rounded-2xl ring-1 ring-white/10"
                          : "rounded-2xl shadow-xl shadow-black/10 ring-1 ring-black/[0.06]",
                      )}
                    />
                  </div>
                  <Reveal direction={index % 2 === 0 ? "left" : "right"}>
                    <div className={cn(!imageFirst && "lg:order-1")}>
                      <p
                        className={cn(
                          "text-xs font-black uppercase tracking-[0.2em]",
                          isDark ? "text-brand-light" : "text-brand",
                        )}
                      >
                        Pillar {service.number}
                      </p>
                      <h2
                        className={cn(
                          "mt-4 text-3xl font-black leading-[1.08] tracking-tight text-pretty sm:text-4xl lg:text-[clamp(2rem,3.5vw,2.75rem)]",
                          isDark ? "text-white" : "text-neutral-950",
                        )}
                      >
                        {service.title}
                      </h2>
                      <p
                        className={cn(
                          "mt-6 max-w-xl text-base leading-relaxed sm:text-lg",
                          isDark ? "text-neutral-300" : "text-neutral-600",
                        )}
                      >
                        {service.pageIntro}
                      </p>
                      <Link
                        to={`/services/${service.slug}`}
                        className={cn(
                          "group mt-8 inline-flex items-center gap-2 text-sm font-black uppercase tracking-wide",
                          isDark
                            ? "text-white underline decoration-brand decoration-2 underline-offset-8 hover:decoration-brand-light"
                            : "text-neutral-950 underline decoration-brand decoration-2 underline-offset-8 hover:text-brand",
                        )}
                      >
                        Open full brief
                        <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                      </Link>
                    </div>
                  </Reveal>
                </div>

                {/* Horizontal snap scroller for workstreams — different from About’s static grid */}
                <div className="relative mt-12 lg:mt-16">
                  <p
                    className={cn(
                      "mb-4 text-[0.65rem] font-black uppercase tracking-[0.18em]",
                      isDark ? "text-neutral-500" : "text-neutral-500",
                    )}
                  >
                    Workstreams
                  </p>
                  <div
                    className={cn(
                      "flex gap-3 overflow-x-auto pb-3 pt-1 [-ms-overflow-style:none] [scrollbar-width:none] snap-x snap-mandatory md:flex-wrap md:overflow-visible md:snap-none md:pb-0 [&::-webkit-scrollbar]:hidden",
                    )}
                  >
                    {service.detailGroups.map((group) => {
                      const dKey = detailCardKey(service.slug, group.title);
                      const bulletsVisible = showDetailBullets(dKey);

                      return (
                        <div
                          key={group.title}
                          className={cn(
                            "w-[min(100%,280px)] shrink-0 snap-start sm:w-[min(100%,260px)] md:w-[calc(50%-0.375rem)] lg:w-[calc(33.333%-0.5rem)]",
                          )}
                          onMouseEnter={() => setDetailHover(dKey)}
                          onMouseLeave={() => setDetailHover(null)}
                        >
                          <div
                            className={cn(
                              "flex h-full flex-col rounded-2xl border p-4 transition sm:p-5",
                              isDark
                                ? "border-white/10 bg-white/[0.04] hover:border-brand/40"
                                : "border-black/[0.08] bg-white shadow-sm hover:border-brand/30",
                            )}
                          >
                            <button
                              type="button"
                              className="flex w-full items-start justify-between gap-2 text-left"
                              aria-expanded={bulletsVisible}
                              onClick={() => toggleDetail(dKey)}
                            >
                              <h3
                                className={cn(
                                  "text-left text-[0.8rem] font-bold uppercase leading-snug tracking-wide",
                                  isDark ? "text-white" : "text-neutral-900",
                                )}
                              >
                                {group.title}
                              </h3>
                              <span
                                className={cn(
                                  "mt-0.5 shrink-0 text-xs font-black transition-transform",
                                  isDark ? "text-brand-light" : "text-brand",
                                  bulletsVisible && "rotate-90",
                                )}
                                aria-hidden
                              >
                                →
                              </span>
                            </button>
                            <div
                              className={cn(
                                "grid transition-[grid-template-rows,opacity,margin] duration-300 ease-out",
                                bulletsVisible
                                  ? "mt-4 grid-rows-[1fr] opacity-100"
                                  : "mt-0 grid-rows-[0fr] opacity-0",
                              )}
                            >
                              <ul
                                className={cn(
                                  "min-h-0 space-y-2 overflow-hidden text-sm leading-relaxed",
                                  isDark ? "text-neutral-400" : "text-neutral-600",
                                )}
                              >
                                {group.items.map((item) => (
                                  <li key={item} className="flex gap-2">
                                    <span
                                      className={cn(
                                        "mt-2 h-1 w-1 shrink-0 rounded-full",
                                        isDark ? "bg-brand-light" : "bg-brand",
                                      )}
                                    />
                                    <span className="text-pretty">{item}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      <section data-header-theme="dark" className="section-padding bg-neutral-950 text-white">
        <Reveal
          className="mx-auto flex max-w-7xl flex-col justify-between gap-8 md:flex-row md:items-center"
          direction="rotate"
        >
          <div>
            <p className="eyebrow text-brand-light">Procurement and standards</p>
            <h2 className="mt-4 max-w-4xl text-[clamp(1.625rem,3.9vw,3.25rem)] font-black leading-[1.05] tracking-tight text-pretty">
              Support for FIDIC, RPPA, JCT, NEC, traditional, D&amp;B, and EPC procurement models.
            </h2>
          </div>
          <Link to="/contact" className="btn-brand shrink-0">
            Request service advice <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </Reveal>
      </section>
    </Layout>
  );
}
