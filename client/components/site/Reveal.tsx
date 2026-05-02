import { motion, useAnimationControls, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";

type RevealProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  direction?: "up" | "down" | "left" | "right" | "scale" | "zoom" | "rotate" | "skew" | "clip";
  amount?: number;
};

type ScrollDirection = "up" | "down";

const directions = {
  up: { opacity: 0.65, y: 34, filter: "blur(10px)" },
  down: { opacity: 0.65, y: -34, filter: "blur(10px)" },
  left: { opacity: 0.65, x: -36, filter: "blur(10px)" },
  right: { opacity: 0.65, x: 36, filter: "blur(10px)" },
  scale: { opacity: 0.65, scale: 0.94, filter: "blur(10px)" },
  zoom: { opacity: 0.65, scale: 1.08, filter: "blur(12px)" },
  rotate: { opacity: 0.65, y: 30, rotate: -2.5, filter: "blur(10px)" },
  skew: { opacity: 0.65, y: 30, skewY: 2.5, filter: "blur(10px)" },
  clip: { opacity: 0.65, y: 24, clipPath: "inset(0 0 18% 0)", filter: "blur(8px)" },
};

const reverseDirections = {
  up: directions.down,
  down: directions.up,
  left: directions.right,
  right: directions.left,
  scale: directions.zoom,
  zoom: directions.scale,
  rotate: { opacity: 0.65, y: -30, rotate: 2.5, filter: "blur(10px)" },
  skew: { opacity: 0.65, y: -30, skewY: -2.5, filter: "blur(10px)" },
  clip: { opacity: 0.65, y: -24, clipPath: "inset(18% 0 0 0)", filter: "blur(8px)" },
};

const leaveStates = {
  up: { opacity: 0.78, y: -18, scale: 0.985, filter: "blur(4px)" },
  down: { opacity: 0.78, y: 18, scale: 0.985, filter: "blur(4px)" },
};

function useScrollDirection() {
  const [scrollDirection, setScrollDirection] = useState<ScrollDirection>("down");
  const lastScrollY = useRef(0);

  useEffect(() => {
    lastScrollY.current = window.scrollY;

    const onScroll = () => {
      const currentScrollY = window.scrollY;
      if (Math.abs(currentScrollY - lastScrollY.current) < 6) return;

      setScrollDirection(currentScrollY > lastScrollY.current ? "down" : "up");
      lastScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return scrollDirection;
}

export function Reveal({
  children,
  className,
  delay = 0,
  direction = "up",
  amount = 0.24,
}: RevealProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const controls = useAnimationControls();
  const scrollDirection = useScrollDirection();
  const isInView = useInView(ref, { amount, margin: "0px 0px -8% 0px" });

  useEffect(() => {
    if (isInView) {
      controls.start({
        opacity: 1,
        x: 0,
        y: 0,
        scale: 1,
        rotate: 0,
        skewY: 0,
        clipPath: "inset(0 0 0% 0)",
        filter: "blur(0px)",
        transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1], delay },
      });
      return;
    }

    controls.start({
      ...leaveStates[scrollDirection],
      transition: { duration: 0.48, ease: "easeOut" },
    });
  }, [controls, delay, isInView, scrollDirection]);

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={scrollDirection === "up" ? reverseDirections[direction] : directions[direction]}
      animate={controls}
      style={{ willChange: "transform, opacity, filter" }}
    >
      {children}
    </motion.div>
  );
}
