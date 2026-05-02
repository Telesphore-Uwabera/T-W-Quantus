import { ArrowRight, Building2, HardHat, Home, Landmark, Paintbrush, Wrench } from "lucide-react";
import { Link } from "react-router-dom";
import { Layout } from "@/components/site/Layout";
import { PageHero } from "@/components/site/PageHero";
import { Reveal } from "@/components/site/Reveal";
import { businessActivities, projectTypes } from "@/data/site";

const icons = [Home, Building2, Landmark, Paintbrush, HardHat, Wrench];
const getSectionId = (title: string) =>
  title
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

export default function Projects() {
  return (
    <Layout>
      <PageHero
        eyebrow="Projects and sectors"
        title="Project support for buildings, infrastructure, renovations, and technical works."
        description="The company profile describes a multidisciplinary team prepared for multi-unit developments, institutional infrastructure, renovation works, and full construction delivery."
        visual="projects"
      />

      <section id="delivery-areas" data-header-theme="light" className="section-padding bg-white">
        <div className="mx-auto max-w-7xl">
          <Reveal className="max-w-3xl" direction="clip">
            <p className="eyebrow">Delivery areas</p>
            <h2 className="section-title mt-4">A flexible portfolio structure ready for real case studies.</h2>
            <p className="mt-6 text-lg leading-8 text-neutral-600">
              This page is arranged to receive completed project photography and case study details
              as the portfolio grows, while still clearly presenting the types of work T&W Quantus supports.
            </p>
          </Reveal>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:mt-12 lg:grid-cols-3 lg:gap-5">
            {projectTypes.map((type, index) => {
              const Icon = icons[index] ?? Building2;
              return (
                <Reveal key={type} delay={index * 0.06} direction={index % 2 === 0 ? "scale" : "rotate"}>
                  <div
                    id={getSectionId(type)}
                    className="project-sector-visual group relative min-h-64 scroll-mt-32 overflow-hidden rounded-[1.5rem] bg-neutral-950 p-6 text-white sm:min-h-72 sm:rounded-[2rem] sm:p-8"
                  >
                    <div className={`absolute inset-0 project-visual-${(index % 4) + 1} opacity-75 transition duration-700 group-hover:scale-110`} />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/24 to-transparent" />
                    <div className="relative">
                      <Icon className="h-7 w-7 text-brand-light sm:h-9 sm:w-9" />
                      <h3 className="mt-20 text-2xl font-black sm:mt-24 sm:text-3xl">{type}</h3>
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

      <section id="registered-activities" data-header-theme="light" className="section-padding bg-neutral-100">
        <div className="mx-auto max-w-7xl">
          <Reveal className="max-w-3xl" direction="left">
            <p className="eyebrow">Registered project capabilities</p>
            <h2 className="section-title mt-4">
              Business activities aligned with practical construction delivery.
            </h2>
            <p className="mt-6 text-lg leading-8 text-neutral-600">
              T&W Quantus is registered for quantity surveying, building project development,
              construction materials, finishes, technical installations, and selected repair works.
            </p>
          </Reveal>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:mt-12 lg:grid-cols-3 lg:gap-5">
            {businessActivities.map((activity, index) => (
              <Reveal key={activity.title} delay={index * 0.05} direction={index % 3 === 0 ? "right" : index % 3 === 1 ? "skew" : "up"}>
                <div className="h-full rounded-[1.5rem] bg-white p-5 shadow-sm ring-1 ring-black/5 transition hover:-translate-y-1 hover:ring-brand/30 sm:rounded-[2rem] sm:p-7">
                  <div className="text-sm font-black text-brand">
                    {String(index + 1).padStart(2, "0")}
                  </div>
                  <h3 className="mt-6 text-xl font-black text-neutral-950 sm:mt-8 sm:text-2xl">{activity.title}</h3>
                  <p className="mt-4 leading-7 text-neutral-600">{activity.description}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section data-header-theme="light" className="section-padding bg-white">
        <Reveal className="mx-auto grid max-w-7xl gap-6 rounded-[1.5rem] bg-white p-5 shadow-sm ring-1 ring-black/5 sm:rounded-[2rem] sm:p-8 md:p-12 lg:grid-cols-[1fr_0.55fr] lg:items-center" direction="zoom">
          <div>
            <p className="eyebrow">Case study ready</p>
            <h2 className="mt-4 text-[2rem] font-black tracking-tight sm:text-4xl md:text-6xl">
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
