import { Mail, MapPin, Phone, Send } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Layout } from "@/components/site/Layout";
import { PageHero } from "@/components/site/PageHero";
import { Reveal } from "@/components/site/Reveal";
import { company, services } from "@/data/site";
import { submitContact } from "@/lib/api";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function Contact() {
  const [service, setService] = useState<string>("");
  const [sending, setSending] = useState(false);

  return (
    <Layout>
      <PageHero
        eyebrow="Contact"
        title="Start your project with a clear conversation about cost, scope, and delivery."
        description="Reach T&W Quantus in Kigali for quantity surveying, project management, construction management, technical services, and turnkey construction support."
        visual="contact"
      />

      <section id="request-consultation" data-header-theme="light" className="section-padding bg-white">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-stretch lg:gap-10">
          {/* Sticky wrapper must sit outside Reveal: motion transforms break position:sticky on descendants. */}
          <div className="lg:sticky lg:top-28 lg:z-10 lg:h-full lg:min-h-0">
            <Reveal direction="left" className="h-full min-h-0">
              <div className="flex h-full min-h-0 flex-col overflow-hidden rounded-[1.5rem] bg-neutral-950 text-white lg:rounded-[2rem]">
                <div className="contact-map-visual flex min-h-52 flex-1 flex-col p-5 sm:min-h-72 sm:p-8">
                  <div className="relative z-10 inline-flex rounded-full bg-black/45 px-4 py-2 text-xs font-black uppercase tracking-[0.2em] text-white backdrop-blur">
                    Kigali, Rwanda
                  </div>
                </div>
                <div className="shrink-0 p-5 sm:p-8">
                  <h2 className="text-2xl font-black sm:text-3xl">Contact details</h2>
                  <div className="mt-6 space-y-5 sm:mt-8 sm:space-y-6">
                    <ContactItem icon={<MapPin />} label="Office" value={company.registeredAddress} />
                    <ContactItem icon={<Phone />} label="Phone" value={company.phone} href={company.phoneHref} />
                    <ContactItem icon={<Mail />} label="Email" value={company.email} href={company.emailHref} />
                  </div>
                </div>
              </div>
            </Reveal>
          </div>

          <Reveal delay={0.1} direction="right" className="min-h-0 lg:h-full">
            <div className="flex h-full min-h-0 min-w-0 flex-col rounded-[1.5rem] border border-black/10 p-4 shadow-sm sm:p-6 md:rounded-[2rem] md:p-10">
              <p className="eyebrow">Request consultation</p>
              <h2 className="mt-4 whitespace-nowrap text-[clamp(0.8125rem,calc(0.55rem+2.75vw),2.75rem)] font-black leading-[1.04] tracking-tight">
                Tell us what you are building.
              </h2>
              <p className="mt-5 text-base leading-7 text-neutral-600 sm:leading-8">
                Submit the form and we will receive your message securely. You can also reach us
                directly by email or phone for project location, stage, budget, and the services you need.
              </p>

              <form
                className="mt-8 grid min-w-0 gap-4 sm:mt-10 sm:gap-5"
                onSubmit={async (event) => {
                  event.preventDefault();
                  const form = event.currentTarget;
                  const fd = new FormData(form);
                  const name = String(fd.get("name") ?? "").trim();
                  const email = String(fd.get("email") ?? "").trim();
                  const phone = String(fd.get("phone") ?? "").trim();
                  const message = String(fd.get("message") ?? "").trim();
                  setSending(true);
                  try {
                    await submitContact({
                      name,
                      email,
                      phone: phone || undefined,
                      service: service || undefined,
                      message,
                    });
                    toast.success("Message received. We will get back to you soon.");
                    form.reset();
                    setService("");
                  } catch (e) {
                    toast.error(e instanceof Error ? e.message : "Could not send. Try email or phone.");
                  } finally {
                    setSending(false);
                  }
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
                    <Select value={service || undefined} onValueChange={setService}>
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
                <button type="submit" className="btn-brand justify-self-start" disabled={sending}>
                  {sending ? "Sending…" : "Send Message"} <Send className="ml-2 h-5 w-5" />
                </button>
              </form>
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
          <div className="mt-10 grid gap-4 lg:mt-12 lg:grid-cols-2 lg:gap-5 lg:items-stretch">
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
              <Reveal
                key={item.question}
                className="min-h-0 lg:h-full"
                delay={index * 0.05}
                direction={index % 2 === 0 ? "up" : "scale"}
              >
                <details className="group flex h-full min-h-0 flex-col rounded-[1.25rem] bg-white p-4 shadow-sm ring-1 ring-black/5 sm:rounded-[1.5rem] sm:p-6">
                  <summary className="flex cursor-pointer list-none items-start justify-between gap-3 text-base font-black text-neutral-950 sm:text-xl [&::-webkit-details-marker]:hidden">
                    <span className="min-w-0 flex-1 pr-1">{item.question}</span>
                    <span className="mt-0.5 shrink-0 text-lg leading-none text-brand transition group-open:rotate-45 sm:text-xl">
                      +
                    </span>
                  </summary>
                  <div className="mt-4 flex min-h-0 flex-1 flex-col border-t border-transparent pt-0">
                    <p className="leading-7 text-neutral-600">{item.answer}</p>
                  </div>
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
