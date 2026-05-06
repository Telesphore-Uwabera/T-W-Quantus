import {
  Menu,
  X,
  ArrowRight,
  Facebook,
  Instagram,
  Linkedin,
  Search,
  ChevronDown,
  MapPin,
  Mail,
  MessageCircle,
  Building2,
  Users,
  ChevronRight,
  Briefcase,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import type { ReactNode } from "react";
import { toast } from "sonner";
import { company, navigation, perspectives, services } from "@/data/site";
import { submitNewsletter } from "@/lib/api";
import { Logo } from "./Logo";
import { cn } from "@/lib/utils";

type LayoutProps = {
  children: ReactNode;
};

type SearchItem = {
  title: string;
  category: string;
  description: string;
  href: string;
};

const baseSearchItems: SearchItem[] = [
  {
    title: "Home",
    category: "Page",
    description: "Hero, company slogan, and T&W Quantus website overview.",
    href: "/",
  },
  {
    title: "About T&W Quantus",
    category: "Page",
    description: "Who we are, collaboration, vision, mission, and core values.",
    href: "/about",
  },
  {
    title: "Projects and Sectors",
    category: "Projects",
    description: "Residential, commercial, institutional, renovation, and technical work areas.",
    href: "/projects",
  },
  {
    title: "Perspectives and News",
    category: "News",
    description: "Latest construction insights, cost management updates, and project delivery articles.",
    href: "/perspectives",
  },
  {
    title: "Contact T&W Quantus",
    category: "Contact",
    description: `${company.email}, ${company.phone}, ${company.location}`,
    href: "/contact",
  },
  {
    title: "Residential Developments",
    category: "Project Area",
    description: "Residential project delivery and development support in Rwanda.",
    href: "/#projects",
  },
  {
    title: "Commercial Spaces",
    category: "Project Area",
    description: "Commercial construction planning, management, and technical services.",
    href: "/#projects",
  },
  {
    title: "Institutional Infrastructure",
    category: "Project Area",
    description: "Institutional infrastructure project controls and delivery support.",
    href: "/#projects",
  },
  {
    title: "Renovations and Technical Works",
    category: "Project Area",
    description: "Renovation, repair, and technical construction services.",
    href: "/#projects",
  },
];

export function Layout({ children }: LayoutProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [newsletterBusy, setNewsletterBusy] = useState(false);
  const [isHeroVisible, setIsHeroVisible] = useState(false);
  const [isHeaderOnDark, setIsHeaderOnDark] = useState(true);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [activeMobileDropdown, setActiveMobileDropdown] = useState<string | null>("About Us");
  const [footerInView, setFooterInView] = useState(false);
  /** Matches Tailwind `lg` — logo dismissal when leaving home hero applies only at this width and up. */
  const [isLgUp, setIsLgUp] = useState(false);
  const footerRef = useRef<HTMLElement>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const isHome = location.pathname === "/";

  useEffect(() => {
    const mql = window.matchMedia("(min-width: 1024px)");
    const sync = () => setIsLgUp(mql.matches);
    sync();
    mql.addEventListener("change", sync);
    return () => mql.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    const footer = footerRef.current;
    if (!footer) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setFooterInView(entry.isIntersecting);
      },
      { threshold: 0, rootMargin: "0px" },
    );

    observer.observe(footer);
    return () => observer.disconnect();
  }, [location.pathname]);

  useEffect(() => {
    if (!footerInView) return;
    setIsMenuOpen(false);
    setIsSearchOpen(false);
    setActiveDropdown(null);
  }, [footerInView]);

  useEffect(() => {
    const onScroll = () => {
      const heroSection = document.querySelector<HTMLElement>("[data-home-hero]");
      const heroRect = heroSection?.getBoundingClientRect();
      const nextHeroVisible = Boolean(
        isHome && heroRect && heroRect.top <= 80 && heroRect.bottom > 96,
      );

      setIsHeroVisible(nextHeroVisible);

      const sampleY = 84;
      const themedSection = Array.from(
        document.querySelectorAll<HTMLElement>("[data-header-theme]"),
      ).find((section) => {
        const rect = section.getBoundingClientRect();
        return rect.top <= sampleY && rect.bottom >= sampleY;
      });

      setIsHeaderOnDark(themedSection?.dataset.headerTheme === "dark");
    };

    requestAnimationFrame(onScroll);
    window.addEventListener("scroll", onScroll);
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [isHome, location.pathname]);

  /** Non–home (and home sm/md): solid bar — light section → black nav; dark section → white nav. */
  const solidBarMenuLabel = isHeaderOnDark
    ? "text-neutral-950 drop-shadow-none"
    : "text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.55)]";
  /** Home lg+: no bar — float over content (same contrast rules as pre–solid bar). */
  const homeLgMenuLabel = isHeaderOnDark
    ? "max-lg:text-neutral-950 max-lg:drop-shadow-none lg:text-white lg:drop-shadow-[0_2px_8px_rgba(0,0,0,0.55)]"
    : "max-lg:text-white max-lg:drop-shadow-[0_2px_8px_rgba(0,0,0,0.55)] lg:text-neutral-950 lg:drop-shadow-[0_2px_8px_rgba(255,255,255,0.75)]";
  const menuHamburgerLabel = isHome ? homeLgMenuLabel : solidBarMenuLabel;

  const solidNavLinkClass = isHeaderOnDark
    ? "text-neutral-950/90 transition hover:text-brand"
    : "text-white/90 transition hover:text-brand-light";
  const solidNavChromeClass = isHeaderOnDark
    ? "text-neutral-950/80 transition hover:bg-neutral-950/10 hover:text-brand"
    : "text-white/80 transition hover:bg-white/10 hover:text-brand-light";
  const homeNavLinkClass = isHeaderOnDark
    ? "max-lg:text-neutral-950/90 max-lg:transition max-lg:hover:text-brand lg:text-white/90 lg:transition lg:hover:text-brand-light"
    : "max-lg:text-white/90 max-lg:transition max-lg:hover:text-brand-light lg:text-neutral-950/90 lg:transition lg:hover:text-brand";
  const homeNavChromeClass = isHeaderOnDark
    ? "max-lg:text-neutral-950/80 max-lg:transition max-lg:hover:bg-neutral-950/10 max-lg:hover:text-brand lg:text-white/80 lg:transition lg:hover:bg-white/10 lg:hover:text-brand-light"
    : "max-lg:text-white/80 max-lg:transition max-lg:hover:bg-white/10 max-lg:hover:text-brand-light lg:text-neutral-950/80 lg:transition lg:hover:bg-neutral-950/10 lg:hover:text-brand";
  const navLinkClass = isHome ? homeNavLinkClass : solidNavLinkClass;
  const navChromeIconClass = isHome ? homeNavChromeClass : solidNavChromeClass;

  const showFullNav = (!isHome || isHeroVisible) && !isMenuOpen;
  const showCompactMenu = isHome && (!isHeroVisible || isMenuOpen);
  /** Home (lg+): logo only while hero is in view. Below lg, logo stays so sm/md always see it in the bar. */
  const showLogoInHeader = !isHome || isHeroVisible || !isLgUp;
  const activeNavigation = navigation.find((item) => item.label === activeDropdown);
  const activeDropdownLinks =
    activeNavigation && "children" in activeNavigation ? activeNavigation.children : undefined;
  const searchItems = [
    ...baseSearchItems,
    ...services.map((service) => ({
      title: service.title,
      category: "Service",
      description: service.summary,
      href: `/services/${service.slug}`,
    })),
    ...perspectives.map((item) => ({
      title: item.title,
      category: item.category,
      description: item.summary,
      href: `/perspectives/${item.slug}`,
    })),
  ];
  const normalizedSearch = searchQuery.trim().toLowerCase();
  const searchResults = (normalizedSearch
    ? searchItems.filter((item) =>
        `${item.title} ${item.category} ${item.description}`
          .toLowerCase()
          .includes(normalizedSearch),
      )
    : searchItems
  ).slice(0, 8);

  const navigateToSearchResult = (href: string) => {
    setIsSearchOpen(false);
    setSearchQuery("");
    setIsMenuOpen(false);
    navigate(href);

    const [, hash] = href.split("#");
    if (hash) {
      window.setTimeout(() => {
        document.getElementById(hash)?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 80);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header
        className={cn(
          "pointer-events-none fixed inset-x-0 top-0 z-50 transition-all duration-300 ease-out",
          "bg-transparent",
          footerInView && "-translate-y-full opacity-0",
        )}
      >
        <div
          className={cn(
            "pointer-events-auto transition-all duration-500 ease-out",
            "border-0 shadow-none ring-0 outline-none backdrop-blur-none",
            isHeaderOnDark ? "bg-white" : "bg-black",
            // Home desktop: transparent strip so MENU floats like before (sm/md keep solid bar)
            isHome && "lg:bg-transparent lg:border-transparent lg:shadow-none",
          )}
          onMouseLeave={() => setActiveDropdown(null)}
        >
          <div
            className={cn(
              "mx-auto flex w-full max-w-[112rem] items-center justify-between gap-4 px-4 py-3 sm:px-5 lg:justify-center lg:flex-nowrap lg:gap-0 lg:px-8 lg:py-4 xl:px-12",
              "max-lg:pt-[max(0.75rem,env(safe-area-inset-top))] max-lg:pb-3",
            )}
          >
            <div className="flex min-w-0 flex-1 items-center justify-start lg:max-w-full lg:flex-initial lg:justify-center">
              {showLogoInHeader ? (
                <div className="shrink-0">
                  <Logo
                    className={cn(
                      "shrink-0",
                      "transition-all duration-700 ease-out",
                      showFullNav || showCompactMenu
                        ? "pointer-events-auto translate-y-0 scale-100 opacity-100 blur-0"
                        : "pointer-events-none -translate-y-8 scale-95 opacity-0 blur-sm",
                    )}
                    compact
                    showSlogan={false}
                    inverted={
                      showFullNav &&
                      (isHome && isLgUp ? isHeaderOnDark : !isHeaderOnDark)
                    }
                  />
                </div>
              ) : null}
              {/* ~one nav link of horizontal rhythm between logo and links */}
              <span
                className="hidden shrink-0 lg:block lg:w-[clamp(3.25rem,6.5vw,6rem)] xl:w-[clamp(3.75rem,6.5vw,7rem)] 2xl:w-32"
                aria-hidden="true"
              />
              <nav
                className={cn(
                  "pointer-events-auto hidden min-w-0 items-center justify-center gap-4 transition-all duration-700 ease-out lg:flex xl:gap-5 2xl:gap-7",
                  showFullNav
                    ? "translate-y-0 opacity-100 blur-0"
                    : "pointer-events-none -translate-y-8 opacity-0 blur-sm",
                )}
                aria-hidden={!showFullNav}
              >
              {navigation.map((item) => {
                const hasDropdown = "children" in item && Boolean(item.children?.length);

                return (
                  <div
                    key={item.href}
                    className="relative inline-flex items-center gap-1.5"
                  >
                    <NavLink
                      to={item.href}
                      className={({ isActive }) =>
                        cn(
                          "inline-flex text-sm font-black uppercase tracking-[0.16em] whitespace-nowrap lg:text-[11px] lg:tracking-[0.12em] xl:text-xs 2xl:text-sm 2xl:tracking-[0.16em]",
                          navLinkClass,
                          isActive &&
                            (isHome
                              ? isHeaderOnDark
                                ? "max-lg:text-brand lg:text-brand-light"
                                : "max-lg:text-brand-light lg:text-brand"
                              : isHeaderOnDark
                                ? "text-brand"
                                : "text-brand-light"),
                        )
                      }
                      onClick={() => setActiveDropdown(null)}
                    >
                      {item.label}
                    </NavLink>
                    {hasDropdown && (
                      <button
                        type="button"
                        className={cn(
                          "grid h-5 w-5 place-items-center rounded-full",
                          navChromeIconClass,
                          activeDropdown === item.label &&
                            (isHome
                              ? isHeaderOnDark
                                ? "max-lg:text-brand lg:text-brand-light"
                                : "max-lg:text-brand-light lg:text-brand"
                              : isHeaderOnDark
                                ? "text-brand"
                                : "text-brand-light"),
                          activeDropdown === item.label && "rotate-180",
                        )}
                        aria-label={`Open ${item.label} dropdown`}
                        aria-expanded={activeDropdown === item.label}
                        onClick={(event) => {
                          event.preventDefault();
                          setActiveDropdown((current) =>
                            current === item.label ? null : item.label,
                          );
                        }}
                      >
                        <ChevronDown className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>
                );
              })}
              <button
                type="button"
                className={cn(
                  "inline-flex items-center gap-2 whitespace-nowrap text-[11px] font-black uppercase tracking-[0.12em] xl:text-xs 2xl:text-sm 2xl:tracking-[0.16em]",
                  navLinkClass,
                )}
                aria-label="Search"
                onMouseEnter={() => setActiveDropdown(null)}
                onClick={() => setIsSearchOpen(true)}
              >
                <Search className="h-5 w-5" />
                <span>Search</span>
              </button>
              </nav>
            </div>

            <button
              type="button"
              className={cn(
                "pointer-events-auto inline-flex shrink-0 items-center gap-2 rounded-full px-3 py-2.5 text-xs font-black uppercase tracking-[0.18em] transition-all duration-500 ease-out sm:gap-3 sm:px-4 sm:py-3 sm:text-sm",
                // Below lg: hide while drawer is open so it cannot stack above the overlay (was z-9999 vs panel z-90).
                isMenuOpen && "max-lg:hidden",
                "relative z-10 max-lg:right-auto max-lg:top-auto",
                "lg:fixed lg:right-5 lg:top-5 lg:z-[9999]",
                !showCompactMenu
                  ? cn(
                      "translate-y-0 scale-100 opacity-100 max-lg:pointer-events-auto max-lg:opacity-100",
                      "lg:pointer-events-none lg:-translate-y-4 lg:scale-95 lg:opacity-0",
                      menuHamburgerLabel,
                    )
                  : cn("translate-y-0 scale-100 opacity-100", menuHamburgerLabel),
              )}
              onClick={() => setIsMenuOpen((open) => !open)}
              aria-label="Toggle navigation menu"
            >
              <span>Menu</span>
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

          <AnimatePresence>
            {showFullNav && activeDropdownLinks && activeDropdownLinks.length > 0 && (
              <motion.div
                className={cn(
                  "pointer-events-auto hidden border-y px-5 py-5 shadow-2xl backdrop-blur-xl lg:block",
                  isHeaderOnDark
                    ? "border-black/10 bg-white/95 text-neutral-950"
                    : "border-white/10 bg-black/90 text-white",
                )}
                initial={{ opacity: 0, y: -24, scaleY: 0.86, filter: "blur(14px)" }}
                animate={{ opacity: 1, y: 0, scaleY: 1, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: -18, scaleY: 0.92, filter: "blur(10px)" }}
                transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
                style={{ transformOrigin: "top" }}
              >
                <div className="mx-auto flex max-w-7xl items-center justify-center gap-10 text-sm font-bold">
                  {activeDropdownLinks.map((child, index) => {
                    const itemMotion = {
                      initial: { opacity: 0, y: -22, filter: "blur(8px)" },
                      animate: { opacity: 1, y: 0, filter: "blur(0px)" },
                      transition: {
                        duration: 0.48,
                        delay: 0.08 + index * 0.055,
                        ease: "easeOut" as const,
                      },
                    };

                    return child.href.startsWith("mailto:") || child.href.startsWith("tel:") ? (
                      <motion.div key={child.href} {...itemMotion}>
                      <a
                        href={child.href}
                        className={cn(
                          "transition hover:-translate-y-0.5",
                          isHeaderOnDark ? "hover:text-brand" : "hover:text-brand-light",
                        )}
                        onClick={() => setActiveDropdown(null)}
                      >
                        {child.label}
                      </a>
                      </motion.div>
                    ) : (
                      <motion.div key={child.href} {...itemMotion}>
                      <Link
                        to={child.href}
                        className={cn(
                          "transition hover:-translate-y-0.5",
                          isHeaderOnDark ? "hover:text-brand" : "hover:text-brand-light",
                        )}
                        onClick={() => setActiveDropdown(null)}
                      >
                        {child.label}
                      </Link>
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              className="pointer-events-auto fixed inset-0 z-[200] overflow-y-auto bg-white px-4 py-5 text-neutral-950 shadow-2xl sm:px-8 lg:static lg:z-auto lg:inset-auto lg:mx-4 lg:ml-auto lg:mr-8 lg:max-h-[calc(100vh-6rem)] lg:max-w-sm lg:rounded-[2rem] lg:px-6 lg:ring-1 lg:ring-black/10 xl:mr-10 2xl:mr-12"
              initial={{ opacity: 0, y: -28, scale: 0.98, filter: "blur(12px)" }}
              animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -24, scale: 0.98, filter: "blur(12px)" }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="mb-6 flex min-w-0 items-center justify-between gap-2 border-b border-black/10 pb-4 sm:gap-4 sm:pb-5">
                <div className="min-w-0 flex-1 pr-2">
                  <Logo className="max-w-full" compact showSlogan={false} />
                </div>
                <div className="flex shrink-0 items-center gap-1.5 sm:gap-3">
                  <button
                    type="button"
                    className="grid h-10 w-10 flex-none place-items-center rounded-full bg-neutral-100 text-neutral-950 transition hover:bg-brand hover:text-white sm:h-11 sm:w-11"
                    aria-label="Search website"
                    onClick={() => {
                      setIsMenuOpen(false);
                      setIsSearchOpen(true);
                    }}
                  >
                    <Search className="h-5 w-5" />
                  </button>
                  <span className="hidden h-8 w-px shrink-0 bg-neutral-200 sm:block" />
                  <span className="hidden shrink-0 text-sm font-black uppercase tracking-[0.18em] md:inline">EN</span>
                  <button
                    type="button"
                    className="grid h-10 w-10 flex-none place-items-center rounded-full text-brand transition hover:bg-brand hover:text-white sm:h-11 sm:w-11"
                    onClick={() => setIsMenuOpen(false)}
                    aria-label="Close navigation menu"
                  >
                    <X className="h-6 w-6 sm:h-7 sm:w-7" />
                  </button>
                </div>
              </div>

              <button
                type="button"
                className="mb-5 flex w-full items-center gap-4 border-b border-black/10 pb-5 text-left text-neutral-400 transition hover:text-brand"
                onClick={() => {
                  setIsMenuOpen(false);
                  setIsSearchOpen(true);
                }}
              >
                <Search className="h-7 w-7 flex-none text-neutral-950" />
                <span className="text-xl font-semibold">Type to search</span>
              </button>

              <nav className="flex flex-col">
                {navigation.map((item, index) => {
                  const children = "children" in item ? item.children : undefined;
                  const isExpanded = activeMobileDropdown === item.label;

                  return (
                  <motion.div
                    key={item.href}
                    className="border-b border-black/10 py-4"
                    initial={{ opacity: 0, x: 18 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.35, delay: index * 0.04 }}
                  >
                    <div className="flex items-center justify-between gap-4">
                    <NavLink
                      to={item.href}
                      className="text-lg font-black text-neutral-950 transition hover:text-brand"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {item.label}
                    </NavLink>
                    {children && (
                      <button
                        type="button"
                        className={cn(
                          "grid h-9 w-9 place-items-center rounded-full text-brand transition hover:bg-brand/10",
                          isExpanded && "rotate-180",
                        )}
                        aria-label={`Toggle ${item.label} links`}
                        aria-expanded={isExpanded}
                        onClick={() =>
                          setActiveMobileDropdown((current) =>
                            current === item.label ? null : item.label,
                          )
                        }
                      >
                        <ChevronDown className="h-5 w-5" />
                      </button>
                    )}
                    </div>
                    {children && (
                      <AnimatePresence initial={false}>
                        {isExpanded && (
                          <motion.div
                            className="mt-5 grid gap-4 pl-0 sm:pl-4"
                            initial={{ opacity: 0, height: 0, y: -8 }}
                            animate={{ opacity: 1, height: "auto", y: 0 }}
                            exit={{ opacity: 0, height: 0, y: -8 }}
                            transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
                          >
                            {children.map((child, childIndex) =>
                              child.href.startsWith("mailto:") || child.href.startsWith("tel:") ? (
                                <motion.a
                                  key={child.href}
                                  href={child.href}
                                  className="text-base font-semibold text-neutral-900 transition hover:text-brand"
                                  initial={{ opacity: 0, y: -8 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{ delay: childIndex * 0.04 }}
                                >
                                  {child.label}
                                </motion.a>
                              ) : (
                                <motion.div
                                  key={child.href}
                                  initial={{ opacity: 0, y: -8 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{ delay: childIndex * 0.04 }}
                                >
                                  <Link
                                    to={child.href}
                                    className="text-base font-semibold text-neutral-900 transition hover:text-brand"
                                    onClick={() => setIsMenuOpen(false)}
                                  >
                                    {child.label}
                                  </Link>
                                </motion.div>
                              ),
                            )}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    )}
                  </motion.div>
                  );
                })}
                <a href={company.phoneHref} className="btn-brand mt-5">
                  Call {company.phone}
                </a>
                <button
                  type="button"
                  className="mt-2 inline-flex items-center justify-center gap-2 rounded-full border border-brand/25 px-5 py-3 text-sm font-black text-brand transition hover:bg-brand hover:text-white"
                  onClick={() => {
                    setIsMenuOpen(false);
                    setIsSearchOpen(true);
                  }}
                >
                  Search Website <Search className="h-4 w-4" />
                </button>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {isSearchOpen && (
            <motion.div
              className="pointer-events-auto fixed inset-0 z-[80] bg-black/70 p-5 backdrop-blur-xl md:p-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
            >
              <motion.div
                className="mx-auto mt-16 max-w-4xl rounded-[2rem] bg-white p-6 shadow-2xl md:p-8"
                initial={{ opacity: 0, y: 24, scale: 0.96, filter: "blur(12px)" }}
                animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: 24, scale: 0.96, filter: "blur(12px)" }}
                transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              >
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="eyebrow">Search T&W Quantus</p>
                    <h2 className="mt-2 text-3xl font-black text-neutral-950 md:text-5xl">
                      Find any page, service, project, or news.
                    </h2>
                  </div>
                  <button
                    type="button"
                    className="grid h-12 w-12 flex-none place-items-center rounded-full bg-neutral-100 text-neutral-950 transition hover:bg-brand hover:text-white"
                    onClick={() => setIsSearchOpen(false)}
                    aria-label="Close search"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <form
                  className="mt-8 flex items-center gap-3 border-b-2 border-neutral-200 pb-4 focus-within:border-brand"
                  onSubmit={(event) => {
                    event.preventDefault();
                    if (searchResults[0]) {
                      navigateToSearchResult(searchResults[0].href);
                    }
                  }}
                >
                  <Search className="h-6 w-6 flex-none text-brand" />
                  <input
                    autoFocus
                    value={searchQuery}
                    onChange={(event) => setSearchQuery(event.target.value)}
                    placeholder="Search quantity surveying, projects, contact, news..."
                    className="min-w-0 flex-1 bg-transparent text-xl font-bold text-neutral-950 outline-none placeholder:text-neutral-400 md:text-2xl"
                  />
                </form>

                <div className="mt-6 grid max-h-[45vh] gap-3 overflow-y-auto pr-1">
                  {searchResults.length > 0 ? (
                    searchResults.map((item) => (
                      <button
                        key={`${item.href}-${item.title}`}
                        type="button"
                        className="group rounded-2xl border border-black/10 p-5 text-left transition hover:border-brand/40 hover:bg-brand/5"
                        onClick={() => navigateToSearchResult(item.href)}
                      >
                        <div className="flex items-center justify-between gap-4">
                          <span className="text-xs font-black uppercase tracking-[0.2em] text-brand">
                            {item.category}
                          </span>
                          <ArrowRight className="h-4 w-4 text-brand opacity-0 transition group-hover:translate-x-1 group-hover:opacity-100" />
                        </div>
                        <h3 className="mt-2 text-xl font-black text-neutral-950">{item.title}</h3>
                        <p className="mt-2 text-sm leading-6 text-neutral-600">{item.description}</p>
                      </button>
                    ))
                  ) : (
                    <div className="rounded-2xl bg-neutral-100 p-6 text-neutral-600">
                      No result found. Try searching for “cost”, “project”, “contact”, or “construction”.
                    </div>
                  )}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <main>{children}</main>

      <footer
        ref={footerRef}
        id="site-footer"
        data-header-theme="dark"
        className="relative overflow-hidden bg-black text-white"
      >
        <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-brand/15 to-transparent" />
        <div className="absolute -right-24 top-20 h-72 w-72 rounded-full bg-brand/10 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-5 py-20 md:px-8 lg:py-28">
          <div className="grid gap-12 lg:grid-cols-[1.25fr_0.8fr] lg:items-start">
            <div>
              <Logo className="mb-12 max-w-full" inverted stackOnSmall />

              <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
                <FooterColumn
                  title="Services & Sectors"
                  titleIcon={Building2}
                  links={services.map((service) => ({
                    label: service.title,
                    href: `/services/${service.slug}`,
                    Icon: ChevronRight,
                  }))}
                />
                <FooterColumn
                  title="Company"
                  titleIcon={Briefcase}
                  links={[
                    { label: "About Us", href: "/about", Icon: ChevronRight },
                    { label: "Projects", href: "/projects", Icon: ChevronRight },
                    { label: "Contact", href: "/contact", Icon: ChevronRight },
                  ]}
                />
                <FooterColumn
                  title="About Us"
                  titleIcon={Users}
                  links={[
                    { label: "Who We Are", href: "/about#who-we-are", Icon: ChevronRight },
                    { label: "Collaborate With Us", href: "/about#collaborate", Icon: ChevronRight },
                    { label: "What We Do", href: "/services#services-overview", Icon: ChevronRight },
                    { label: "Vision And Mission", href: "/about#vision-mission", Icon: ChevronRight },
                  ]}
                />
                <FooterContactBlock />
              </div>

              <div className="mt-14 grid gap-8 border-t border-white/10 pt-10 md:grid-cols-[0.9fr_1.1fr] md:items-end">
                <div>
                  <h3 className="text-2xl font-black">Subscribe To Our Newsletter</h3>
                  <p className="mt-3 max-w-sm text-sm leading-6 text-neutral-500">
                    Get updates on construction insights, project controls, and T&W Quantus news.
                  </p>
                </div>
                <form
                  className="flex items-center gap-4"
                  onSubmit={async (event) => {
                    event.preventDefault();
                    const el = event.currentTarget.elements.namedItem("newsletter-email") as HTMLInputElement | null;
                    const email = el?.value?.trim();
                    if (!email) return;
                    setNewsletterBusy(true);
                    try {
                      const r = await submitNewsletter(email);
                      toast.success(r.duplicate ? "You are already subscribed." : "Thanks for subscribing!");
                      if (el) el.value = "";
                    } catch (err) {
                      toast.error(err instanceof Error ? err.message : "Could not subscribe.");
                    } finally {
                      setNewsletterBusy(false);
                    }
                  }}
                >
                  <label className="sr-only" htmlFor="newsletter-email">
                    Your email address
                  </label>
                  <input
                    id="newsletter-email"
                    name="newsletter-email"
                    type="email"
                    placeholder="Your e-mail address"
                    className="min-w-0 flex-1 border-0 border-b border-white/25 bg-transparent px-0 py-3 text-sm text-white outline-none transition placeholder:text-neutral-500 focus:border-brand-light"
                  />
                  <button
                    type="submit"
                    disabled={newsletterBusy}
                    className="grid h-12 w-12 flex-none place-items-center rounded-full bg-brand text-white transition hover:scale-110 hover:bg-brand-light disabled:opacity-60"
                    aria-label="Subscribe"
                  >
                    <ArrowRight className="h-5 w-5" />
                  </button>
                </form>
              </div>
            </div>

            <div className="lg:pl-10">
              <h2 className="max-w-sm text-5xl font-black leading-none tracking-tight md:text-6xl">
                Your Project <br />
                at T&W
              </h2>
              <Link
                to="/contact"
                className="mt-10 grid h-44 w-44 place-items-center rounded-full bg-brand p-8 text-center text-xs font-black uppercase tracking-[0.12em] text-white transition hover:scale-105 hover:bg-brand-light md:h-52 md:w-52"
              >
                Start a project <ArrowRight className="mt-3 h-5 w-5" />
              </Link>
            </div>
          </div>

          <div className="mt-20 flex flex-col gap-8 border-t border-white/10 pt-8 text-xs text-neutral-500 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
              <span>© {new Date().getFullYear()} {company.name}. All rights reserved.</span>
              <Link to="/contact" className="transition hover:text-white">
                Legal Notice
              </Link>
              <Link to="/contact" className="transition hover:text-white">
                Privacy Policy
              </Link>
              <a
                href="https://uwaberatelesphore.netlify.app/"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-brand/50 px-4 py-2 font-black text-white transition hover:-translate-y-0.5 hover:border-brand-light hover:bg-brand/20"
              >
                Feel Free to Contact Developer
                <ArrowRight className="h-3.5 w-3.5" />
              </a>
            </div>

            <div className="flex items-center gap-3">
              <span className="font-black text-white">Follow T&W</span>
              {(
                [
                  { label: "LinkedIn", Icon: Linkedin, href: company.social.linkedin },
                  { label: "Facebook", Icon: Facebook, href: company.social.facebook },
                  { label: "Instagram", Icon: Instagram, href: company.social.instagram },
                  { label: "X", Icon: XIcon, href: company.social.x },
                ] as const
              ).map(({ label, Icon, href }) => (
                <a
                  key={label}
                  href={href.trim() ? href : "/contact#request-consultation"}
                  target={href.trim() ? "_blank" : undefined}
                  rel={href.trim() ? "noopener noreferrer" : undefined}
                  className="grid h-10 w-10 place-items-center rounded-full bg-white text-xs font-black text-black transition hover:-translate-y-1 hover:bg-brand hover:text-white"
                  aria-label={`Follow T&W Quantus on ${label}`}
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

function isExternalOrSpecialHref(href: string) {
  return (
    href.startsWith("http://") ||
    href.startsWith("https://") ||
    href.startsWith("mailto:") ||
    href.startsWith("tel:")
  );
}

function FooterContactBlock() {
  const mapsHref = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(company.registeredAddress)}`;

  return (
    <div>
      <h3 className="footer-heading">Contact</h3>
      <ul className="mt-5 space-y-4 text-sm text-neutral-500">
        <li>
          <a
            href={mapsHref}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-start gap-3 transition hover:translate-x-1 hover:text-white"
          >
            <MapPin
              className="mt-0.5 h-4 w-4 shrink-0 text-brand-light transition group-hover:text-white"
              aria-hidden
            />
            <span>{company.location}</span>
          </a>
        </li>
        <li>
          <a
            href={company.whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-3 transition hover:translate-x-1 hover:text-white"
          >
            <MessageCircle
              className="h-4 w-4 shrink-0 text-brand-light transition group-hover:text-white"
              aria-hidden
            />
            <span>
              {company.phone}
              <span className="sr-only"> — WhatsApp</span>
            </span>
          </a>
        </li>
        <li>
          <a
            href={company.emailHref}
            className="group inline-flex items-start gap-3 transition hover:translate-x-1 hover:text-white"
          >
            <Mail
              className="mt-0.5 h-4 w-4 shrink-0 text-brand-light transition group-hover:text-white"
              aria-hidden
            />
            <span className="break-all">{company.email}</span>
          </a>
        </li>
      </ul>
    </div>
  );
}

function FooterColumn({
  title,
  titleIcon: TitleIcon,
  links,
}: {
  title: string;
  titleIcon?: LucideIcon;
  links: Array<{ label: string; href: string; Icon?: LucideIcon }>;
}) {
  return (
    <div>
      <h3 className="footer-heading inline-flex items-center gap-2">
        {TitleIcon ? <TitleIcon className="h-4 w-4 shrink-0 text-brand-light" aria-hidden /> : null}
        {title}
      </h3>
      <ul className="mt-5 space-y-3 text-sm text-neutral-500">
        {links.map((link) => {
          const className = cn(
            "group inline-flex items-start gap-3 transition hover:translate-x-1 hover:text-white",
            link.label.includes("@") && "break-normal",
          );
          const Icon = link.Icon;
          const iconClass =
            "mt-0.5 h-4 w-4 shrink-0 text-brand-light transition group-hover:text-white";

          return (
            <li key={`${title}-${link.label}-${link.href}`}>
              {isExternalOrSpecialHref(link.href) ? (
                <a
                  href={link.href}
                  className={className}
                  target={link.href.startsWith("http") ? "_blank" : undefined}
                  rel={link.href.startsWith("http") ? "noopener noreferrer" : undefined}
                >
                  {Icon ? <Icon className={iconClass} aria-hidden /> : null}
                  <span>{link.label}</span>
                </a>
              ) : (
                <Link to={link.href} className={className}>
                  {Icon ? <Icon className={iconClass} aria-hidden /> : null}
                  <span>{link.label}</span>
                </Link>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function XIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={className}
      fill="currentColor"
    >
      <path d="M13.78 10.47 21.03 2h-1.72l-6.3 7.35L7.98 2H2.18l7.6 11.1L2.18 22h1.72l6.64-7.76L15.84 22h5.8l-7.86-11.53Zm-2.35 2.74-.77-1.1L4.54 3.3h2.61l4.95 7.12.77 1.1 6.44 9.27H16.7l-5.27-7.58Z" />
    </svg>
  );
}
