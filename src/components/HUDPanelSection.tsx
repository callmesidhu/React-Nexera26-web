import { useRef } from "react";
import { motion, useScroll, useTransform, useSpring, useInView } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Cpu, Zap, Calendar, Users, ArrowRight } from "lucide-react";

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
    <section ref={containerRef} className="relative py-32 overflow-hidden">
      <div className="container mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <span className="text-accent text-sm uppercase tracking-widest font-display">
            [ System Modules ]
          </span>
          <h2 className="text-4xl md:text-5xl font-display mt-4">
            The NEXERA Experience
          </h2>
        </motion.div>

        {/* Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {panels.map((panel, index) => {
            // Apply different directions based on index (Even = Down, Odd = Up)
            const yValue = index % 2 === 0 ? smoothYDown : smoothYUp;

            return (
              <motion.div
                key={panel.code}
                onClick={() => navigate(panel.path)}
                // 4. APPLY PARALLAX HERE
                style={{ y: yValue }} 
                // Only animate opacity, do not animate 'y' or it breaks parallax
                initial={{ opacity: 0 }}
                animate={isInView ? { opacity: 1 } : {}}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                className="group relative hud-border hud-glow bg-card/50 p-6 backdrop-blur-sm flex flex-col h-full cursor-pointer overflow-hidden rounded-xl border border-white/5"
              >
                {/* Background Hover Effect */}
                <div className="absolute inset-0 bg-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                {/* Corner Accents */}
                <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-accent/50 opacity-0 group-hover:opacity-100 transition-all duration-300" />
                <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-accent/50 opacity-0 group-hover:opacity-100 transition-all duration-300" />

                {/* Code Tag */}
                <div className="absolute top-4 right-4">
                  <span className="text-[10px] md:text-xs text-muted-foreground font-mono group-hover:text-accent transition-colors border border-white/10 px-2 py-1 rounded">
                    {panel.code}
                  </span>
                </div>

                {/* Icon */}
                <div className="mb-6 mt-2 relative z-10">
                  <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center group-hover:bg-accent/20 transition-colors duration-300">
                    <panel.icon
                      className="w-6 h-6 text-accent group-hover:scale-110 transition-transform duration-300"
                      strokeWidth={1.5}
                    />
                  </div>
                </div>

                {/* Content */}
                <div className="relative z-10 flex-grow">
                  <h3 className="text-xl font-display mb-3 text-foreground group-hover:text-accent transition-colors">
                    {panel.title}
                  </h3>
                  <p className="text-sm text-muted-foreground font-body leading-relaxed group-hover:text-gray-300 transition-colors">
                    {panel.description}
                  </p>
                </div>

                {/* Action Link */}
                <div className="mt-8 pt-4 border-t border-white/10 relative z-10">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-accent uppercase tracking-wider font-bold flex items-center gap-2 group-hover:gap-3 transition-all">
                      {panel.action} <ArrowRight className="w-3 h-3" />
                    </span>
                    <div className="w-1.5 h-1.5 bg-accent rounded-full animate-pulse shadow-[0_0_8px_rgba(255,100,0,0.8)]" />
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