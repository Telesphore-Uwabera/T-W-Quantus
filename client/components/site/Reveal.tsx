import { motion } from "framer-motion";
import type { ReactNode } from "react";

type RevealProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  direction?: "up" | "left" | "right" | "scale";
};

const directions = {
  up: { opacity: 0, y: 34, filter: "blur(10px)" },
  left: { opacity: 0, x: -36, filter: "blur(10px)" },
  right: { opacity: 0, x: 36, filter: "blur(10px)" },
  scale: { opacity: 0, scale: 0.94, filter: "blur(10px)" },
};

export function Reveal({ children, className, delay = 0, direction = "up" }: RevealProps) {
  return (
    <motion.div
      className={className}
      initial={directions[direction]}
      whileInView={{ opacity: 1, x: 0, y: 0, scale: 1, filter: "blur(0px)" }}
      viewport={{ once: true, amount: 0.24, margin: "0px 0px -8% 0px" }}
      transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1], delay }}
    >
      {children}
    </motion.div>
  );
}
