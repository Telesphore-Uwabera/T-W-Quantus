import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface AutoSlideBackgroundProps {
  images: string[];
  visualClass?: string;
  intervalMs?: number;
  className?: string;
}

export function AutoSlideBackground({
  images,
  visualClass,
  intervalMs = 3000,
  className,
}: AutoSlideBackgroundProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!images || images.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, intervalMs);

    return () => clearInterval(timer);
  }, [images, intervalMs]);

  const validImages = images?.filter(Boolean) || [];

  if (validImages.length === 0) {
    return (
      <div
        className={cn(
          "absolute inset-0 bg-cover bg-center transition-transform duration-[2s] group-hover:scale-110",
          visualClass,
          className
        )}
      />
    );
  }

  return (
    <div className={cn("absolute inset-0 overflow-hidden", className)}>
      <AnimatePresence mode="popLayout">
        <motion.div
          key={currentIndex}
          className={cn(
            "absolute inset-0 bg-cover bg-center transition-transform duration-[2s] group-hover:scale-110"
          )}
          style={{ backgroundImage: `url(${validImages[currentIndex]})` }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: "easeInOut" }}
        />
      </AnimatePresence>
    </div>
  );
}
