import { Building2, Calendar, UserRound } from "lucide-react";
import { Layout } from "@/components/site/Layout";
import { PageHero } from "@/components/site/PageHero";
import { Reveal } from "@/components/site/Reveal";
import { company, values } from "@/data/site";

export default function About() {
  return (
    <Layout>
      <PageHero
        eyebrow="About T&W Quantus"
        title="A Kigali-based firm built around precision, trust, and complete construction solutions."
        description="T&W Quantus derives its name from the Latin quantus, meaning how much or how great. That philosophy guides our focus on accurate evaluation, optimal project outcomes, and excellence in delivery."
      />

      <section className="section-padding bg-white">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[1fr_0.8fr]">
          <Reveal>
            <p className="eyebrow">Company overview</p>
            <h2 className="section-title mt-4">We turn precise insights into dependable construction results.</h2>
            <div className="mt-8 space-y-6 text-lg leading-8 text-neutral-600">
              <p>
                {company.shortName} serves clients across East Africa and beyond with
                multidisciplinary support from concept development and financial planning
                to on-site execution and final handover.
              </p>
              <p>
                Our reputation is built on integrity, collaboration, and innovation,
                supported by a commitment to measurable outcomes and long-term client
                partnerships.
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="rounded-[2rem] bg-neutral-950 p-8 text-white">
              <img src={company.logo} alt={`${company.name} logo`} className="mb-8 h-28 w-28 object-contain" />
              <div className="space-y-5">
                <Info icon={<Building2 />} label="Registered name" value={company.name} />
                <Info icon={<Calendar />} label="Registration date" value={company.registrationDate} />
                <Info icon={<UserRound />} label="Managing director" value={company.managingDirector} />
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="section-padding bg-neutral-100">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-2">
          <Reveal>
            <div className="h-full rounded-[2rem] bg-white p-8 shadow-sm ring-1 ring-black/5">
              <p className="eyebrow">Our vision</p>
              <h2 className="mt-5 text-3xl font-black md:text-5xl">
                To become a leading provider of innovative, high-quality, sustainable construction solutions.
              </h2>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="h-full rounded-[2rem] bg-brand p-8 text-white">
              <p className="eyebrow text-white/70">Our mission</p>
              <h2 className="mt-5 text-3xl font-black md:text-5xl">
                To deliver cost-effective, timely, and high-quality services through expertise, skill, and precision.
              </h2>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="section-padding bg-white">
        <div className="mx-auto max-w-7xl">
          <Reveal className="max-w-3xl">
            <p className="eyebrow">Core values</p>
            <h2 className="section-title mt-4">Values that keep projects transparent and focused.</h2>
          </Reveal>
          <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {values.map((value, index) => (
              <Reveal key={value.title} delay={index * 0.06}>
                <div className="h-full rounded-3xl border border-black/10 p-7 transition hover:-translate-y-1 hover:border-brand/40 hover:shadow-xl">
                  <div className="mb-8 text-sm font-black text-brand">{String(index + 1).padStart(2, "0")}</div>
                  <h3 className="text-2xl font-black">{value.title}</h3>
                  <p className="mt-4 leading-7 text-neutral-600">{value.description}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
}

function Info({ icon, label, value }: { icon: JSX.Element; label: string; value: string }) {
  return (
    <div className="flex gap-4 border-b border-white/10 pb-5 last:border-0 last:pb-0">
      <span className="text-brand-light [&_svg]:h-5 [&_svg]:w-5">{icon}</span>
      <div>
        <div className="text-xs font-bold uppercase tracking-[0.18em] text-neutral-500">{label}</div>
        <div className="mt-1 font-semibold">{value}</div>
      </div>
    </div>
  );
}
