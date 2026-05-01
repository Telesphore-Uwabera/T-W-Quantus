import { ArrowRight, Building2, HardHat, Home, Landmark, Paintbrush, Wrench } from "lucide-react";
import { Link } from "react-router-dom";
import { Layout } from "@/components/site/Layout";
import { PageHero } from "@/components/site/PageHero";
import { Reveal } from "@/components/site/Reveal";
import { projectTypes } from "@/data/site";

const icons = [Home, Building2, Landmark, Paintbrush, HardHat, Wrench];

export default function Projects() {
  return (
    <Layout>
      <PageHero
        eyebrow="Projects and sectors"
        title="Project support for buildings, infrastructure, renovations, and technical works."
        description="The company profile describes a multidisciplinary team prepared for multi-unit developments, institutional infrastructure, renovation works, and full construction delivery."
      />

      <section className="section-padding bg-white">
        <div className="mx-auto max-w-7xl">
          <Reveal className="max-w-3xl">
            <p className="eyebrow">Delivery areas</p>
            <h2 className="section-title mt-4">A flexible portfolio structure ready for real case studies.</h2>
            <p className="mt-6 text-lg leading-8 text-neutral-600">
              This page is arranged to receive completed project photography and case study details
              as the portfolio grows, while still clearly presenting the types of work T&W Quantus supports.
            </p>
          </Reveal>

          <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {projectTypes.map((type, index) => {
              const Icon = icons[index] ?? Building2;
              return (
                <Reveal key={type} delay={index * 0.06}>
                  <div className="group relative min-h-72 overflow-hidden rounded-[2rem] bg-neutral-950 p-8 text-white">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(23,102,106,0.45),transparent_34%)] opacity-80 transition group-hover:scale-110" />
                    <div className="relative">
                      <Icon className="h-9 w-9 text-brand-light" />
                      <h3 className="mt-24 text-3xl font-black">{type}</h3>
                      <p className="mt-4 leading-7 text-neutral-300">
                        Planning, cost control, technical coordination, execution support, and
                        quality-focused delivery.
                      </p>
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      <section className="section-padding bg-neutral-100">
        <Reveal className="mx-auto grid max-w-7xl gap-8 rounded-[2rem] bg-white p-8 shadow-sm ring-1 ring-black/5 md:p-12 lg:grid-cols-[1fr_0.55fr] lg:items-center">
          <div>
            <p className="eyebrow">Case study ready</p>
            <h2 className="mt-4 text-4xl font-black tracking-tight md:text-6xl">
              Add client stories, before-and-after imagery, BOQ outcomes, and delivery metrics here.
            </h2>
          </div>
          <Link to="/contact" className="btn-brand justify-self-start lg:justify-self-end">
            Discuss a Project <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </Reveal>
      </section>
    </Layout>
  );
}
