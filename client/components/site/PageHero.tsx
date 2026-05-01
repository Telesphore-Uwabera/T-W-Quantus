import { motion } from "framer-motion";
import { Reveal } from "./Reveal";

type PageHeroProps = {
  eyebrow: string;
  title: string;
  description: string;
};

export function PageHero({ eyebrow, title, description }: PageHeroProps) {
  return (
    <section data-header-theme="dark" className="relative overflow-hidden bg-neutral-950 px-5 pb-20 pt-36 text-white md:px-8 md:pb-28 md:pt-44">
      <motion.div
        className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(23,102,106,0.35),transparent_32%),linear-gradient(135deg,rgba(255,255,255,0.08),transparent_45%)]"
        initial={{ scale: 1.08, opacity: 0.5 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
      />
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-brand-light to-transparent" />
      <Reveal className="relative mx-auto max-w-5xl" direction="scale">
        <p className="eyebrow text-brand-light">{eyebrow}</p>
        <h1 className="mt-5 max-w-4xl text-5xl font-black tracking-tight md:text-7xl">
          {title}
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-8 text-neutral-300 md:text-xl">
          {description}
        </p>
      </Reveal>
    </section>
  );
}
