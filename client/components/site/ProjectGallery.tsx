import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { useEffect, useState } from "react";

type ProjectGalleryProps = {
  images: string[];
  title: string;
};

export function ProjectGallery({ images, title }: ProjectGalleryProps) {
  const [index, setIndex] = useState(0);
  const [lightbox, setLightbox] = useState(false);
  const n = images.length;
  const safeIndex = n === 0 ? 0 : ((index % n) + n) % n;

  useEffect(() => {
    setIndex((i) => (n === 0 ? 0 : Math.min(i, n - 1)));
  }, [n]);

  useEffect(() => {
    if (lightbox) {
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = "";
      };
    }
  }, [lightbox]);

  useEffect(() => {
    if (!lightbox || n === 0) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightbox(false);
      if (e.key === "ArrowLeft") setIndex((i) => (i - 1 + n) % n);
      if (e.key === "ArrowRight") setIndex((i) => (i + 1) % n);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightbox, n]);

  if (n === 0) return null;

  const go = (delta: number) => {
    setIndex((i) => (i + delta + n) % n);
  };

  const navBtnClass =
    "absolute top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-black/55 text-white shadow-lg backdrop-blur transition hover:bg-black/75 focus:outline-none focus-visible:ring-2 focus-visible:ring-white";

  return (
    <>
      <div className="relative overflow-hidden rounded-[1.5rem] bg-neutral-100 ring-1 ring-black/5 sm:rounded-[2rem]">
        <div className="relative aspect-[16/10] w-full">
          <button type="button" className={`${navBtnClass} left-3 sm:left-4`} onClick={() => go(-1)} aria-label="Previous image">
            <ChevronLeft className="h-7 w-7" strokeWidth={2.25} />
          </button>
          <button type="button" className={`${navBtnClass} right-3 sm:right-4`} onClick={() => go(1)} aria-label="Next image">
            <ChevronRight className="h-7 w-7" strokeWidth={2.25} />
          </button>
          <button
            type="button"
            className="block h-full w-full cursor-zoom-in"
            onClick={() => setLightbox(true)}
            aria-label={`Open image ${safeIndex + 1} of ${n} fullscreen`}
          >
            <img 
              src={images[safeIndex]} 
              alt={`${title} - Project delivery in Rwanda and East Africa by T&W Quantus LTD - Construction, Quantity Surveying, Cost Management, and Project Management. Imirimo y'ubwubatsi n'ibarura rimbura-mushinga mu Rwanda.`} 
              className="h-full w-full object-cover" 
            />
          </button>
          <div className="pointer-events-none absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-black/55 px-3 py-1.5 text-xs font-bold text-white backdrop-blur">
            {safeIndex + 1} / {n}
          </div>
        </div>
      </div>

      {lightbox ? (
        <div
          className="fixed inset-0 z-[200] flex items-center justify-center bg-black/95 p-4"
          role="dialog"
          aria-modal="true"
          aria-label={`${title} — image gallery`}
        >
          <button
            type="button"
            className="absolute right-4 top-4 z-20 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
            onClick={() => setLightbox(false)}
            aria-label="Close fullscreen"
          >
            <X className="h-7 w-7" strokeWidth={2} />
          </button>
          <button
            type="button"
            className={`${navBtnClass} left-2 sm:left-6`}
            onClick={() => go(-1)}
            aria-label="Previous image"
          >
            <ChevronLeft className="h-8 w-8" strokeWidth={2.25} />
          </button>
          <button
            type="button"
            className={`${navBtnClass} right-2 sm:right-6`}
            onClick={() => go(1)}
            aria-label="Next image"
          >
            <ChevronRight className="h-8 w-8" strokeWidth={2.25} />
          </button>
          <div className="flex max-h-full max-w-full items-center justify-center px-14 sm:px-20">
            <img
              src={images[safeIndex]}
              alt={`${title} - Fullscreen view of project works by T&W Quantus LTD. Professional construction and technical services in Kigali. Ubunyamwuga mu bwubatsi.`}
              className="max-h-[calc(100vh-3rem)] max-w-full object-contain"
            />
          </div>
          <div className="pointer-events-none absolute bottom-6 left-1/2 -translate-x-1/2 rounded-full bg-white/10 px-4 py-2 text-sm font-bold text-white backdrop-blur">
            {safeIndex + 1} / {n}
          </div>
        </div>
      ) : null}
    </>
  );
}
