import { useRef } from "react";
import { motion, useScroll, useTransform, useSpring, useInView } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Cpu, Zap, Calendar, Users, ArrowRight } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

const panels = [
  {
    icon: Cpu,
    title: "Workshops",
    description: "Deep dive into Industrial Automation, IoT, and Robotics with hands-on training.",
    code: "WKS-001",
    action: "Explore Modules",
    path: "/programs",
  },
  {
    icon: Zap,
    title: "Competitions",
    description: "Battle for supremacy in RoboWars, Line Follower, and Coding challenges.",
    code: "CMP-002",
    action: "View Challenges",
    path: "/programs", // Both Workshops & Competitions live in Programs.tsx
  },
  {
    icon: Calendar,
    title: "Events",
    description: "Hackathons, Guest Lectures, and fun activities designed to spark innovation.",
    code: "EVT-003",
    action: "See Schedule",
    path: "/events",
  },
  {
    icon: Users,
    title: "Teams",
    description: "Meet the brilliant minds and faculty coordinators behind NEXERA.",
    code: "TEA-004",
    action: "Meet the Squad",
    path: "/team",
  },
];

const HUDPanelSection = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: "-100px" });
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  // 1. Track Scroll Progress
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  // 2. Parallax Configurations
  // Column 1 & 3 move UP (-75px)
  const yUp = useTransform(scrollYProgress, [0, 1], [0, -75]);
  // Column 2 & 4 move DOWN (+75px)
  const yDown = useTransform(scrollYProgress, [0, 1], [0, 75]);
  
  // 3. Smooth Physics
  const springConfig = { stiffness: 100, damping: 30, restDelta: 0.001 };
  const smoothYUp = useSpring(yUp, springConfig);
  const smoothYDown = useSpring(yDown, springConfig);

  return (
    <section ref={containerRef} className="relative flex min-h-screen items-center overflow-hidden py-16 md:py-32">
      <div className="container mx-auto max-w-6xl px-4 sm:px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-10 text-center md:mb-20"
        >
          <span className="text-[10px] uppercase tracking-[0.35em] text-accent sm:text-xs md:text-sm font-display">
            [ System Modules ]
          </span>
          <h2 className="mt-3 text-3xl leading-none sm:text-4xl md:mt-4 md:text-5xl font-display">
            The NEXERA Experience
          </h2>
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-2 md:gap-6 lg:grid-cols-4">
          {panels.map((panel, index) => {
            // Apply different directions based on index (Even = Down, Odd = Up)
            const yValue = index % 2 === 0 ? smoothYDown : smoothYUp;

            return (
              <motion.div
                key={panel.code}
                onClick={() => navigate(panel.path)}
                // 4. APPLY PARALLAX HERE
                style={{ y: isMobile ? 0 : yValue }} 
                // Only animate opacity, do not animate 'y' or it breaks parallax
                initial={{ opacity: 0 }}
                animate={isInView ? { opacity: 1 } : {}}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                className="group relative flex h-full min-h-[210px] cursor-pointer flex-col overflow-hidden rounded-xl border border-white/5 bg-card/50 p-4 backdrop-blur-sm hud-border hud-glow sm:min-h-[230px] sm:p-5 md:min-h-[280px] md:p-6"
              >
                {/* Background Hover Effect */}
                <div className="absolute inset-0 bg-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                {/* Corner Accents */}
                <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-accent/50 opacity-0 group-hover:opacity-100 transition-all duration-300" />
                <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-accent/50 opacity-0 group-hover:opacity-100 transition-all duration-300" />

                {/* Code Tag */}
                <div className="absolute right-3 top-3 md:right-4 md:top-4">
                  <span className="rounded border border-white/10 px-2 py-1 font-mono text-[9px] text-muted-foreground transition-colors group-hover:text-accent sm:text-[10px] md:text-xs">
                    {panel.code}
                  </span>
                </div>

                {/* Icon */}
                <div className="relative z-10 mb-4 mt-1 md:mb-6 md:mt-2">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10 transition-colors duration-300 group-hover:bg-accent/20 md:h-12 md:w-12">
                    <panel.icon
                      className="h-5 w-5 text-accent transition-transform duration-300 group-hover:scale-110 md:h-6 md:w-6"
                      strokeWidth={1.5}
                    />
                  </div>
                </div>

                {/* Content */}
                <div className="relative z-10 flex-grow">
                  <h3 className="mb-2 text-base text-foreground transition-colors group-hover:text-accent sm:text-lg md:mb-3 md:text-xl font-display">
                    {panel.title}
                  </h3>
                  <p className="font-body text-[11px] leading-snug text-muted-foreground transition-colors group-hover:text-gray-300 sm:text-xs md:text-sm md:leading-relaxed">
                    {panel.description}
                  </p>
                </div>

                {/* Action Link */}
                <div className="relative z-10 mt-4 border-t border-white/10 pt-3 md:mt-8 md:pt-4">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-accent transition-all group-hover:gap-2 sm:text-[11px] md:gap-2 md:text-xs md:tracking-wider">
                      {panel.action} <ArrowRight className="h-3 w-3" />
                    </span>
                    <div className="h-1.5 w-1.5 rounded-full bg-accent shadow-[0_0_8px_rgba(255,100,0,0.8)] animate-pulse" />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default HUDPanelSection;