import { ArrowRight } from "lucide-react";
import {
  forwardRef,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
  type RefObject,
} from "react";
import { Link } from "react-router-dom";
import { Layout } from "@/components/site/Layout";
import { PageHero } from "@/components/site/PageHero";
import { Reveal } from "@/components/site/Reveal";
import { values } from "@/data/site";
import { cn } from "@/lib/utils";

const ABOUT_NAV = [
  { id: "who-we-are", label: "Who we are" },
  { id: "collaborate", label: "Collaborate with us" },
  { id: "vision-mission", label: "Vision & mission" },
  { id: "core-values", label: "Core values" },
] as const;

const SECTION_IDS = ABOUT_NAV.map((item) => item.id);

/** Pinned below the site header; keep in sync with section scroll-mt / header height. */
const ABOUT_SCROLL_OFFSET_PX = 120;

function useAboutPageScroll(sidebarAsideRef: RefObject<HTMLElement | null>) {
  const [activeId, setActiveId] = useState<string>(() => {
    if (typeof window === "undefined") return SECTION_IDS[0] ?? "";
    const hash = window.location.hash.replace(/^#/, "");
    const ids = SECTION_IDS as readonly string[];
    return ids.includes(hash) ? hash : (SECTION_IDS[0] ?? "");
  });
  const [showSectionNav, setShowSectionNav] = useState(false);
  const [sidebarOffsetY, setSidebarOffsetY] = useState(0);

  useEffect(() => {
    const update = () => {
      let pastWho = false;
      const who = document.getElementById("who-we-are");
      if (who) {
        const whoTop = who.getBoundingClientRect().top + window.scrollY;
        pastWho = window.scrollY + ABOUT_SCROLL_OFFSET_PX >= whoTop;
      }

      const footerEl = document.getElementById("site-footer");
      /** True once the footer enters the viewport (hide sidebar; hero uses !pastWho). */
      const footerEntered =
        footerEl !== null &&
        footerEl.getBoundingClientRect().top < window.innerHeight;

      const showNav = pastWho && !footerEntered;
      setShowSectionNav((prev) => (prev === showNav ? prev : showNav));

      const y = window.scrollY + ABOUT_SCROLL_OFFSET_PX;
      let current = SECTION_IDS[0] ?? "";
      for (const id of SECTION_IDS) {
        const el = document.getElementById(id);
        if (!el) continue;
        const top = el.getBoundingClientRect().top + window.scrollY;
        if (top <= y) current = id;
      }
      setActiveId((prev) => (prev === current ? prev : current));

      let nextOffset = 0;
      if (showNav) {
        const sidebarEl = sidebarAsideRef.current;
        if (sidebarEl && footerEl) {
          const footerTop = footerEl.getBoundingClientRect().top;
          const vh = window.innerHeight;
          const sidebarH = Math.max(sidebarEl.getBoundingClientRect().height, 1);
          const sidebarHalf = sidebarH / 2;
          const margin = 24;
          const headerReserve = ABOUT_SCROLL_OFFSET_PX;
          /** Keep sidebar center at viewport middle (offset 0) unless header or footer forces a shift. */
          const headerLower = headerReserve - vh / 2 + sidebarHalf;
          const footerUpper = footerTop - margin - vh / 2 - sidebarHalf;
          let offsetY = Math.max(headerLower, Math.min(footerUpper, 0));
          if (footerUpper < headerLower) {
            offsetY = footerUpper;
          }
          nextOffset = offsetY;
        }
      }
      setSidebarOffsetY((prev) => (prev === nextOffset ? prev : nextOffset));
    };

    update();
    requestAnimationFrame(update);

    const onHash = () => update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    window.addEventListener("hashchange", onHash);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
      window.removeEventListener("hashchange", onHash);
    };
  }, [sidebarAsideRef]);

  return { activeId, showSectionNav, sidebarOffsetY };
}

type AboutSectionNavProps = {
  activeId: string;
  className?: string;
  navClassName?: string;
  /** False while hidden (e.g. over hero) so links are not clickable. */
  navInteractive?: boolean;
  style?: CSSProperties;
};

const AboutSectionNav = forwardRef<HTMLElement, AboutSectionNavProps>(function AboutSectionNav(
  { activeId, className, navClassName, navInteractive = true, style },
  ref,
) {
  return (
    <aside ref={ref} className={className} style={style}>
      <nav
        className={cn(navClassName, !navInteractive && "pointer-events-none")}
        aria-label="About page sections"
        aria-hidden={!navInteractive}
      >
        {ABOUT_NAV.map((item) => {
          const active = activeId === item.id;
          return (
            <a
              key={item.id}
              href={`#${item.id}`}
              className={cn(
                "flex min-w-0 items-center gap-3 border-b border-transparent py-2.5 text-left text-[0.65rem] uppercase tracking-[0.22em] transition-colors lg:border-b-0 lg:py-3 lg:pr-2",
                active
                  ? "font-black text-neutral-950"
                  : "font-semibold text-neutral-500 hover:text-neutral-800",
              )}
            >
              <span
                className={cn(
                  "h-px w-5 shrink-0 transition-colors lg:w-6",
                  active ? "bg-brand" : "bg-transparent",
                )}
                aria-hidden
              />
              <span className="whitespace-nowrap lg:whitespace-normal">{item.label}</span>
            </a>
          );
        })}
      </nav>
    </aside>
  );
});

function AboutBlockTitle({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn("flex gap-4", className)}>
      <span
        className="mt-1.5 h-9 w-1 shrink-0 self-start bg-brand sm:mt-2 sm:h-11"
        aria-hidden
      />
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}

function LeadParagraph({
  lead,
  children,
  className,
}: {
  lead: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <p className={cn("page-body text-pretty text-neutral-800", className)}>
      <span className="font-semibold text-brand">{lead}</span> {children}
    </p>
  );
}

export default function About() {
  const desktopNavAsideRef = useRef<HTMLElement>(null);
  const { activeId, showSectionNav, sidebarOffsetY } = useAboutPageScroll(desktopNavAsideRef);

  const desktopNavStyle: CSSProperties = {
    transform: `translateY(calc(-50% + ${sidebarOffsetY}px))`,
  };

  return (
    <Layout>
      <PageHero
        eyebrow="About T&W Quantus"
        title="Excellence in quantity surveying and the built environment."
        description="From concept through handover, we focus on precise evaluation, value optimization, and dependable project outcomes."
        visual="about"
      />

      <div className="about-pattern-bg relative">
        <div className="relative mx-auto max-w-7xl px-4 pb-16 pt-10 sm:px-6 sm:pb-20 sm:pt-12 md:px-8 lg:pb-28 lg:pt-16">
          <AboutSectionNav
            activeId={activeId}
            navInteractive={showSectionNav}
            className={cn(
              "mb-10 transition-opacity duration-300 lg:hidden",
              showSectionNav ? "opacity-100" : "pointer-events-none invisible h-0 overflow-hidden mb-0 opacity-0",
            )}
            navClassName="flex gap-1 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] lg:flex-col lg:gap-0 lg:overflow-visible lg:pb-0 [&::-webkit-scrollbar]:hidden"
          />

          <AboutSectionNav
            ref={desktopNavAsideRef}
            activeId={activeId}
            navInteractive={showSectionNav}
            style={desktopNavStyle}
            className={cn(
              "pointer-events-none fixed top-1/2 z-20 hidden w-52 transition-[transform,opacity] duration-300 ease-out xl:w-56 lg:left-[max(1rem,calc(50vw-40rem+2rem))] lg:block",
              showSectionNav ? "opacity-100" : "opacity-0",
            )}
            navClassName="pointer-events-auto flex flex-col gap-0 overflow-visible pb-0 pr-2"
          />

          <div
            className={cn(
              "min-w-0 transition-[margin] duration-300 ease-out",
              showSectionNav && "lg:ml-[calc(13rem+3rem)] xl:ml-[calc(14rem+5rem)]",
            )}
          >
              <section
                id="who-we-are"
                data-header-theme="light"
                className="scroll-mt-28 border-b border-neutral-200/80 pb-16 sm:scroll-mt-32 sm:pb-20 lg:pb-24"
              >
                <Reveal direction="left">
                  <div className="grid gap-10 lg:grid-cols-[minmax(0,280px)_1fr] lg:gap-14 xl:grid-cols-[minmax(0,320px)_1fr]">
                    <div className="relative aspect-[4/5] w-full max-lg:max-h-80 lg:aspect-auto lg:min-h-[28rem]">
                      <div className="service-detail-visual service-visual-2 absolute inset-0 rounded-none" />
                    </div>
                    <div>
                      <p className="text-[0.65rem] font-black uppercase tracking-[0.28em] text-neutral-500 sm:text-xs">
                        Our story
                      </p>
                      <AboutBlockTitle className="mt-3 sm:mt-4">
                        <h2 className="text-2xl font-black tracking-tight text-neutral-950 text-pretty sm:text-3xl md:text-[clamp(1.75rem,2.8vw,2.35rem)] md:leading-[1.12]">
                          Who we are
                        </h2>
                      </AboutBlockTitle>

                      <div className="mt-8 space-y-7 sm:mt-10 sm:space-y-8">
                        <LeadParagraph lead="We are T&W QUANTUS,">
                          a Quantity Surveying team committed to delivering excellence in the built
                          environment. Derived from the Latin word &ldquo;Quantus,&rdquo; meaning
                          &ldquo;How much?&rdquo; or &ldquo;How great,&rdquo; our name reflects our core
                          philosophy—precise evaluation, value optimization, and outstanding project
                          outcomes. We support our clients at every stage of the project lifecycle, from
                          concept development and financial planning through to execution and final
                          handover.
                        </LeadParagraph>
                        <p className="page-body text-pretty text-neutral-800">
                          <span className="font-semibold text-brand">T&amp;W QUANTUS.</span> Founded with a
                          vision to provide reliable and cost-effective construction services, T&amp;W
                          Quantus is built on technical ability, collaboration, and a clear understanding
                          of project demands. Our multidisciplinary team works across a range of projects,
                          including multi-unit developments, institutional infrastructure, and renovation
                          works, delivering solutions defined by precision, transparency, and reliability.
                        </p>
                      </div>

                      <figure className="relative mt-10 border-l-4 border-brand bg-neutral-50/80 pl-6 pr-5 py-7 sm:mt-12 sm:pl-8 sm:pr-7 sm:py-9">
                        <blockquote className="text-base font-semibold leading-[1.65] tracking-[-0.01em] text-neutral-900 sm:text-lg sm:leading-[1.7] text-pretty">
                          &ldquo;At T&W Quantus, our reputation is grounded in integrity, innovation, and
                          measurable results. We go beyond managing costs; we create lasting value for our
                          clients, communities, and stakeholders by ensuring every project is delivered with
                          accuracy, efficiency, and excellence.&rdquo;
                        </blockquote>
                      </figure>
                    </div>
                  </div>
                </Reveal>
              </section>

              <section
                id="collaborate"
                data-header-theme="light"
                className="scroll-mt-28 border-b border-neutral-200/80 py-16 sm:scroll-mt-32 sm:py-20 lg:py-24"
              >
                <Reveal direction="up">
                  <div className="grid gap-10 lg:grid-cols-[minmax(0,280px)_1fr] lg:gap-14 xl:grid-cols-[minmax(0,320px)_1fr]">
                    <div className="relative order-2 aspect-[4/5] w-full max-lg:max-h-72 lg:order-1 lg:aspect-auto lg:min-h-[26rem]">
                      <div className="service-detail-visual service-visual-3 absolute inset-0 rounded-none" />
                    </div>
                    <div className="order-1 min-w-0 lg:order-2">
                      <p className="text-[0.65rem] font-black uppercase tracking-[0.28em] text-neutral-500 sm:text-xs">
                        Partnership
                      </p>
                      <AboutBlockTitle className="mt-3 sm:mt-4">
                        <h2 className="break-normal text-2xl font-black leading-[1.12] tracking-tight text-neutral-950 [overflow-wrap:normal] [word-break:normal] sm:text-3xl md:text-[clamp(1.65rem,2.6vw,2.1rem)]">
                          <span className="block">Collaborate</span>
                          <span className="block">With Us</span>
                        </h2>
                      </AboutBlockTitle>

                      <LeadParagraph lead="Work with T&W QUANTUS" className="mt-8 sm:mt-10">
                        and engage a highly competent team committed to delivering precision, efficiency,
                        and measurable value across every stage of your project lifecycle. Our approach is
                        grounded in technical ability, rigorous cost control, and a disciplined
                        understanding of construction processes, ensuring outcomes that meet the highest
                        standards of quality, time, and budget performance.
                      </LeadParagraph>
                      <p className="page-body mt-6 text-pretty text-neutral-800 sm:mt-7">
                        We deliver tailored, value-driven solutions aligned to your specific project
                        requirements, while integrating sustainable practices that support long-term
                        viability and responsible development. Through structured communication,
                        transparency, and a client-focused method, we build trusted partnerships and
                        consistently deliver projects with accuracy, reliability, and professional
                        excellence.
                      </p>
                      <Link
                        to="/contact"
                        className="btn-brand mt-8 inline-flex items-center sm:mt-10"
                      >
                        Start a conversation
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </Link>
                    </div>
                  </div>
                </Reveal>
              </section>

              <section
                id="vision-mission"
                data-header-theme="light"
                className="scroll-mt-28 border-b border-neutral-200/80 py-16 sm:scroll-mt-32 sm:py-20 lg:py-24"
              >
                <Reveal className="mb-10 sm:mb-12" direction="clip">
                  <p className="text-[0.65rem] font-black uppercase tracking-[0.28em] text-neutral-500 sm:text-xs">
                    Direction
                  </p>
                  <AboutBlockTitle className="mt-3 sm:mt-4">
                    <h2 className="text-2xl font-black tracking-tight text-neutral-950 text-pretty sm:text-3xl md:text-[clamp(1.75rem,2.8vw,2.35rem)] md:leading-[1.12]">
                      Vision &amp; mission
                    </h2>
                  </AboutBlockTitle>
                  <p className="page-lead mt-5 max-w-2xl text-pretty sm:mt-6">
                    What we aim to become—and how we work every day to get there.
                  </p>
                </Reveal>

                <div className="grid gap-8 lg:grid-cols-2 lg:gap-10">
                  <Reveal direction="clip">
                    <article className="flex h-full flex-col border border-neutral-200 bg-white shadow-sm">
                      <div className="relative h-48 overflow-hidden sm:h-52">
                        <div className="service-detail-visual service-visual-2 absolute inset-0 scale-105 rounded-none" />
                      </div>
                      <div className="flex flex-1 flex-col p-6 sm:p-8">
                        <p className="text-[0.65rem] font-black uppercase tracking-[0.24em] text-brand sm:text-xs">
                          Our vision
                        </p>
                        <LeadParagraph lead="To be a leading force" className="mt-5 sm:mt-6">
                          in delivering innovative, high-quality, and sustainable construction solutions
                          that transform the built environment and enhance communities. We strive to be
                          recognized for our precision, professionalism, and commitment to excellence in
                          every project we undertake.
                        </LeadParagraph>
                      </div>
                    </article>
                  </Reveal>
                  <Reveal delay={0.06} direction="clip">
                    <article className="flex h-full flex-col border border-neutral-200 border-l-4 border-l-brand bg-white shadow-sm">
                      <div className="relative h-48 overflow-hidden sm:h-52">
                        <div className="service-detail-visual service-visual-4 absolute inset-0 scale-105 rounded-none" />
                      </div>
                      <div className="flex flex-1 flex-col p-6 sm:p-8">
                        <p className="text-[0.65rem] font-black uppercase tracking-[0.24em] text-brand sm:text-xs">
                          Our mission
                        </p>
                        <LeadParagraph lead="Our mission is" className="mt-5 sm:mt-6">
                          to deliver exceptional construction services through technical ability,
                          disciplined execution, and precise cost management. We are committed to providing
                          value-driven, high-quality, and prompt solutions that respond to the unique needs
                          of our clients, while building long-term partnerships founded on trust,
                          reliability, and consistent performance.
                        </LeadParagraph>
                      </div>
                    </article>
                  </Reveal>
                </div>
              </section>

              <section
                id="core-values"
                data-header-theme="light"
                className="scroll-mt-28 py-16 sm:scroll-mt-32 sm:py-20 lg:py-24"
              >
                <Reveal direction="rotate">
                  <p className="text-[0.65rem] font-black uppercase tracking-[0.28em] text-neutral-500 sm:text-xs">
                    Core values
                  </p>
                  <AboutBlockTitle className="mt-3 sm:mt-4">
                    <h2 className="max-w-3xl text-2xl font-black tracking-tight text-neutral-950 text-pretty sm:text-3xl md:text-[clamp(1.75rem,2.8vw,2.35rem)] md:leading-[1.12]">
                      Values that keep projects transparent and focused.
                    </h2>
                  </AboutBlockTitle>
                </Reveal>

                <div className="mt-12 grid gap-6 sm:grid-cols-2 sm:gap-7 lg:mt-14 lg:grid-cols-3 lg:gap-8">
                  {values.map((value, index) => (
                    <Reveal key={value.title} delay={index * 0.05} direction="up">
                      <div className="group flex h-full flex-col border border-neutral-200 bg-white p-6 shadow-sm transition duration-300 hover:border-brand/35 hover:shadow-md sm:p-8">
                        <div className="mb-4 text-xs font-black tracking-widest text-brand sm:mb-5">
                          {String(index + 1).padStart(2, "0")}
                        </div>
                        <div className="flex gap-3">
                          <span className="mt-1 h-6 w-0.5 shrink-0 bg-brand" aria-hidden />
                          <div>
                            <h3 className="text-lg font-black tracking-tight text-neutral-950 sm:text-xl">
                              {value.title}
                            </h3>
                            <p className="mt-4 text-[0.9375rem] leading-[1.65] text-neutral-600 antialiased sm:text-base sm:leading-7 text-pretty">
                              {value.description}
                            </p>
                          </div>
                        </div>
                      </div>
                    </Reveal>
                  ))}
                </div>
              </section>
            </div>
        </div>
      </div>
    </Layout>
  );
}
