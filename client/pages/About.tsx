import { Layout } from "@/components/site/Layout";
import { PageHero } from "@/components/site/PageHero";
import { Reveal } from "@/components/site/Reveal";
import { values } from "@/data/site";

export default function About() {
  return (
    <Layout>
      <PageHero
        eyebrow="About T&W Quantus"
        title="Excellence in quantity surveying and the built environment."
        description="From concept through handover, we focus on precise evaluation, value optimization, and dependable project outcomes."
        visual="about"
      />

      <section id="who-we-are" data-header-theme="light" className="section-padding bg-white">
        <div className="mx-auto max-w-4xl">
          <Reveal direction="left">
            <h2 className="section-title uppercase tracking-[0.08em]">Who we are</h2>
            <div className="mt-8 space-y-6 text-base leading-8 text-neutral-600 sm:text-lg sm:leading-9">
              <p>
                We are T&W QUANTUS, a Quantity Surveying team committed to delivering excellence in the
                built environment. Derived from the Latin word &ldquo;Quantus,&rdquo; meaning
                &ldquo;How much?&rdquo; or &ldquo;How great,&rdquo; our name reflects our core
                philosophy—precise evaluation, value optimization, and outstanding project outcomes. We
                support our clients at every stage of the project lifecycle, from concept development
                and financial planning through to execution and final handover.
              </p>
              <p>
                T&W QUANTUS. Founded with a vision to provide reliable and cost-effective construction
                services, T&W Quantus is built on technical ability, collaboration, and a clear
                understanding of project demands. Our multidisciplinary team works across a range of
                projects, including multi-unit developments, institutional infrastructure, and
                renovation works, delivering solutions defined by precision, transparency, and
                reliability.
              </p>
            </div>
            <blockquote className="mt-10 border-l-4 border-brand pl-6 text-base font-semibold leading-8 text-neutral-800 sm:text-lg sm:leading-9">
              <p>
                &ldquo;At T&W Quantus, our reputation is grounded in integrity, innovation, and
                measurable results. We go beyond managing costs; we create lasting value for our
                clients, communities, and stakeholders by ensuring every project is delivered with
                accuracy, efficiency, and excellence.&rdquo;
              </p>
            </blockquote>
          </Reveal>
        </div>
      </section>

      <section id="collaborate" data-header-theme="light" className="section-padding bg-neutral-100">
        <div className="mx-auto max-w-4xl">
          <Reveal direction="up">
            <h2 className="section-title">Collaborate With Us</h2>
            <p className="mt-8 text-base leading-8 text-neutral-600 sm:mt-10 sm:text-lg sm:leading-9">
              Work with T&W QUANTUS and engage a highly competent team committed to delivering
              precision, efficiency, and measurable value across every stage of your project
              lifecycle. Our approach is grounded in technical ability, rigorous cost control, and a
              disciplined understanding of construction processes, ensuring outcomes that meet the
              highest standards of quality, time, and budget performance. We deliver tailored,
              value-driven solutions aligned to your specific project requirements, while integrating
              sustainable practices that support long-term viability and responsible development.
              Through structured communication, transparency, and a client-focused method, we build
              trusted partnerships and consistently deliver projects with accuracy, reliability, and
              professional excellence.
            </p>
          </Reveal>
        </div>
      </section>

      <section id="vision-mission" data-header-theme="light" className="section-padding bg-white">
        <div className="mx-auto grid max-w-7xl gap-5 sm:gap-8 lg:grid-cols-2">
          <Reveal direction="clip">
            <div className="h-full overflow-hidden rounded-[1.5rem] bg-neutral-100 shadow-sm ring-1 ring-black/5 sm:rounded-[2rem]">
              <div className="service-detail-visual service-visual-2 h-36 sm:h-44" />
              <div className="p-5 sm:p-8">
                <p className="eyebrow">Our Vision</p>
                <p className="mt-5 text-base font-semibold leading-8 text-neutral-800 sm:mt-6 sm:text-lg sm:leading-9">
                  To be a leading force in delivering innovative, high-quality, and sustainable
                  construction solutions that transform the built environment and enhance
                  communities. We strive to be recognized for our precision, professionalism, and
                  commitment to excellence in every project we undertake.
                </p>
              </div>
            </div>
          </Reveal>
          <Reveal delay={0.1} direction="zoom">
            <div className="h-full overflow-hidden rounded-[1.5rem] bg-brand text-white sm:rounded-[2rem]">
              <div className="service-detail-visual service-visual-4 h-36 sm:h-44" />
              <div className="p-5 sm:p-8">
                <p className="eyebrow text-white/80">Our Mission</p>
                <p className="mt-5 text-base font-semibold leading-8 text-white/95 sm:mt-6 sm:text-lg sm:leading-9">
                  Our mission is to deliver exceptional construction services through technical ability,
                  disciplined execution, and precise cost management. We are committed to providing
                  value-driven, high-quality, and prompt solutions that respond to the unique needs of
                  our clients, while building long-term partnerships founded on trust, reliability, and
                  consistent performance.
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <section id="core-values" data-header-theme="light" className="section-padding bg-neutral-100">
        <div className="mx-auto max-w-7xl">
          <Reveal className="max-w-3xl" direction="rotate">
            <p className="eyebrow">Core values</p>
            <h2 className="section-title mt-4">Values that keep projects transparent and focused.</h2>
          </Reveal>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:mt-12 lg:grid-cols-3 lg:gap-5">
            {values.map((value, index) => (
              <Reveal key={value.title} delay={index * 0.06} direction={index % 2 === 0 ? "up" : "skew"}>
                <div className="h-full rounded-[1.5rem] border border-black/10 bg-white p-5 transition hover:-translate-y-1 hover:border-brand/40 hover:shadow-xl sm:rounded-3xl sm:p-7">
                  <div className="mb-6 text-sm font-black text-brand sm:mb-8">{String(index + 1).padStart(2, "0")}</div>
                  <h3 className="text-xl font-black sm:text-2xl">{value.title}</h3>
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
