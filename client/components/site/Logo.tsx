import { Link } from "react-router-dom";
import { company } from "@/data/site";
import { cn } from "@/lib/utils";

type LogoProps = {
  className?: string;
  compact?: boolean;
  inverted?: boolean;
  showSlogan?: boolean;
  /** Stack logo above wordmark on narrow screens (e.g. footer) so long slogans stay one line. */
  stackOnSmall?: boolean;
};

export function Logo({
  className,
  compact = false,
  inverted = false,
  showSlogan = true,
  stackOnSmall = false,
}: LogoProps) {
  return (
    <Link
      to="/"
      className={cn(
        "group flex items-center gap-3",
        stackOnSmall && "max-sm:flex-col max-sm:items-start max-sm:gap-2",
        className,
      )}
    >
      <span className="logo-cloud grid h-16 w-16 place-items-center transition group-hover:scale-105 sm:h-20 sm:w-20 lg:h-24 lg:w-24">
        <img
          src={company.logo}
          alt={`${company.name} logo - Construction, Quantity Surveying, Cost Management, & Project Management in Kigali, Rwanda | Ubwubatsi, Ibarura rimbura-mushinga, Icunga-mushinga mu Rwanda`}
          className="relative z-10 h-12 w-12 object-contain sm:h-16 sm:w-16 lg:h-20 lg:w-20"
        />
      </span>
      {!compact && (
        <span className="min-w-0 leading-none">
          <span
            className={cn(
              "block text-sm font-black tracking-[0.22em]",
              inverted ? "text-white" : "text-neutral-950",
            )}
          >
            T&W QUANTUS
          </span>
          {showSlogan && (
            <span className="mt-1 block whitespace-nowrap text-[clamp(0.5rem,calc(0.32rem+1.65vw),0.6875rem)] font-semibold uppercase leading-none tracking-[0.1em] text-brand sm:tracking-[0.18em]">
              {company.slogan}
            </span>
          )}
        </span>
      )}
    </Link>
  );
}
