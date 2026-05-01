import { ArrowRight, CheckCircle2 } from "lucide-react";
import { Link } from "react-router-dom";
import { Layout } from "@/components/site/Layout";
import { PageHero } from "@/components/site/PageHero";
import { Reveal } from "@/components/site/Reveal";
import { services } from "@/data/site";

export default function Services() {
  return (
    <Layout>
      <PageHero
        eyebrow="Services"
        title="Integrated built environment services from strategy to handover."
        description="Our services are modeled on global best practices and tailored to East African project realities, combining cost control, management, coordination, technical support, and execution."
      />

      <section className="section-padding bg-white">
        <div className="mx-auto max-w-7xl space-y-8">
          {services.map((service, index) => (
            <Reveal key={service.title} delay={index * 0.08}>
              <article className="grid gap-8 rounded-[2rem] border border-black/10 bg-white p-6 shadow-sm transition hover:border-brand/40 hover:shadow-2xl md:p-10 lg:grid-cols-[0.75fr_1.25fr]">
                <div>
                  <div className="text-7xl font-black text-neutral-200">{service.number}</div>
                  <h2 className="mt-6 text-3xl font-black tracking-tight text-neutral-950 md:text-5xl">
                    {service.title}
                  </h2>
                  <p className="mt-5 leading-8 text-neutral-600">{service.summary}</p>
                </div>
                <div className="grid content-start gap-4 sm:grid-cols-2">
                  {service.highlights.map((highlight) => (
                    <div key={highlight} className="flex gap-3 rounded-2xl bg-neutral-100 p-5">
                      <CheckCircle2 className="mt-1 h-5 w-5 flex-none text-brand" />
                      <span className="font-semibold text-neutral-800">{highlight}</span>
                    </div>
                  ))}
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      <section data-header-theme="dark" className="section-padding bg-neutral-950 text-white">
        <Reveal className="mx-auto flex max-w-7xl flex-col justify-between gap-8 md:flex-row md:items-center">
          <div>
            <p className="eyebrow text-brand-light">Procurement and standards</p>
            <h2 className="mt-4 max-w-4xl text-4xl font-black tracking-tight md:text-6xl">
              Support for FIDIC, RPPA, JCT, NEC, traditional, D&B, and EPC procurement models.
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
