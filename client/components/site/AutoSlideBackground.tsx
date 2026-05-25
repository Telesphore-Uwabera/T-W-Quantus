import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface AutoSlideBackgroundProps {
  images: string[];
  visualClass?: string;
  intervalMs?: number;
  className?: string;
  showControls?: boolean;
}

export function AutoSlideBackground({
  images,
  visualClass,
  intervalMs = 3000,
  className,
  showControls = false,
}: AutoSlideBackgroundProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const startTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (!images || images.length <= 1) return;

    timerRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, intervalMs);
  };

  useEffect(() => {
    startTimer();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [images, intervalMs]);

  const handlePrev = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!images || images.length <= 1) return;
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
    startTimer();
  };

  const handleNext = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!images || images.length <= 1) return;
    setCurrentIndex((prev) => (prev + 1) % images.length);
    startTimer();
  };

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

      {showControls && validImages.length > 1 && (
        <div className="absolute inset-0 flex items-center justify-between px-4 pointer-events-none">
          <button
            onClick={handlePrev}
            className="p-2 rounded-full bg-black/40 text-white hover:bg-black/60 transition pointer-events-auto backdrop-blur-sm"
            aria-label="Previous image"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <button
            onClick={handleNext}
            className="p-2 rounded-full bg-black/40 text-white hover:bg-black/60 transition pointer-events-auto backdrop-blur-sm"
            aria-label="Next image"
          >
            <ChevronRight className="h-6 w-6" />
          </button>

          {/* Dots Indicator */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 pointer-events-auto bg-black/20 px-3 py-1.5 rounded-full backdrop-blur-sm">
            {validImages.map((_, idx) => (
              <button
                key={idx}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setCurrentIndex(idx);
                  startTimer();
                }}
                className={cn(
                  "h-1.5 w-1.5 rounded-full transition-all duration-300",
                  idx === currentIndex ? "bg-white w-3" : "bg-white/40"
                )}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
