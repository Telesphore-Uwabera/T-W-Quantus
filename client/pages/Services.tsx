import { ArrowRight, CheckCircle2 } from "lucide-react";
import { Link } from "react-router-dom";
import { Layout } from "@/components/site/Layout";
import { PageHero } from "@/components/site/PageHero";
import { Reveal } from "@/components/site/Reveal";
import { services } from "@/data/site";

const getServiceId = (title: string) =>
  title
    .toLowerCase()
    .replace(/&/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

export default function Services() {
  return (
    <Layout>
      <PageHero
        eyebrow="Services"
        title="Integrated built environment services from strategy to handover."
        description="Our services are modeled on global best practices and tailored to East African project realities, combining cost control, management, coordination, technical support, and execution."
        visual="services"
      />

      <section id="services-overview" data-header-theme="light" className="section-padding bg-white">
        <div className="mx-auto max-w-7xl space-y-8">
          {services.map((service, index) => (
            <Reveal
              key={service.title}
              delay={index * 0.08}
              direction={index % 4 === 0 ? "left" : index % 4 === 1 ? "right" : index % 4 === 2 ? "zoom" : "clip"}
            >
              <article
                id={getServiceId(service.title)}
                className="scroll-mt-32 grid gap-6 rounded-[1.5rem] border border-black/10 bg-white p-4 shadow-sm transition hover:border-brand/40 hover:shadow-2xl sm:rounded-[2rem] sm:p-6 md:p-8 lg:grid-cols-[0.75fr_1.25fr] lg:gap-8 lg:p-10"
              >
                <div>
                  <div
                    className={`service-detail-visual service-visual-${index + 1} mb-6 min-h-44 rounded-[1.25rem] sm:mb-8 sm:min-h-60 sm:rounded-[1.5rem]`}
                  />
                  <div className="text-5xl font-black text-neutral-200 sm:text-7xl">{service.number}</div>
                  <h2 className="mt-4 text-2xl font-black tracking-tight text-neutral-950 sm:mt-6 sm:text-3xl md:text-5xl">
                    {service.title}
                  </h2>
                  <p className="mt-5 leading-8 text-neutral-600">{service.summary}</p>
                  <Link
                    to={`/services/${service.slug}`}
                    className="mt-7 inline-flex items-center border-b-2 border-brand pb-1 text-sm font-black text-neutral-950 transition hover:text-brand"
                  >
                    Open service page <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </div>
                <div className="space-y-6">
                  <div className="grid content-start gap-3 sm:grid-cols-2 sm:gap-4">
                    {service.highlights.map((highlight) => (
                      <div key={highlight} className="flex gap-3 rounded-2xl bg-neutral-100 p-4 sm:p-5">
                        <CheckCircle2 className="mt-1 h-4 w-4 flex-none text-brand sm:h-5 sm:w-5" />
                        <span className="font-semibold text-neutral-800">{highlight}</span>
                      </div>
                    ))}
                  </div>

                  <div className="grid gap-3 md:grid-cols-2 md:gap-4">
                    {service.detailGroups.map((group) => (
                      <div key={group.title} className="rounded-2xl border border-brand/15 bg-brand/5 p-4 sm:p-5">
                        <h3 className="font-black text-neutral-950">{group.title}</h3>
                        <ul className="mt-4 space-y-2 text-sm font-semibold leading-6 text-neutral-600">
                          {group.items.map((item) => (
                            <li key={item} className="flex gap-2">
                              <span className="mt-2 h-1.5 w-1.5 flex-none rounded-full bg-brand" />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      <section data-header-theme="dark" className="section-padding bg-neutral-950 text-white">
        <Reveal className="mx-auto flex max-w-7xl flex-col justify-between gap-8 md:flex-row md:items-center" direction="rotate">
          <div>
            <p className="eyebrow text-brand-light">Procurement and standards</p>
            <h2 className="mt-4 max-w-4xl text-[clamp(2rem,4.8vw,4rem)] font-black leading-[1.05] tracking-tight">
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
