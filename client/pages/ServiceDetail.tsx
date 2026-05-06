import { ArrowLeft, ArrowRight, CheckCircle2 } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { Layout } from "@/components/site/Layout";
import { Reveal } from "@/components/site/Reveal";
import { company, services } from "@/data/site";

const serviceBackdrops = [
  "service-visual-1",
  "service-visual-2",
  "service-visual-3",
  "service-visual-4",
];

export default function ServiceDetail() {
  const { slug } = useParams();
  const serviceIndex = services.findIndex((item) => item.slug === slug);
  const service = services[serviceIndex];
  const visual = serviceBackdrops[serviceIndex] ?? "service-visual-1";
  const variant = serviceIndex % 4;
  const isTimeline = variant === 0;
  const isMosaic = variant === 1;
  const isDarkCards = variant === 2;
  const isSplit = variant === 3;

  if (!service) {
    return (
      <Layout>
        <section data-header-theme="dark" className="section-padding bg-neutral-950 pt-40 text-white">
          <div className="mx-auto max-w-4xl">
            <p className="eyebrow text-brand-light">Service not found</p>
            <h1 className="mt-5 text-5xl font-black">This service page is not available.</h1>
            <Link to="/services" className="btn-brand mt-8">
              Back to services <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </section>
      </Layout>
    );
  }

  return (
    <Layout>
      <section data-header-theme="dark" className="relative overflow-hidden bg-neutral-950 pt-28 text-white">
        <div className={`service-detail-visual ${visual} absolute inset-0`} />
        <div className="absolute inset-0 bg-gradient-to-r from-black/88 via-black/62 to-black/28" />
        <div
          className={
            isMosaic
              ? "relative mx-auto grid min-h-[68vh] max-w-7xl items-center gap-8 px-4 pb-14 pt-32 sm:px-6 md:px-12 lg:min-h-[72vh] lg:grid-cols-[0.9fr_1.1fr] lg:gap-12 lg:px-16"
              : "relative mx-auto grid min-h-[68vh] max-w-7xl items-end gap-8 px-4 pb-14 pt-32 sm:px-6 md:px-12 lg:min-h-[72vh] lg:grid-cols-[0.18fr_1fr] lg:gap-12 lg:px-16"
          }
        >
          <div className="hidden self-center lg:block">
            <div className="origin-center rotate-180 [writing-mode:vertical-rl] text-xs font-black uppercase tracking-[0.28em] text-white/45">
              Services & Sectors
            </div>
          </div>

          <Reveal direction="scale">
            <Link
              to="/services"
              className="inline-flex items-center gap-3 text-xs font-black uppercase tracking-[0.2em] text-white/75 transition hover:text-brand-light"
            >
              <ArrowLeft className="h-4 w-4 text-brand-light" />
              Back to Services
            </Link>
            <p className="mt-8 text-xs font-black uppercase tracking-[0.24em] text-brand-light sm:mt-12 sm:tracking-[0.34em]">
              {company.shortName} / {service.number}
            </p>
            <h1 className="mt-5 max-w-5xl text-[clamp(2.35rem,6vw,4.75rem)] font-black leading-[1.02] tracking-tight sm:mt-6 md:leading-[0.95]">
              {service.title}
            </h1>
            <p className="mt-6 max-w-3xl text-base leading-7 text-neutral-200 sm:mt-7 md:text-xl md:leading-8">
              {service.pageIntro}
            </p>
          </Reveal>
          {isMosaic && (
            <Reveal direction="right" delay={0.12}>
              <div className="hidden rounded-[2rem] border border-white/10 bg-white/10 p-6 shadow-2xl backdrop-blur-xl lg:block">
                <div className={`service-detail-visual ${visual} h-80 rounded-[1.5rem]`} />
              </div>
            </Reveal>
          )}
        </div>
      </section>

      <section
        data-header-theme={isDarkCards ? "dark" : "light"}
        className={isDarkCards ? "section-padding bg-neutral-950 text-white" : "section-padding bg-white"}
      >
        <div
          className={
            isSplit
              ? "mx-auto grid max-w-7xl gap-6 lg:grid-cols-2 lg:gap-10"
              : isMosaic
                ? "mx-auto max-w-7xl"
                : "mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.72fr_1.28fr] lg:gap-12"
          }
        >
          <Reveal direction={isSplit ? "left" : "up"}>
            <div className="sticky top-32">
              <p className={isDarkCards ? "eyebrow text-brand-light" : "eyebrow"}>Service Focus</p>
              <h2
                className={
                  isDarkCards
                    ? "mt-4 text-[clamp(1.625rem,3.9vw,3.25rem)] font-black leading-[1.06] tracking-tight text-white"
                    : "mt-4 text-[clamp(1.625rem,3.9vw,3.25rem)] font-black leading-[1.06] tracking-tight text-neutral-950"
                }
              >
                {service.pageTitle}
              </h2>
              <p className={isDarkCards ? "mt-5 text-base leading-7 text-neutral-300 sm:mt-6 sm:text-lg sm:leading-8" : "mt-5 text-base leading-7 text-neutral-600 sm:mt-6 sm:text-lg sm:leading-8"}>{service.summary}</p>
              <Link to="/contact" className="btn-brand mt-8">
                Request this service <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </div>
          </Reveal>

          <div
            className={
              isMosaic
                ? "mt-8 grid gap-4 md:mt-12 md:grid-cols-2 md:gap-5"
                : isSplit
                  ? "grid gap-4 md:gap-5"
                  : "space-y-4 md:space-y-5"
            }
          >
            {service.detailGroups.map((group, index) => (
              <Reveal
                key={group.title}
                delay={index * 0.06}
                direction={isTimeline ? (index % 2 === 0 ? "left" : "right") : isMosaic ? "scale" : "up"}
              >
                <article
                  className={
                    isDarkCards
                      ? "grid gap-5 rounded-[1.5rem] border border-white/10 bg-white/[0.06] p-5 backdrop-blur transition hover:-translate-y-1 hover:border-brand-light/50 md:grid-cols-[0.42fr_1fr] md:gap-6 md:rounded-[2rem] md:p-8"
                      : isMosaic
                        ? "h-full rounded-[1.5rem] border border-black/10 bg-neutral-50 p-5 transition hover:-translate-y-1 hover:border-brand/40 hover:bg-white hover:shadow-xl md:rounded-[2rem] md:p-7"
                        : isSplit
                          ? "rounded-[1.5rem] border border-black/10 bg-white p-5 shadow-sm transition hover:-translate-x-1 hover:border-brand/40 hover:shadow-xl md:rounded-[2rem] md:p-7"
                          : "grid gap-5 rounded-[1.5rem] border border-black/10 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-brand/40 hover:shadow-xl md:grid-cols-[0.42fr_1fr] md:gap-6 md:rounded-[2rem] md:p-8"
                  }
                >
                  <div>
                    <div className={isDarkCards ? "text-sm font-black text-brand-light" : "text-sm font-black text-brand"}>
                      {service.number}.{String(index + 1).padStart(2, "0")}
                    </div>
                    <h3 className={isDarkCards ? "mt-4 text-xl font-black text-white sm:mt-5 sm:text-2xl" : "mt-4 text-xl font-black text-neutral-950 sm:mt-5 sm:text-2xl"}>{group.title}</h3>
                  </div>
                  <ul className={isMosaic ? "mt-6 grid gap-3" : "grid gap-3"}>
                    {group.items.map((item) => (
                      <li
                        key={item}
                        className={
                          isDarkCards
                            ? "flex gap-3 rounded-2xl bg-black/25 p-3 sm:p-4"
                            : "flex gap-3 rounded-2xl bg-neutral-100 p-3 sm:p-4"
                        }
                      >
                        <CheckCircle2 className="mt-1 h-4 w-4 flex-none text-brand sm:h-5 sm:w-5" />
                        <span className={isDarkCards ? "font-semibold leading-7 text-neutral-300" : "font-semibold leading-7 text-neutral-700"}>{item}</span>
                      </li>
                    ))}
                  </ul>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section data-header-theme="dark" className="relative overflow-hidden bg-neutral-950 px-4 py-16 text-white sm:px-6 md:px-12 md:py-20 lg:px-16">
        <div className={`service-detail-visual ${visual} absolute inset-0 opacity-30`} />
        <div className="absolute inset-0 bg-black/72" />
        <Reveal className="relative mx-auto flex max-w-7xl flex-col justify-between gap-8 md:flex-row md:items-center">
          <div>
            <p className="eyebrow text-brand-light">Next step</p>
            <h2 className="mt-4 max-w-4xl text-[clamp(1.625rem,3.9vw,3.25rem)] font-black leading-[1.06] tracking-tight">
              Let us align scope, cost, timeline, and delivery controls for your project.
            </h2>
          </div>
          <Link to="/contact" className="btn-brand shrink-0">
            Start a conversation <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </Reveal>
      </section>
    </Layout>
  );
}
