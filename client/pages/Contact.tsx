import { Mail, MapPin, Phone, Send } from "lucide-react";
import { Layout } from "@/components/site/Layout";
import { PageHero } from "@/components/site/PageHero";
import { Reveal } from "@/components/site/Reveal";
import { company, services } from "@/data/site";

export default function Contact() {
  return (
    <Layout>
      <PageHero
        eyebrow="Contact"
        title="Start your project with a clear conversation about cost, scope, and delivery."
        description="Reach T&W Quantus in Kigali for quantity surveying, project management, construction management, technical services, and turnkey construction support."
      />

      <section className="section-padding bg-white">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.8fr_1.2fr]">
          <Reveal>
            <div className="sticky top-28 rounded-[2rem] bg-neutral-950 p-8 text-white">
              <h2 className="text-3xl font-black">Contact details</h2>
              <div className="mt-8 space-y-6">
                <ContactItem icon={<MapPin />} label="Office" value={company.registeredAddress} />
                <ContactItem icon={<Phone />} label="Phone" value={company.phone} href={company.phoneHref} />
                <ContactItem icon={<Mail />} label="Email" value={company.email} href={company.emailHref} />
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="rounded-[2rem] border border-black/10 p-6 shadow-sm md:p-10">
              <p className="eyebrow">Request consultation</p>
              <h2 className="mt-4 text-4xl font-black tracking-tight md:text-6xl">
                Tell us what you are building.
              </h2>
              <p className="mt-5 leading-8 text-neutral-600">
                Use email or phone to share project location, intended use, stage, budget status,
                and the services you need. The website can later connect this section to a live
                backend form if required.
              </p>

              <div className="mt-10 grid gap-4 md:grid-cols-2">
                {services.map((service) => (
                  <div key={service.title} className="rounded-2xl bg-neutral-100 p-5">
                    <div className="text-sm font-black text-brand">{service.number}</div>
                    <div className="mt-3 font-black text-neutral-950">{service.title}</div>
                  </div>
                ))}
              </div>

              <div className="mt-10 flex flex-col gap-4 sm:flex-row">
                <a href={company.emailHref} className="btn-brand">
                  Email Us <Send className="ml-2 h-5 w-5" />
                </a>
                <a href={company.phoneHref} className="btn-outline">
                  Call {company.phone}
                </a>
              </div>
            </div>
          </Reveal>
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
      <span>
        <span className="block text-xs font-bold uppercase tracking-[0.18em] text-neutral-500">
          {label}
        </span>
        <span className="mt-1 block font-semibold">{value}</span>
      </span>
    </>
  );

  if (href) {
    return (
      <a href={href} className="flex gap-4 transition hover:text-brand-light">
        {content}
      </a>
    );
  }

  return <div className="flex gap-4">{content}</div>;
}
