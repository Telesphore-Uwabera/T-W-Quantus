import { ArrowRight, CalendarDays, MapPin, Minus, Play, Plus, Rocket } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Layout } from "@/components/site/Layout";
import { Reveal } from "@/components/site/Reveal";
import { company, services } from "@/data/site";

const projectCards = [
  { title: "Residential Developments", location: "Rwanda", visual: "project-visual-1" },
  { title: "Commercial Spaces", location: "East Africa", visual: "project-visual-2" },
  { title: "Institutional Infrastructure", location: "Regional", visual: "project-visual-3" },
  { title: "Renovations & Technical Works", location: "Kigali", visual: "project-visual-4" },
];

const insights = [
  {
    title: "Cost certainty from feasibility to final account",
    date: "Quantity Surveying",
    summary:
      "How early estimates, BOQs, tender reviews, and final account controls protect project value.",
    visual: "insight-visual-1",
  },
  {
    title: "Managing construction delivery with clearer controls",
    date: "Project Management",
    summary:
      "A practical view of planning, procurement, site coordination, quality, and stakeholder alignment.",
    visual: "insight-visual-2",
  },
];

export default function Index() {
  const [activeService, setActiveService] = useState(0);

  return (
    <Layout>
      <section data-home-hero data-header-theme="dark" className="hero-section relative min-h-screen overflow-hidden bg-neutral-950 text-white">
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,0.78),rgba(0,0,0,0.38)_48%,rgba(0,0,0,0.64)),radial-gradient(circle_at_28%_75%,rgba(23,102,106,0.28),transparent_13%)]" />
        <motion.div
          className="absolute right-[-11rem] top-28 h-[34rem] w-[34rem] rounded-full border border-white/15"
          animate={{ rotate: 360 }}
          transition={{ duration: 38, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          className="absolute bottom-[12%] left-[12%] grid h-16 w-16 place-items-center rounded-full bg-brand text-white shadow-2xl shadow-brand/40 ring-[18px] ring-brand/20"
          animate={{ scale: [1, 1.08, 1] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
        >
          <Play className="h-6 w-6 fill-current" />
        </motion.div>
        <motion.div
          className="absolute bottom-[9%] right-[5%] hidden md:block"
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
        >
          <Link
            to="/contact"
            aria-label="Contact T&W Quantus"
            className="grid h-16 w-16 place-items-center rounded-full bg-brand text-white shadow-2xl shadow-brand/40 transition hover:scale-110 hover:bg-brand-light"
          >
            <Rocket className="h-6 w-6" />
          </Link>
        </motion.div>
      </section>

      <section data-header-theme="light" className="what-we-do-section relative overflow-hidden bg-white px-5 py-20 md:px-8 md:py-28">
        <div className="absolute left-[11%] top-40 hidden h-6 w-px bg-brand lg:block" />
        <div className="absolute left-[11%] top-[46%] hidden h-6 w-px bg-brand lg:block" />

        <div className="relative mx-auto grid max-w-7xl gap-14 lg:grid-cols-[80px_1fr]">
          <div className="hidden justify-center lg:flex">
            <div className="origin-top rotate-180 [writing-mode:vertical-rl] text-xs font-black uppercase tracking-[0.22em] text-neutral-400">
              What we do
            </div>
          </div>

          <div>
            <Reveal>
              <h2 className="max-w-5xl text-4xl font-black leading-tight tracking-tight text-neutral-950 md:text-5xl lg:text-6xl">
                From the beginning to the end of the built asset lifecycle, {company.shortName} provides
                a comprehensive suite of integrated services.
              </h2>
            </Reveal>

            <div className="mt-16 grid gap-14 lg:grid-cols-[0.82fr_1.05fr] lg:items-start">
              <Reveal>
                <div className="facade-card min-h-[360px] overflow-hidden rounded-none shadow-2xl shadow-black/10" />
              </Reveal>

              <Reveal delay={0.1}>
                <div className="divide-y divide-neutral-200">
                  {services.map((service, index) => {
                    const isActive = index === activeService;

                    return (
                      <div key={service.title} className="py-6 first:pt-0">
                        <button
                          type="button"
                          className="flex w-full items-center justify-between gap-6 text-left"
                          onClick={() => setActiveService(index)}
                        >
                          <span className="flex items-baseline gap-5">
                            <span className="text-xs font-black text-brand">{service.number}</span>
                            <span className="text-xl font-black text-neutral-950 md:text-2xl">
                              {service.title}
                            </span>
                          </span>
                          <span className="text-brand">
                            {isActive ? <Minus className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                          </span>
                        </button>

                        {isActive && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            transition={{ duration: 0.3 }}
                            className="overflow-hidden"
                          >
                            <p className="mt-7 max-w-md text-sm leading-7 text-neutral-600 md:text-base">
                              {service.summary}
                            </p>
                            <Link
                              to="/services"
                              className="mt-5 inline-flex border-b-2 border-brand text-sm font-black text-neutral-950 transition hover:text-brand"
                            >
                              View More
                            </Link>
                          </motion.div>
                        )}
                      </div>
                    );
                  })}
                </div>

                <Link to="/services" className="mt-10 inline-flex items-center rounded-full bg-brand px-10 py-4 text-sm font-black text-white transition hover:bg-brand-light">
                  View all services <ArrowRight className="ml-3 h-4 w-4" />
                </Link>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      <section data-header-theme="light" className="what-we-do-section relative overflow-hidden bg-white px-5 py-20 md:px-8 md:py-28">
        <div className="relative mx-auto max-w-5xl">
          <Reveal>
            <h2 className="max-w-4xl text-4xl font-black leading-tight tracking-tight text-neutral-950 md:text-5xl">
              We focus on providing added value to clients' portfolios and minimizing risk by
              understanding exactly what they need, working collaboratively and transparently to
              gain the insights that bring results.
            </h2>
            <Link to="/projects" className="mt-10 inline-flex items-center rounded-full bg-brand px-10 py-4 text-sm font-black text-white transition hover:bg-brand-light">
              View all projects <ArrowRight className="ml-3 h-4 w-4" />
            </Link>
          </Reveal>
        </div>
      </section>

      <section data-header-theme="dark" className="grid bg-neutral-950 md:grid-cols-2 lg:grid-cols-4">
        {projectCards.map((project, index) => (
          <Link
            key={project.title}
            to="/projects"
            className={`group project-card ${project.visual} relative min-h-[440px] overflow-hidden p-8 text-white`}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent transition group-hover:from-brand-dark/85" />
            <div className="relative flex h-full flex-col justify-end">
              <h3 className="text-xl font-black">{project.title}</h3>
              <p className="mt-4 flex items-center gap-2 text-sm font-bold">
                <MapPin className="h-4 w-4 text-brand-light" />
                {project.location}
              </p>
            </div>
            <div className="absolute bottom-8 right-8 grid h-12 w-12 place-items-center rounded-full bg-brand opacity-0 transition group-hover:opacity-100">
              <ArrowRight className="h-5 w-5" />
            </div>
          </Link>
        ))}
      </section>

      <section data-header-theme="light" className="relative overflow-hidden bg-white px-5 py-20 md:px-8 md:py-28">
        <div className="absolute left-[14%] top-24 hidden origin-top rotate-180 [writing-mode:vertical-rl] text-xs font-black uppercase tracking-[0.22em] text-neutral-400 lg:block">
          Perspectives & News
        </div>
        <div className="relative mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.25fr_1fr]">
          <Reveal className="hidden lg:block">
            <Link to="/about" className="inline-flex border-b-2 border-brand text-sm font-black text-neutral-950">
              All Perspectives & Insights
            </Link>
          </Reveal>

          <div>
            <div className="mb-10 flex items-center justify-between text-sm font-bold text-neutral-500">
              <span>Perspectives</span>
              <span>01 May 2026</span>
            </div>
            <div className="grid gap-10 md:grid-cols-2">
              {insights.map((insight, index) => (
                <Reveal key={insight.title} delay={index * 0.08}>
                  <article>
                    <div className={`${insight.visual} relative min-h-[370px] overflow-hidden`}>
                      <Link to="/services" className="absolute bottom-6 right-6 grid h-14 w-14 place-items-center rounded-full bg-brand text-white transition hover:bg-brand-light">
                        <ArrowRight className="h-5 w-5" />
                      </Link>
                    </div>
                    <div className="mt-9 flex items-center gap-3 text-xs font-black uppercase tracking-[0.18em] text-brand">
                      <CalendarDays className="h-4 w-4" />
                      {insight.date}
                    </div>
                    <h3 className="mt-4 text-2xl font-black leading-tight text-neutral-950">
                      {insight.title}
                    </h3>
                    <p className="mt-5 leading-7 text-neutral-600">{insight.summary}</p>
                  </article>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section data-header-theme="light" className="what-we-do-section relative overflow-hidden bg-white px-5 py-20 md:px-8 md:py-28">
        <Reveal className="relative mx-auto max-w-5xl">
          <h2 className="text-4xl font-black leading-tight tracking-tight text-neutral-950 md:text-5xl">
            Registered in Rwanda. Kigali-based construction consultants serving East Africa and
            clients all over the world.
          </h2>
          <Link to="/contact" className="btn-brand mt-10">
            Find our office <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </Reveal>
      </section>

      <section data-header-theme="dark" className="relative overflow-hidden bg-brand px-5 py-16 text-white md:px-8">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,rgba(255,255,255,0.22),transparent_24%)]" />
        <Reveal className="relative mx-auto flex max-w-7xl flex-col items-start justify-between gap-8 md:flex-row md:items-center">
          <div>
            <p className="eyebrow text-white/70">Ready to discuss your project?</p>
            <h2 className="mt-3 max-w-3xl text-4xl font-black tracking-tight md:text-6xl">
              Start with a precise view of cost, scope, and delivery.
            </h2>
          </div>
          <Link to="/contact" className="btn-dark shrink-0">
            Contact T&W Quantus
          </Link>
        </Reveal>
      </section>
    </Layout>
  );
}
