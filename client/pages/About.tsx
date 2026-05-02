import { Building2, Calendar, UserRound } from "lucide-react";
import { Layout } from "@/components/site/Layout";
import { PageHero } from "@/components/site/PageHero";
import { Reveal } from "@/components/site/Reveal";
import { businessActivities, company, values } from "@/data/site";

export default function About() {
  return (
    <Layout>
      <PageHero
        eyebrow="About T&W Quantus"
        title="A Kigali-based firm built around precision, trust, and complete construction solutions."
        description="T&W Quantus derives its name from the Latin quantus, meaning how much or how great. That philosophy guides our focus on accurate evaluation, optimal project outcomes, and excellence in delivery."
        visual="about"
      />

      <section id="who-we-are" data-header-theme="light" className="section-padding bg-white">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1fr_0.8fr] lg:gap-12">
          <Reveal direction="left">
            <p className="eyebrow">Company overview</p>
            <h2 className="section-title mt-4">We turn precise insights into dependable construction results.</h2>
            <div className="mt-6 space-y-5 text-base leading-7 text-neutral-600 sm:mt-8 sm:space-y-6 sm:text-lg sm:leading-8">
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

          <Reveal delay={0.1} direction="right">
            <div className="overflow-hidden rounded-[1.5rem] bg-neutral-950 text-white sm:rounded-[2rem]">
              <div className="about-profile-visual min-h-56 p-5 sm:min-h-72 sm:p-8">
                <img src={company.logo} alt={`${company.name} logo`} className="relative z-10 h-20 w-20 object-contain sm:h-28 sm:w-28" />
              </div>
              <div className="p-5 sm:p-8">
              <div className="space-y-5">
                <Info icon={<Building2 />} label="Registered name" value={company.name} />
                <Info icon={<Calendar />} label="Registration date" value={company.registrationDate} />
                <Info icon={<UserRound />} label="Managing director" value={company.managingDirector} />
              </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <section id="vision-mission" data-header-theme="light" className="section-padding bg-neutral-100">
        <div className="mx-auto grid max-w-7xl gap-5 sm:gap-8 lg:grid-cols-2">
          <Reveal direction="clip">
            <div className="h-full overflow-hidden rounded-[1.5rem] bg-white shadow-sm ring-1 ring-black/5 sm:rounded-[2rem]">
              <div className="service-detail-visual service-visual-2 h-36 sm:h-44" />
              <div className="p-5 sm:p-8">
              <p className="eyebrow">Our vision</p>
              <h2 className="mt-5 text-2xl font-black sm:text-3xl md:text-5xl">
                To become a leading provider of innovative, high-quality, sustainable construction solutions.
              </h2>
              </div>
            </div>
          </Reveal>
          <Reveal delay={0.1} direction="zoom">
            <div className="h-full overflow-hidden rounded-[1.5rem] bg-brand text-white sm:rounded-[2rem]">
              <div className="service-detail-visual service-visual-4 h-36 sm:h-44" />
              <div className="p-5 sm:p-8">
              <p className="eyebrow text-white/70">Our mission</p>
              <h2 className="mt-5 text-2xl font-black sm:text-3xl md:text-5xl">
                To deliver cost-effective, timely, and high-quality services through expertise, skill, and precision.
              </h2>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <section id="core-values" data-header-theme="light" className="section-padding bg-white">
        <div className="mx-auto max-w-7xl">
          <Reveal className="max-w-3xl" direction="rotate">
            <p className="eyebrow">Core values</p>
            <h2 className="section-title mt-4">Values that keep projects transparent and focused.</h2>
          </Reveal>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:mt-12 lg:grid-cols-3 lg:gap-5">
            {values.map((value, index) => (
              <Reveal key={value.title} delay={index * 0.06} direction={index % 2 === 0 ? "up" : "skew"}>
                <div className="h-full rounded-[1.5rem] border border-black/10 p-5 transition hover:-translate-y-1 hover:border-brand/40 hover:shadow-xl sm:rounded-3xl sm:p-7">
                  <div className="mb-6 text-sm font-black text-brand sm:mb-8">{String(index + 1).padStart(2, "0")}</div>
                  <h3 className="text-xl font-black sm:text-2xl">{value.title}</h3>
                  <p className="mt-4 leading-7 text-neutral-600">{value.description}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section id="registration" data-header-theme="dark" className="section-padding bg-neutral-950 text-white">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.7fr_1.3fr] lg:gap-10">
          <Reveal direction="left" className="min-w-0">
            <p className="eyebrow text-[0.65rem] text-brand-light sm:text-xs">Registered scope</p>
            <h2 className="mt-3 max-w-2xl text-[clamp(1.35rem,2.1vw+0.55rem,2.25rem)] font-black leading-[1.14] tracking-tight sm:mt-4 xl:max-w-3xl">
              A domestic private company limited by shares, registered in Rwanda.
            </h2>
            <div className="mt-6 grid gap-4 text-xs font-semibold text-neutral-300 sm:mt-8 sm:text-sm">
              <Info icon={<Building2 />} label="Registered office" value={company.registeredAddress} />
              <Info icon={<Calendar />} label="Last amendment" value={company.amendmentDate} />
              <Info icon={<UserRound />} label="Management" value={company.managingDirector} />
            </div>
          </Reveal>

          <div className="grid gap-4 md:grid-cols-2 md:gap-5">
            {businessActivities.map((activity, index) => (
              <Reveal key={activity.title} delay={index * 0.05} direction={index % 2 === 0 ? "scale" : "right"}>
                <div className="h-full min-w-0 rounded-[1.5rem] border border-white/10 bg-white/[0.06] p-5 backdrop-blur sm:p-6">
                  <div className="text-xs font-black text-brand-light sm:text-sm">
                    {String(index + 1).padStart(2, "0")}
                  </div>
                  <h3 className="mt-4 text-base font-black leading-snug sm:mt-5 sm:text-lg md:text-xl">
                    {activity.title}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-neutral-400 sm:mt-3 sm:text-base sm:leading-7">
                    {activity.description}
                  </p>
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
    <div className="flex min-w-0 gap-4 border-b border-white/10 pb-5 last:border-0 last:pb-0">
      <span className="shrink-0 text-brand-light [&_svg]:h-4 [&_svg]:w-4 sm:[&_svg]:h-5 sm:[&_svg]:w-5">
        {icon}
      </span>
      <div className="min-w-0">
        <div className="text-[0.65rem] font-bold uppercase tracking-[0.18em] text-neutral-500 sm:text-xs">
          {label}
        </div>
        <div className="mt-1 break-words text-sm font-semibold leading-relaxed sm:text-base">{value}</div>
      </div>
    </div>
  );
}
