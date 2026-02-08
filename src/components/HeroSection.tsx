import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import gsap from "gsap";
import ThreeScene from "./ThreeScene";

const HeroSection = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);

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

  const title = "NEXERA";

  return (
    <section ref={containerRef} className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Three.js Background */}
      <ThreeScene />
      
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-background/50 z-[1]" />
      
      {/* HUD Corner decorations */}
      <div className="absolute top-24 left-8 z-10 hidden md:block">
        <div className="w-20 h-20 border-l-2 border-t-2 border-accent opacity-50" />
      </div>
      <div className="absolute top-24 right-8 z-10 hidden md:block">
        <div className="w-20 h-20 border-r-2 border-t-2 border-accent opacity-50" />
      </div>
      <div className="absolute bottom-8 left-8 z-10 hidden md:block">
        <div className="w-20 h-20 border-l-2 border-b-2 border-accent opacity-50" />
      </div>
      <div className="absolute bottom-8 right-8 z-10 hidden md:block">
        <div className="w-20 h-20 border-r-2 border-b-2 border-accent opacity-50" />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-6">
        {/* Subtitle */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="mb-4"
        >
          <span className="text-accent font-display text-sm md:text-base tracking-[0.3em] uppercase">
            Industrial Engineering Technical Fest
          </span>
        </motion.div>

        {/* Main Title */}
        <h1 
          ref={titleRef}
          className="font-display text-7xl md:text-9xl lg:text-[12rem] font-black leading-none mb-6 overflow-hidden"
        >
          {title.split("").map((letter, index) => (
            <span key={index} className="hero-letter inline-block">
              {letter}
            </span>
          ))}
        </h1>

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.8 }}
          className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto mb-12 font-body"
        >
          Engineering the Future. One Innovation at a Time.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5, duration: 0.6 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <Link to="/programs" className="btn-primary">
            Explore Programs
          </Link>
          <Link to="/programs" className="btn-tactical">
            <span>Register Now</span>
          </Link>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 0.6 }}
          className="absolute bottom-12 left-1/2 -translate-x-1/2"
        >
          <div className="flex flex-col items-center gap-2">
            <span className="text-xs uppercase tracking-widest text-muted-foreground">Scroll</span>
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              className="w-px h-12 bg-gradient-to-b from-accent to-transparent"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
