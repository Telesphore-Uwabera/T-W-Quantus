import { ArrowRight, CalendarDays } from "lucide-react";
import { Link } from "react-router-dom";
import { Layout } from "@/components/site/Layout";
import { PageHero } from "@/components/site/PageHero";
import { Reveal } from "@/components/site/Reveal";
import { perspectives } from "@/data/site";

export default function Perspectives() {
  return (
    <Layout>
      <PageHero
        eyebrow="Perspectives & News"
        title="Practical thinking on cost, tendering, and construction delivery."
        description="Explore T&W Quantus insights shaped around quantity surveying, procurement, site coordination, technical delivery, and project controls."
        visual="projects"
      />

      <section data-header-theme="light" className="section-padding bg-white">
        <div className="mx-auto grid max-w-7xl gap-8">
          {perspectives.map((item, index) => (
            <Reveal key={item.slug} delay={index * 0.08} direction={index % 2 === 0 ? "left" : "right"}>
              <Link
                to={`/perspectives/${item.slug}`}
                className="group grid overflow-hidden rounded-[2rem] border border-black/10 bg-white shadow-sm transition hover:-translate-y-1 hover:border-brand/40 hover:shadow-2xl lg:grid-cols-[0.85fr_1.15fr]"
              >
                <div className={`service-detail-visual ${item.visual} min-h-80`} />
                <div className="p-7 md:p-10">
                  <div className="flex items-center gap-3 text-xs font-black uppercase tracking-[0.2em] text-brand">
                    <CalendarDays className="h-4 w-4" />
                    {item.date} / {item.category}
                  </div>
                  <h2 className="mt-8 max-w-3xl text-4xl font-black leading-tight tracking-tight text-neutral-950 md:text-6xl">
                    {item.title}
                  </h2>
                  <p className="mt-6 max-w-2xl leading-8 text-neutral-600">{item.summary}</p>
                  <span className="mt-8 inline-flex items-center border-b-2 border-brand pb-1 text-sm font-black text-neutral-950 transition group-hover:text-brand">
                    Read perspective <ArrowRight className="ml-2 h-4 w-4" />
                  </span>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>
    </Layout>
  );
}
