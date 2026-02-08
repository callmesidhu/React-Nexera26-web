import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Cpu, Zap, Target, Shield } from "lucide-react";

const panels = [
  {
    icon: Cpu,
    title: "Tech Workshops",
    description: "Hands-on sessions with cutting-edge industrial tools",
    code: "WKS-001",
  },
  {
    icon: Zap,
    title: "Competitions",
    description: "Battle for supremacy in engineering challenges",
    code: "CMP-002",
  },
  {
    icon: Target,
    title: "Hackathons",
    description: "48-hour coding sprints for real-world solutions",
    code: "HCK-003",
  },
  {
    icon: Shield,
    title: "Guest Lectures",
    description: "Industry leaders sharing battlefield insights",
    code: "LEC-004",
  },
];

const HUDPanelSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  return (
    <section ref={sectionRef} className="relative py-32 overflow-hidden">
      <div className="container mx-auto px-6">
        {/* Section header */}
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

        {/* HUD Panels Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {panels.map((panel, index) => (
            <motion.div
              key={panel.code}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="group relative hud-border hud-glow bg-card/50 p-6 backdrop-blur-sm"
            >
              {/* Corner accents */}
              <div className="absolute top-0 right-0 w-8 h-8 border-t border-r border-accent/50 opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="absolute bottom-0 left-0 w-8 h-8 border-b border-l border-accent/50 opacity-0 group-hover:opacity-100 transition-opacity" />
              
              {/* Code tag */}
              <div className="absolute top-2 right-2">
                <span className="text-xs text-muted-foreground font-mono">{panel.code}</span>
              </div>

              {/* Icon */}
              <div className="mb-6">
                <panel.icon className="w-10 h-10 text-accent" strokeWidth={1.5} />
              </div>

              {/* Content */}
              <h3 className="text-lg font-display mb-2">{panel.title}</h3>
              <p className="text-sm text-muted-foreground font-body">{panel.description}</p>

              {/* Bottom bar */}
              <div className="mt-6 pt-4 border-t border-border">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-accent uppercase tracking-wider">Active</span>
                  <div className="w-2 h-2 bg-accent rounded-full animate-pulse" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HUDPanelSection;
