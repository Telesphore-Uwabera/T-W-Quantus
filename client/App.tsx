import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { FloatingContactButton } from "./components/site/FloatingContactButton";
import { lazy, Suspense, useEffect } from "react";

const Index = lazy(() => import("./pages/Index"));
const About = lazy(() => import("./pages/About"));
const Services = lazy(() => import("./pages/Services"));
const ServiceDetail = lazy(() => import("./pages/ServiceDetail"));
const Projects = lazy(() => import("./pages/Projects"));
const ProjectDetail = lazy(() => import("./pages/ProjectDetail"));
const Perspectives = lazy(() => import("./pages/Perspectives"));
const PerspectiveDetail = lazy(() => import("./pages/PerspectiveDetail"));
const Contact = lazy(() => import("./pages/Contact"));
const NotFound = lazy(() => import("./pages/NotFound"));
const Admin = lazy(() => import("./pages/Admin"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 0, // Data is always stale, refetch on every access
      gcTime: 60 * 60 * 1000, // 60 minutes — keep unused data in memory longer
      retry: 3, // retry three times on failure
      retryDelay: 1000, // wait 1s before retrying
      refetchOnWindowFocus: true,
      refetchOnReconnect: true,
      refetchOnMount: true,
      networkMode: 'always', // Always attempt to fetch, even if offline
    },
  },
});

/* ── Prefetch critical data on app boot ────────────────────────────── */
/* All three queries fire in parallel immediately, so data is already   */
/* cached before the user finishes reading the hero section.            */
import { fetchPublishedProjects, fetchPublishedPerspectives, fetchServiceNews } from "@/lib/api";

queryClient.prefetchQuery({ queryKey: ["projects", "published", "home"], queryFn: fetchPublishedProjects });
queryClient.prefetchQuery({ queryKey: ["perspectives", "public"], queryFn: fetchPublishedPerspectives });
queryClient.prefetchQuery({ queryKey: ["news", "services", "home"], queryFn: () => fetchServiceNews() });

function AnimatedRoutes() {
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      window.setTimeout(() => {
        document
          .getElementById(location.hash.replace("#", ""))
          ?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 120);
      return;
    }

    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [location.pathname, location.hash]);

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      >
        <Suspense fallback={<PageLoader />}>
          <Routes location={location}>
            <Route path="/" element={<Index />} />
            <Route path="/about" element={<About />} />
            <Route path="/services" element={<Services />} />
            <Route path="/services/:slug" element={<ServiceDetail />} />
            <Route path="/projects/:slug" element={<ProjectDetail />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/perspectives" element={<Perspectives />} />
            <Route path="/perspectives/:slug" element={<PerspectiveDetail />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/admin" element={<Admin />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </motion.div>
    </AnimatePresence>
  );
}

function PageLoader() {
  return (
    <div className="grid min-h-screen place-items-center bg-neutral-950 text-white">
      <motion.div
        className="h-16 w-16 rounded-full border-2 border-brand-light border-t-transparent"
        animate={{ rotate: 360 }}
        transition={{ duration: 0.9, repeat: Infinity, ease: "linear" }}
      />
    </div>
  );
}

function Shell() {
  const location = useLocation();
  const hideFloating = location.pathname.startsWith("/admin");

  // Prefetch data on route prediction
  useEffect(() => {
    if (location.pathname === "/") {
      // Prefetch projects and perspectives when on home page
      queryClient.prefetchQuery({ queryKey: ["projects", "published", "home"], queryFn: fetchPublishedProjects });
      queryClient.prefetchQuery({ queryKey: ["perspectives", "public"], queryFn: fetchPublishedPerspectives });
    }
  }, [location.pathname]);

  return (
    <>
      <AnimatedRoutes />
      {!hideFloating && <FloatingContactButton />}
    </>
  );
}

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Shell />
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

createRoot(document.getElementById("root")!).render(<App />);
