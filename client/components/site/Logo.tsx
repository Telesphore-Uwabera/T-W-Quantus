import { Link } from "react-router-dom";
import { company } from "@/data/site";
import { cn } from "@/lib/utils";

type LogoProps = {
  className?: string;
  compact?: boolean;
  inverted?: boolean;
};

export function Logo({ className, compact = false, inverted = false }: LogoProps) {
  return (
    <Link to="/" className={cn("group flex items-center gap-3", className)}>
      <span className="logo-cloud grid h-16 w-16 place-items-center transition group-hover:scale-105">
        <img
          src={company.logo}
          alt={`${company.name} logo`}
          className="relative z-10 h-14 w-14 object-contain"
        />
      </span>
      {!compact && (
        <span className="leading-none">
          <span
            className={cn(
              "block text-sm font-black tracking-[0.22em]",
              inverted ? "text-white" : "text-neutral-950",
            )}
          >
            T&W QUANTUS
          </span>
          <span className="mt-1 block text-[11px] font-semibold uppercase tracking-[0.18em] text-brand">
            {company.slogan}
          </span>
        </span>
      )}
    </Link>
  );
}
