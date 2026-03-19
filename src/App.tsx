import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import SplashScreen from "@/components/SplashScreen";
import Index from "./pages/Index";
import Programs from "./pages/Programs";
import Events from "./pages/Events";
import Team from "./pages/Team";
import About from "./pages/About";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

gsap.registerPlugin(ScrollTrigger);

/* ---------------------------------------
   Smooth Scroll Wrapper (Lenis + GSAP Sync)
--------------------------------------- */

const SmoothScroll = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });
    (window as typeof window & { lenis?: Lenis }).lenis = lenis;

    // Sync Lenis scroll with ScrollTrigger
    lenis.on("scroll", ScrollTrigger.update);

    // GSAP ticker drives Lenis
    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });

    gsap.ticker.lagSmoothing(0);

    // 🔥 CRITICAL: scrollerProxy
    ScrollTrigger.scrollerProxy(document.body, {
      scrollTop(value) {
        if (arguments.length) {
          lenis.scrollTo(value);
        }
        return window.scrollY;
      },
      getBoundingClientRect() {
        return {
          top: 0,
          left: 0,
          width: window.innerWidth,
          height: window.innerHeight,
        };
      },
    });

    ScrollTrigger.refresh();

    return () => {
      delete (window as typeof window & { lenis?: Lenis }).lenis;
      lenis.destroy();
      ScrollTrigger.killAll();
    };
  }, []);

  useEffect(() => {
    // Keep route navigation consistent by forcing top position in both native and Lenis scroll states.
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    const raf = requestAnimationFrame(() => {
      const lenisScroller = (window as typeof window & { lenis?: Lenis }).lenis;
      lenisScroller?.scrollTo(0, { immediate: true, force: true });
      ScrollTrigger.refresh();
    });

    return () => cancelAnimationFrame(raf);
  }, [location.key]);

  return <>{children}</>;
};

/* ---------------------------------------
   Animated Routes
--------------------------------------- */

const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Index />} />
        <Route path="/programs" element={<Programs />} />
        <Route path="/events" element={<Events />} />
        <Route path="/team" element={<Team />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AnimatePresence>
  );
};

/* ---------------------------------------
   App Root
--------------------------------------- */

const App = () => { 

  const [splashDone, setSplashDone] = useState(false);

  return(
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        {!splashDone && (
            <SplashScreen onComplete={() => setSplashDone(true)} />
        )}
        <BrowserRouter>
          <SmoothScroll>
            <AnimatedRoutes />
          </SmoothScroll>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;