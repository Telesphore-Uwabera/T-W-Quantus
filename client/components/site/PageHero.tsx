import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { Reveal } from "./Reveal";
import { cn } from "@/lib/utils";

type PageHeroProps = {
  eyebrow: string;
  title: string;
  description: string;
  visual?: "about" | "services" | "projects" | "contact";
};

export function PageHero({ eyebrow, title, description, visual = "services" }: PageHeroProps) {
  return (
    <section data-header-theme="dark" className="relative overflow-hidden bg-neutral-950 px-4 pb-16 pt-32 text-white sm:px-6 md:px-8 md:pb-28 md:pt-44">
      <motion.div
        className={cn("page-hero-visual absolute inset-0", `page-hero-${visual}`)}
        initial={{ scale: 1.08, opacity: 0.5 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/54 to-black/26" />
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-brand-light to-transparent" />
      <Reveal className="relative mx-auto max-w-5xl" direction="scale">
        <Link
          to="/"
          className="mb-8 inline-flex items-center gap-3 text-xs font-black uppercase tracking-[0.18em] text-white/70 transition hover:text-brand-light sm:mb-10 sm:tracking-[0.2em]"
        >
          <ArrowLeft className="h-4 w-4 text-brand-light" />
          Back to Home
        </Link>
        <p className="eyebrow text-brand-light">{eyebrow}</p>
        <h1 className="mt-5 max-w-4xl text-[clamp(2.35rem,6vw,4.75rem)] font-black leading-[1.02] tracking-tight">
          {title}
        </h1>
        <p className="mt-5 max-w-2xl text-base leading-7 text-neutral-300 sm:mt-6 md:text-xl md:leading-8">
          {description}
        </p>
      </Reveal>
    </section>
  );
}
