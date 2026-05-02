import { Mail, MapPin, Phone, Send } from "lucide-react";
import { Layout } from "@/components/site/Layout";
import { PageHero } from "@/components/site/PageHero";
import { Reveal } from "@/components/site/Reveal";
import { company, services } from "@/data/site";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function Contact() {
  return (
    <Layout>
      <PageHero
        eyebrow="Contact"
        title="Start your project with a clear conversation about cost, scope, and delivery."
        description="Reach T&W Quantus in Kigali for quantity surveying, project management, construction management, technical services, and turnkey construction support."
        visual="contact"
      />

      <section id="request-consultation" data-header-theme="light" className="section-padding bg-white">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:gap-10">
          <Reveal direction="left">
            <div className="overflow-hidden rounded-[1.5rem] bg-neutral-950 text-white lg:sticky lg:top-28 lg:rounded-[2rem]">
              <div className="contact-map-visual min-h-52 p-5 sm:min-h-72 sm:p-8">
                <div className="relative z-10 inline-flex rounded-full bg-black/45 px-4 py-2 text-xs font-black uppercase tracking-[0.2em] text-white backdrop-blur">
                  Kigali, Rwanda
                </div>
              </div>
              <div className="p-5 sm:p-8">
              <h2 className="text-2xl font-black sm:text-3xl">Contact details</h2>
              <div className="mt-6 space-y-5 sm:mt-8 sm:space-y-6">
                <ContactItem icon={<MapPin />} label="Office" value={company.registeredAddress} />
                <ContactItem icon={<Phone />} label="Phone" value={company.phone} href={company.phoneHref} />
                <ContactItem icon={<Mail />} label="Email" value={company.email} href={company.emailHref} />
              </div>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.1} direction="right">
            <div className="min-w-0 rounded-[1.5rem] border border-black/10 p-4 shadow-sm sm:p-6 md:rounded-[2rem] md:p-10">
              <p className="eyebrow">Request consultation</p>
              <h2 className="mt-4 text-[2rem] font-black leading-[1.04] tracking-tight sm:text-4xl md:text-6xl">
                Tell us what you are building.
              </h2>
              <p className="mt-5 text-base leading-7 text-neutral-600 sm:leading-8">
                Use email or phone to share project location, intended use, stage, budget status,
                and the services you need. The website can later connect this section to a live
                backend form if required.
              </p>

              <form
                className="mt-8 grid min-w-0 gap-4 sm:mt-10 sm:gap-5"
                onSubmit={(event) => {
                  event.preventDefault();
                  window.location.href = company.emailHref;
                }}
              >
                <div className="grid min-w-0 gap-4 md:grid-cols-2 md:gap-5">
                  <label className="contact-field">
                    <span>Your Name</span>
                    <input type="text" name="name" placeholder="Full name" required />
                  </label>
                  <label className="contact-field">
                    <span>Your Email</span>
                    <input type="email" name="email" placeholder="you@example.com" required />
                  </label>
                </div>
                <div className="grid min-w-0 gap-4 md:grid-cols-2 md:gap-5">
                  <label className="contact-field">
                    <span>Phone Number</span>
                    <input type="tel" name="phone" placeholder="+250 ..." />
                  </label>
                  <label className="contact-field">
                    <span>Project Type</span>
                    <Select name="service">
                      <SelectTrigger className="h-auto min-w-0 rounded-2xl border-black/10 bg-white px-4 py-4 text-base font-semibold text-neutral-950 shadow-none transition focus:ring-4 focus:ring-brand/10 sm:px-5">
                        <SelectValue placeholder="Select service" />
                      </SelectTrigger>
                      <SelectContent className="rounded-2xl border-brand/20 bg-white p-2 shadow-2xl">
                        {services.map((service) => (
                          <SelectItem
                            key={service.title}
                            value={service.title}
                            className="rounded-xl py-3 pl-9 pr-3 font-semibold text-neutral-900 focus:bg-brand focus:text-white"
                          >
                            {service.title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </label>
                </div>
                <label className="contact-field">
                  <span>Project Message</span>
                  <textarea
                    name="message"
                    rows={5}
                    placeholder="Tell us about location, stage, scope, timeline, and budget status."
                    required
                  />
                </label>
                <button type="submit" className="btn-brand justify-self-start">
                  Send Message <Send className="ml-2 h-5 w-5" />
                </button>
              </form>

              <div className="mt-8 grid gap-3 sm:mt-10 sm:gap-4 md:grid-cols-2">
                {services.map((service) => (
                  <div key={service.title} className="rounded-2xl bg-neutral-100 p-4 sm:p-5">
                    <div className="text-sm font-black text-brand">{service.number}</div>
                    <div className="mt-3 font-black text-neutral-950">{service.title}</div>
                  </div>
                ))}
              </div>

              <div className="mt-8 flex flex-col gap-3 sm:mt-10 sm:flex-row sm:gap-4">
                <a href={company.emailHref} className="btn-brand w-full sm:w-auto">
                  Email Us <Send className="ml-2 h-5 w-5" />
                </a>
                <a href={company.phoneHref} className="btn-outline w-full sm:w-auto">
                  Call {company.phone}
                </a>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <section id="faqs" data-header-theme="light" className="section-padding bg-neutral-100">
        <div className="mx-auto max-w-7xl">
          <Reveal className="max-w-3xl" direction="clip">
            <p className="eyebrow">FAQs</p>
            <h2 className="section-title mt-4">Questions before starting a project?</h2>
          </Reveal>
          <div className="mt-10 grid gap-4 lg:mt-12 lg:grid-cols-2 lg:gap-5">
            {[
              {
                question: "What information should I share for a first consultation?",
                answer:
                  "Share the project location, intended use, current stage, approximate size, timeline, budget status, drawings if available, and the service you need.",
              },
              {
                question: "Do you provide quantity surveying and cost management?",
                answer:
                  "Yes. T&W Quantus supports cost estimating, feasibility studies, BOQs, tender documentation, budget monitoring, final accounts, and value management.",
              },
              {
                question: "Can T&W Quantus manage construction execution?",
                answer:
                  "Yes. We support site mobilization, supervision, subcontractor coordination, schedule tracking, quality assurance, HSE monitoring, and handover.",
              },
              {
                question: "Do you work outside Kigali?",
                answer:
                  "Yes. The company is based in Gasabo, Kigali, and serves clients across Rwanda, East Africa, and broader international project needs.",
              },
              {
                question: "Can you support turnkey construction and technical services?",
                answer:
                  "Yes. We support general building construction, architectural drawing, civil and structural works, MEP installations, renovations, repairs, and material supply.",
              },
              {
                question: "How quickly can I get a response?",
                answer:
                  "For urgent project inquiries, call directly. For email or form submissions, include clear project details so the team can respond with the right next step.",
              },
            ].map((item, index) => (
              <Reveal key={item.question} delay={index * 0.05} direction={index % 2 === 0 ? "up" : "scale"}>
                <details className="group rounded-[1.25rem] bg-white p-4 shadow-sm ring-1 ring-black/5 sm:rounded-[1.5rem] sm:p-6">
                  <summary className="cursor-pointer list-none text-base font-black text-neutral-950 sm:text-xl">
                    {item.question}
                    <span className="float-right text-brand transition group-open:rotate-45">+</span>
                  </summary>
                  <p className="mt-4 leading-7 text-neutral-600">{item.answer}</p>
                </details>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
}

function ContactItem({
  icon,
  label,
  value,
  href,
}: {
  icon: JSX.Element;
  label: string;
  value: string;
  href?: string;
}) {
  const content = (
    <>
      <span className="text-brand-light [&_svg]:h-5 [&_svg]:w-5">{icon}</span>
      <span className="min-w-0 flex-1">
        <span className="block text-xs font-bold uppercase tracking-[0.18em] text-neutral-500">
          {label}
        </span>
        <span className="mt-1 block break-words font-semibold leading-6">{value}</span>
      </span>
    </>
  );

  if (href) {
    return (
      <a href={href} className="flex min-w-0 gap-4 transition hover:text-brand-light">
        {content}
      </a>
    );
  }

  return <div className="flex min-w-0 gap-4">{content}</div>;
}
