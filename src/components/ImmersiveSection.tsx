import { useEffect, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const ImmersiveSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const y1 = useTransform(scrollYProgress, [0, 1], [100, -100]);
  const y2 = useTransform(scrollYProgress, [0, 1], [-50, 50]);
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.8, 1, 0.8]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".immersive-text",
        { opacity: 0, x: -100 },
        {
          opacity: 1,
          x: 0,
          duration: 1,
          stagger: 0.2,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 60%",
            end: "center center",
            scrub: 1,
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative min-h-[150vh] py-32 overflow-hidden">
      {/* Parallax background layers */}
      <motion.div
        style={{ y: y1 }}
        className="absolute top-1/4 left-0 w-full h-1/2 pointer-events-none"
      >
        <div className="absolute left-10 top-0 text-[20rem] font-display text-accent/5 font-black leading-none">
          N
        </div>
        <div className="absolute right-10 bottom-0 text-[20rem] font-display text-accent/5 font-black leading-none">
          X
        </div>
      </motion.div>

      <motion.div
        style={{ y: y2 }}
        className="absolute inset-0 pointer-events-none"
      >
        <div className="absolute top-1/3 left-1/4 w-64 h-64 border border-accent/10 rotate-45" />
        <div className="absolute bottom-1/4 right-1/4 w-48 h-48 border border-accent/20 -rotate-12" />
      </motion.div>

      {/* Main content */}
      <motion.div
        style={{ opacity, scale }}
        className="sticky top-1/2 -translate-y-1/2 container mx-auto px-6"
      >
        <div className="max-w-4xl mx-auto text-center">
          <div className="space-y-4">
            <h2 className="immersive-text text-5xl md:text-7xl lg:text-8xl font-display">
              Enter The
            </h2>
            <h2 className="immersive-text text-5xl md:text-7xl lg:text-8xl font-display text-accent">
              Arena
            </h2>
          </div>

          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="w-full h-px bg-accent/50 my-12 origin-center"
          />

          <p className="immersive-text text-xl md:text-2xl text-muted-foreground font-body max-w-2xl mx-auto">
            Join hundreds of engineers in the ultimate technical battleground. 
            Prove your worth. Claim your legacy.
          </p>
        </div>
      </motion.div>

      {/* Floating HUD elements */}
      <div className="absolute bottom-20 left-10 hidden md:block">
        <div className="hud-border p-4 bg-card/30 backdrop-blur-sm">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-accent rounded-full animate-pulse" />
            <span className="text-xs font-mono text-muted-foreground">SYS.ACTIVE</span>
          </div>
        </div>
      </div>

      <div className="absolute bottom-20 right-10 hidden md:block">
        <div className="hud-border p-4 bg-card/30 backdrop-blur-sm">
          <div className="text-right">
            <span className="text-xs font-mono text-muted-foreground">LOC: </span>
            <span className="text-xs font-mono text-accent">NEXERA.ARENA</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ImmersiveSection;
