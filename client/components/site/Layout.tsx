import { Menu, X, ArrowRight, Facebook, Instagram, Linkedin } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import type { ReactNode } from "react";
import { company, navigation, services } from "@/data/site";
import { Logo } from "./Logo";
import { cn } from "@/lib/utils";

type LayoutProps = {
  children: ReactNode;
};

export function Layout({ children }: LayoutProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isHeroVisible, setIsHeroVisible] = useState(false);
  const [isHeaderOnDark, setIsHeaderOnDark] = useState(true);
  const location = useLocation();
  const isHome = location.pathname === "/";

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
  }, [isHome]);

  const showFullNav = isHeroVisible && !isMenuOpen;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="pointer-events-none fixed inset-x-0 top-0 z-50 bg-transparent">
        <div className="flex w-full items-center justify-between gap-8 px-5 py-4">
          <Logo
            className={cn(
              "pointer-events-auto translate-y-0 opacity-100 transition-all duration-500 ease-out",
            )}
            compact={!showFullNav}
            inverted={showFullNav || isHeaderOnDark}
          />

          <nav
            className={cn(
              "pointer-events-auto hidden flex-1 items-center justify-end gap-7 transition-all duration-300 lg:flex xl:gap-10 2xl:gap-12",
              showFullNav ? "opacity-100" : "pointer-events-none opacity-0",
            )}
            aria-hidden={!showFullNav}
          >
            {navigation.map((item) => (
              <NavLink
                key={item.href}
                to={item.href}
                className={({ isActive }) =>
                  cn(
                    "text-sm font-black uppercase tracking-[0.18em] text-white/90 transition hover:text-brand-light",
                    isActive && "text-brand-light",
                  )
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          <button
            type="button"
            className={cn(
              "pointer-events-auto inline-flex items-center gap-3 rounded-full text-sm font-black uppercase tracking-[0.22em] transition-all duration-300",
              showFullNav
                ? "border border-white/20 px-4 py-3 text-white lg:pointer-events-none lg:opacity-0"
                : cn(
                    "px-3 py-3 shadow-lg backdrop-blur-md",
                    isHeaderOnDark
                      ? "bg-black/20 text-white shadow-black/20"
                      : "bg-white/80 text-neutral-950 shadow-black/10",
                  ),
            )}
            onClick={() => setIsMenuOpen((open) => !open)}
            aria-label="Toggle navigation menu"
          >
            <span>Menu</span>
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              className="pointer-events-auto mx-4 rounded-[2rem] bg-white px-6 py-6 shadow-2xl ring-1 ring-black/10 sm:mx-5 md:mx-7 lg:ml-auto lg:mr-8 lg:max-w-sm xl:mr-10 2xl:mr-12"
              initial={{ opacity: 0, y: -18, scale: 0.96, filter: "blur(10px)" }}
              animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -18, scale: 0.96, filter: "blur(10px)" }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            >
              <Logo className="mb-8" />
              <nav className="flex flex-col gap-4">
                {navigation.map((item, index) => (
                  <motion.div
                    key={item.href}
                    initial={{ opacity: 0, x: 18 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.35, delay: index * 0.04 }}
                  >
                    <NavLink
                      to={item.href}
                      className="group flex items-center justify-between text-lg font-black text-neutral-900"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {item.label}
                      <ArrowRight className="h-4 w-4 text-brand opacity-0 transition group-hover:translate-x-1 group-hover:opacity-100" />
                    </NavLink>
                  </motion.div>
                ))}
                <a href={company.phoneHref} className="btn-brand mt-5">
                  Call {company.phone}
                </a>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <main>{children}</main>

      <footer data-header-theme="dark" className="relative overflow-hidden bg-black text-white">
        <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-brand/15 to-transparent" />
        <div className="absolute -right-24 top-20 h-72 w-72 rounded-full bg-brand/10 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-5 py-20 md:px-8 lg:py-28">
          <div className="grid gap-12 lg:grid-cols-[1.25fr_0.8fr] lg:items-start">
            <div>
              <Logo className="mb-12" inverted />

              <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
                <FooterColumn
                  title="Services & Sectors"
                  links={services.map((service) => ({ label: service.title, href: "/services" }))}
                />
                <FooterColumn
                  title="Company"
                  links={[
                    { label: "About Us", href: "/about" },
                    { label: "Projects", href: "/projects" },
                    { label: "Contact", href: "/contact" },
                  ]}
                />
                <FooterColumn
                  title="About Us"
                  links={[
                    { label: "Who We Are", href: "/about" },
                    { label: "What We Do", href: "/services" },
                    { label: "Vision And Values", href: "/about" },
                  ]}
                />
                <FooterColumn
                  title="Contact"
                  links={[
                    { label: company.location, href: "/contact" },
                    { label: company.phone, href: company.phoneHref },
                    { label: company.email, href: company.emailHref },
                  ]}
                />
              </div>

              <div className="mt-14 grid gap-8 border-t border-white/10 pt-10 md:grid-cols-[0.9fr_1.1fr] md:items-end">
                <div>
                  <h3 className="text-2xl font-black">Subscribe To Our Newsletter</h3>
                  <p className="mt-3 max-w-sm text-sm leading-6 text-neutral-500">
                    Get updates on construction insights, project controls, and T&W Quantus news.
                  </p>
                </div>
                <form className="flex items-center gap-4" onSubmit={(event) => event.preventDefault()}>
                  <label className="sr-only" htmlFor="newsletter-email">
                    Your email address
                  </label>
                  <input
                    id="newsletter-email"
                    type="email"
                    placeholder="Your e-mail address"
                    className="min-w-0 flex-1 border-0 border-b border-white/25 bg-transparent px-0 py-3 text-sm text-white outline-none transition placeholder:text-neutral-500 focus:border-brand-light"
                  />
                  <button
                    type="submit"
                    className="grid h-12 w-12 flex-none place-items-center rounded-full bg-brand text-white transition hover:scale-110 hover:bg-brand-light"
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
            </div>

            <div className="flex items-center gap-3">
              <span className="font-black text-white">Follow T&W</span>
              {[
                { label: "LinkedIn", Icon: Linkedin },
                { label: "Facebook", Icon: Facebook },
                { label: "Instagram", Icon: Instagram },
                { label: "X", Icon: XIcon },
              ].map(({ label, Icon }) => (
                <a
                  key={label}
                  href="/contact"
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

function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: Array<{ label: string; href: string }>;
}) {
  return (
    <div>
      <h3 className="footer-heading">{title}</h3>
      <ul className="mt-5 space-y-3 text-sm text-neutral-500">
        {links.map((link) => {
          const isExternalAction = link.href.startsWith("mailto:") || link.href.startsWith("tel:");
          const className = cn(
            "inline-flex transition hover:translate-x-1 hover:text-white",
            link.label.includes("@") && "whitespace-nowrap break-normal",
          );

          return (
            <li key={`${title}-${link.label}`}>
              {isExternalAction ? (
                <a href={link.href} className={className}>
                  {link.label}
                </a>
              ) : (
                <Link to={link.href} className={className}>
                  {link.label}
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
