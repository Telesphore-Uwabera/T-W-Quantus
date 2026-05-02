import { motion } from "framer-motion";
import { Rocket } from "lucide-react";
import { Link } from "react-router-dom";

export function FloatingContactButton() {
  return (
    <motion.div
      className="fixed bottom-24 right-5 z-[2147483647] sm:bottom-8 md:bottom-12 md:right-8"
      animate={{ y: [0, -10, 0], rotate: [0, -3, 0, 3, 0] }}
      transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
    >
      <Link
        to="/contact"
        aria-label="Contact T&W Quantus"
        className="grid h-14 w-14 place-items-center rounded-full bg-brand text-white shadow-2xl shadow-brand/50 ring-[10px] ring-brand/15 transition hover:scale-110 hover:bg-brand-light hover:ring-brand/25 focus:outline-none focus:ring-brand/30 md:h-16 md:w-16 md:ring-[14px]"
      >
        <Rocket className="h-5 w-5 md:h-6 md:w-6" />
      </Link>
    </motion.div>
  );
}
