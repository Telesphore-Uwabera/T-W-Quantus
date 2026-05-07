import { Mail, MapPin, Phone, Send, ArrowRight, MessageSquare, Clock } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { Layout } from "@/components/site/Layout";
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
import { cn } from "@/lib/utils";

export default function Contact() {
  const [service, setService] = useState<string>("");
  const [sending, setSending] = useState(false);

  return (
    <Layout>
      {/* Immersive Hero */}
      <section data-header-theme="dark" className="relative isolate min-h-[60vh] overflow-hidden bg-neutral-950 pt-32 text-white">
        <div className="absolute inset-0 -z-10">
          <div className="page-hero-visual contact absolute inset-0 scale-105 opacity-20 blur-sm" />
          <div className="absolute inset-0 bg-gradient-to-b from-neutral-950 via-neutral-950/60 to-neutral-950" />
        </div>
        
        <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 md:px-8">
          <Reveal direction="down">
            <span className="text-[0.65rem] font-black uppercase tracking-[0.4em] text-brand-light">Get in touch</span>
            <h1 className="mt-8 text-[clamp(2.5rem,8vw,5.5rem)] font-black leading-[0.9] tracking-tighter text-white">
              Securing your <br />
              <span className="text-brand-light italic font-serif">Project's</span> Future.
            </h1>
            <p className="mt-10 max-w-2xl text-lg font-medium leading-relaxed text-neutral-400 sm:text-2xl">
              Start a conversation about cost, scope, and technical delivery 
              with our expert team in Kigali.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="relative z-10 -mt-20 bg-neutral-50/50 pb-24 lg:pb-40">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
          <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:items-start lg:gap-20">
            {/* Contact Information Sidebar */}
            <div className="lg:sticky lg:top-32">
              <Reveal direction="left" className="p-4">
                <div className="overflow-hidden rounded-[3rem] bg-neutral-950 p-8 text-white shadow-2xl lg:p-12">
                   <div className="flex items-center gap-4">
                      <span className="h-px w-8 bg-brand" />
                      <span className="text-[0.6rem] font-black uppercase tracking-[0.3em] text-brand-light">Kigali Headquarters</span>
                   </div>
                   
                   <h2 className="mt-8 text-4xl font-black tracking-tight">Direct reach.</h2>
                   <p className="mt-6 text-neutral-400 text-lg leading-relaxed">
                     Our reputation is built on transparency. Use the details below for a direct line to our project directors.
                   </p>
                   
                   <div className="mt-12 space-y-10">
                     <ContactItem icon={<MapPin />} label="Global Office" value={company.registeredAddress} />
                     <ContactItem icon={<Phone />} label="Priority Line" value={company.phone} href={company.phoneHref} />
                     <ContactItem icon={<Mail />} label="Project Enquiries" value={company.email} href={company.emailHref} />
                   </div>
                   
                   <div className="mt-16 pt-10 border-t border-white/5 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                         <div className="h-2 w-2 rounded-full bg-brand animate-pulse" />
                         <span className="text-[0.6rem] font-black uppercase tracking-widest text-neutral-500">Currently Open</span>
                      </div>
                      <div className="text-[0.6rem] font-bold text-neutral-500">GMT +2</div>
                   </div>
                </div>
              </Reveal>
            </div>

            {/* Premium Consultation Form */}
            <div className="relative">
              <Reveal delay={0.1} direction="right" className="p-4">
                <div className="rounded-[3rem] border border-black/5 bg-white p-8 shadow-2xl shadow-black/5 lg:p-16">
                  <div className="flex items-center gap-4 mb-10">
                    <MessageSquare className="h-6 w-6 text-brand" />
                    <h3 className="text-xs font-black uppercase tracking-[0.3em] text-neutral-400">Consultation Request</h3>
                  </div>
                  
                  <h2 className="text-[clamp(1.8rem,4vw,3rem)] font-black leading-none tracking-tighter text-neutral-950">
                    Tell us what you <br />
                    are <span className="text-brand">building.</span>
                  </h2>
                  
                  <form
                    className="mt-12 space-y-8"
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
                        toast.success("Consultation request received successfully.");
                        form.reset();
                        setService("");
                      } catch (e) {
                        toast.error(e instanceof Error ? e.message : "Could not send. Try email or phone.");
                      } finally {
                        setSending(false);
                      }
                    }}
                  >
                    <div className="grid gap-8 md:grid-cols-2">
                      <FormGroup label="Full Name" name="name" type="text" placeholder="Isaac Uwumuremyi" required />
                      <FormGroup label="Email Address" name="email" type="email" placeholder="isaac@company.com" required />
                    </div>
                    
                    <div className="grid gap-8 md:grid-cols-2">
                      <FormGroup label="Phone (Optional)" name="phone" type="tel" placeholder="+250 ..." />
                      <div className="flex flex-col gap-3">
                        <span className="text-[0.65rem] font-black uppercase tracking-[0.2em] text-neutral-400">Project Sector</span>
                        <Select value={service || undefined} onValueChange={setService}>
                          <SelectTrigger className="h-[60px] rounded-2xl border-black/5 bg-neutral-50 px-6 font-bold text-neutral-950 shadow-none transition-all focus:ring-4 focus:ring-brand/10">
                            <SelectValue placeholder="Select interest" />
                          </SelectTrigger>
                          <SelectContent className="rounded-2xl border-black/5 bg-white p-2 shadow-2xl">
                            {services.map((s) => (
                              <SelectItem
                                key={s.title}
                                value={s.title}
                                className="rounded-xl py-3 pl-9 pr-3 font-bold text-neutral-900 focus:bg-brand focus:text-white"
                              >
                                {s.title}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="flex flex-col gap-3">
                      <span className="text-[0.65rem] font-black uppercase tracking-[0.2em] text-neutral-400">Project Brief</span>
                      <textarea
                        name="message"
                        rows={4}
                        placeholder="Tell us about location, stage, scope, and timeline..."
                        required
                        className="w-full rounded-[2rem] border-0 bg-neutral-50 p-6 text-base font-bold text-neutral-950 placeholder:text-neutral-400 focus:ring-4 focus:ring-brand/10"
                      />
                    </div>

                    <button 
                      type="submit" 
                      disabled={sending}
                      className="group flex items-center justify-center gap-4 rounded-full bg-neutral-950 px-10 py-5 text-sm font-black uppercase tracking-widest text-white transition-all hover:bg-brand hover:shadow-2xl hover:shadow-brand/20"
                    >
                      {sending ? "Processing..." : "Send Request"}
                      <Send className="h-4 w-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                    </button>
                  </form>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* Modern FAQ Section */}
      <section id="faqs" className="bg-neutral-50 py-24 lg:py-40">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
           <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-12 mb-20">
              <Reveal direction="left" className="max-w-2xl">
                <p className="eyebrow">Project FAQ</p>
                <h2 className="mt-6 text-5xl font-black tracking-tighter text-neutral-950">Common <span className="text-neutral-400">Inquiries.</span></h2>
              </Reveal>
           </div>

           <div className="grid gap-6 lg:grid-cols-2">
             {[
               {
                 q: "What information should I share for a first consultation?",
                 a: "Share the project location, intended use, current stage, size, timeline, and budget status."
               },
               {
                 q: "Do you provide quantity surveying outside Kigali?",
                 a: "Yes. We serve clients across Rwanda, East Africa, and support international project delivery needs."
               },
               {
                 q: "Can T&W Quantus manage full construction execution?",
                 a: "Absolutely. We manage everything from site mobilization to quality assurance and final handover."
               },
               {
                 q: "How quickly can I get a response?",
                 a: "We prioritize all project inquiries and typically respond within 24 business hours."
               }
             ].map((item, i) => (
               <Reveal key={i} delay={i * 0.1} direction="up">
                  <div className="group rounded-[2.5rem] border border-black/5 bg-white p-8 transition-all duration-500 hover:shadow-2xl hover:shadow-black/5">
                     <h3 className="text-xl font-black tracking-tight text-neutral-950 group-hover:text-brand transition-colors">{item.q}</h3>
                     <p className="mt-6 text-base leading-relaxed text-neutral-600 antialiased">{item.a}</p>
                  </div>
               </Reveal>
             ))}
           </div>
        </div>
      </section>
    </Layout>
  );
}

function FormGroup({ label, name, type, placeholder, required }: { label: string, name: string, type: string, placeholder: string, required?: boolean }) {
  return (
    <div className="flex flex-col gap-3">
      <span className="text-[0.65rem] font-black uppercase tracking-[0.2em] text-neutral-400">{label}</span>
      <input 
        type={type} 
        name={name} 
        placeholder={placeholder} 
        required={required}
        className="h-[60px] w-full rounded-2xl border-0 bg-neutral-50 px-6 text-base font-bold text-neutral-950 placeholder:text-neutral-400 transition-all focus:ring-4 focus:ring-brand/10"
      />
    </div>
  );
}

function ContactItem({ icon, label, value, href }: { icon: JSX.Element, label: string, value: string, href?: string }) {
  const content = (
    <div className="flex gap-6 group">
      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-brand transition-all duration-500 group-hover:bg-brand group-hover:text-white">
        {icon}
      </div>
      <div>
        <span className="text-[0.6rem] font-black uppercase tracking-[0.3em] text-neutral-500">{label}</span>
        <span className="mt-1 block text-lg font-bold transition-colors group-hover:text-brand-light">{value}</span>
      </div>
    </div>
  );

  return href ? (
    <a href={href} className="block transition-all">
      {content}
    </a>
  ) : (
    <div>{content}</div>
  );
}
