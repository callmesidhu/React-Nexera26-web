import { useEffect, useRef } from "react";
import { motion, useInView } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const VisionSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".vision-line",
        { scaleX: 0 },
        {
          scaleX: 1,
          duration: 1.5,
          stagger: 0.2,
          ease: "power4.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative py-32 md:py-48 overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 grid-overlay opacity-50" />
      
      {/* Parallax layers */}
      <motion.div
        style={{ y: isInView ? 0 : 50 }}
        className="absolute top-20 left-10 w-32 h-32 border border-accent/20 rotate-45"
      />
      <motion.div
        style={{ y: isInView ? 0 : -50 }}
        className="absolute bottom-20 right-10 w-48 h-48 border border-accent/10 rotate-12"
      />

      <div className="container mx-auto px-6">
        <div className="max-w-5xl mx-auto">
          {/* Section label */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="flex items-center gap-4 mb-12"
          >
            <div className="w-12 h-px bg-accent" />
            <span className="text-accent text-sm uppercase tracking-widest font-display">Our Vision</span>
          </motion.div>

          {/* Main text */}
          <div className="space-y-8">
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-4xl md:text-6xl lg:text-7xl font-display leading-tight"
            >
              Where <span className="text-accent">Innovation</span> Meets
            </motion.h2>
            
            <div className="vision-line h-px bg-border origin-left" />
            
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-4xl md:text-6xl lg:text-7xl font-display leading-tight text-right"
            >
              Industrial <span className="text-accent">Excellence</span>
            </motion.h2>
            
            <div className="vision-line h-px bg-border origin-right" />
          </div>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="mt-16 text-xl md:text-2xl text-muted-foreground max-w-3xl font-body leading-relaxed"
          >
            NEXERA is not just a technical fest—it's an arena where future engineers 
            clash in intellectual combat, pushing the boundaries of innovation and 
            industrial engineering prowess.
          </motion.p>
        </div>
      </div>
    </section>
  );
};

export default VisionSection;
