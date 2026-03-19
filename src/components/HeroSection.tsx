import { useEffect, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Link } from "react-router-dom";
import gsap from "gsap";
import ThreeScene from "./ThreeScene";

const HeroSection = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const bgY = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const hudY = useTransform(scrollYProgress, [0, 1], [0, 350]);
  const contentY = useTransform(scrollYProgress, [0, 1], [0, 500]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".hero-letter",
        { y: 100, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.05,
          ease: "power4.out",
          delay: 0.5,
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const title = "NEXERA?";

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Background Layer (Slowest) */}
      <motion.div
        style={{ y: bgY }}
        className="absolute inset-0 -z-10 will-change-transform"
      >
        <ThreeScene />
      </motion.div>

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-background/50 z-[1]" />

      {/* HUD Decorations (Mid Depth) */}
      <motion.div
        style={{ y: hudY }}
        className="absolute inset-0 z-10 will-change-transform"
      >
        <div className="absolute top-24 left-8 hidden md:block">
          <div className="w-20 h-20 border-l-2 border-t-2 border-accent opacity-50" />
        </div>
        <div className="absolute top-24 right-8 hidden md:block">
          <div className="w-20 h-20 border-r-2 border-t-2 border-accent opacity-50" />
        </div>
        <div className="absolute bottom-8 left-8 hidden md:block">
          <div className="w-20 h-20 border-l-2 border-b-2 border-accent opacity-50" />
        </div>
        <div className="absolute bottom-8 right-8 hidden md:block">
          <div className="w-20 h-20 border-r-2 border-b-2 border-accent opacity-50" />
        </div>
      </motion.div>

      {/* Content Layer (Closest / Fastest) */}
      <motion.div
        style={{ y: contentY }}
        className="relative z-20 text-center px-6 will-change-transform flex flex-col items-center justify-center mt-12 md:mt-24"
      >
        <div className="w-fit mx-auto">
          <h1
            ref={titleRef}
            className="font-display text-4xl sm:text-6xl md:text-9xl lg:text-[12rem] font-black leading-none mb-6 overflow-hidden whitespace-nowrap text-center md:text-left"
          >
            {title.split("").map((letter, index) => (
              <span key={index} className="hero-letter inline-block">
                {letter}
              </span>
            ))}
          </h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 0.8 }}
            className="text-muted-foreground text-lg md:text-xl mb-12 font-body leading-relaxed space-y-2 text-left"
          >
            <span className="block">
              What is <span className="text-accent">NEXERA</span>?
            </span>
            <span className="block">Is there a department called Industrial?</span>
            <span className="block">
              Scroll down to discover what <span className="text-accent">Nexera</span> was, and what <span className="text-accent">Nexera</span> is now.
            </span>
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5, duration: 0.6 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <Link to="/about" className="btn-tactical">
            About Us
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 0.6 }}
          className="mt-8 flex justify-center"
        >
          <div className="flex flex-col items-center gap-3 pointer-events-none">
            <motion.div
              animate={{
                scale: [1, 1.04, 1],
                boxShadow: [
                  "0 0 0px rgba(255,255,255,0)",
                  "0 0 20px rgba(255,255,255,0.18)",
                  "0 0 0px rgba(255,255,255,0)",
                ],
              }}
              transition={{
                duration: 1.8,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="relative rounded-full border border-accent/60 bg-background/35 px-4 py-1 backdrop-blur-sm"
            >
              <span className="text-[10px] tracking-[0.28em] uppercase text-accent font-body">
                Scroll
              </span>
            </motion.div>

            <div className="flex flex-col items-center -space-y-1">
              <motion.span
                animate={{ y: [0, 6, 0], opacity: [0.35, 1, 0.35] }}
                transition={{ duration: 1.25, repeat: Infinity, ease: "easeInOut" }}
                className="h-2.5 w-2.5 rotate-45 border-r-2 border-b-2 border-accent"
              />
              <motion.span
                animate={{ y: [0, 6, 0], opacity: [0.2, 0.9, 0.2] }}
                transition={{ duration: 1.25, repeat: Infinity, ease: "easeInOut", delay: 0.15 }}
                className="h-2.5 w-2.5 rotate-45 border-r-2 border-b-2 border-accent/80"
              />
              <motion.span
                animate={{ y: [0, 6, 0], opacity: [0.1, 0.7, 0.1] }}
                transition={{ duration: 1.25, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
                className="h-2.5 w-2.5 rotate-45 border-r-2 border-b-2 border-accent/60"
              />
            </div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default HeroSection;