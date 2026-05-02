import { ArrowLeft, ArrowRight, CalendarDays } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { Layout } from "@/components/site/Layout";
import { Reveal } from "@/components/site/Reveal";
import { perspectives } from "@/data/site";

export default function PerspectiveDetail() {
  const { slug } = useParams();
  const index = perspectives.findIndex((item) => item.slug === slug);
  const perspective = perspectives[index];

  if (!perspective) {
    return (
      <Layout>
        <section data-header-theme="dark" className="section-padding bg-neutral-950 pt-40 text-white">
          <div className="mx-auto max-w-4xl">
            <p className="eyebrow text-brand-light">Perspective not found</p>
            <h1 className="mt-5 text-5xl font-black">This article is not available.</h1>
            <Link to="/perspectives" className="btn-brand mt-8">
              Back to perspectives <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </section>
      </Layout>
    );
  }

  const isOffset = index % 2 === 1;

  return (
    <Layout>
      <section data-header-theme="dark" className="relative overflow-hidden bg-neutral-950 pt-28 text-white">
        <div className={`service-detail-visual ${perspective.visual} absolute inset-0`} />
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/68 to-black/32" />
        <div className="relative mx-auto min-h-[70vh] max-w-7xl px-6 pb-16 pt-32 md:px-12 lg:px-16">
          <Reveal direction="scale" className={isOffset ? "ml-auto max-w-4xl" : "max-w-4xl"}>
            <Link
              to="/perspectives"
              className="inline-flex items-center gap-3 text-xs font-black uppercase tracking-[0.2em] text-white/75 transition hover:text-brand-light"
            >
              <ArrowLeft className="h-4 w-4 text-brand-light" />
              Back to Perspectives
            </Link>
            <div className="mt-12 flex items-center gap-3 text-xs font-black uppercase tracking-[0.22em] text-brand-light">
              <CalendarDays className="h-4 w-4" />
              {perspective.date} / {perspective.category}
            </div>
            <h1 className="mt-6 text-[clamp(2.35rem,6vw,4.75rem)] font-black leading-[1.02] tracking-tight md:leading-[0.95]">
              {perspective.title}
            </h1>
            <p className="mt-7 text-lg leading-8 text-neutral-200 md:text-xl">{perspective.intro}</p>
          </Reveal>
        </div>
      </section>

      <section data-header-theme="light" className="section-padding bg-white">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.24fr_1fr]">
          <Reveal className="hidden lg:block">
            <div className="sticky top-32 origin-top rotate-180 [writing-mode:vertical-rl] text-xs font-black uppercase tracking-[0.28em] text-neutral-400">
              {perspective.category}
            </div>
          </Reveal>

          <div className={isOffset ? "grid gap-6 md:grid-cols-3" : "space-y-8"}>
            {perspective.sections.map((section, sectionIndex) => (
              <Reveal
                key={section.title}
                delay={sectionIndex * 0.08}
                direction={isOffset ? "up" : sectionIndex % 2 === 0 ? "left" : "right"}
              >
                <article
                  className={
                    isOffset
                      ? "h-full rounded-[2rem] border border-black/10 bg-neutral-50 p-7 transition hover:-translate-y-1 hover:border-brand/40 hover:shadow-xl"
                      : "grid gap-8 rounded-[2rem] border border-black/10 bg-white p-7 shadow-sm md:grid-cols-[0.35fr_1fr] md:p-10"
                  }
                >
                  <div>
                    <div className="text-sm font-black text-brand">
                      {String(sectionIndex + 1).padStart(2, "0")}
                    </div>
                    <h2 className="mt-5 text-3xl font-black tracking-tight text-neutral-950">
                      {section.title}
                    </h2>
                  </div>
                  <p className="text-lg leading-8 text-neutral-600">{section.body}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
}
