import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import autoshowVideo from "@/assets/Videos/autoshow_trim_vid.mp4";

const CTASection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });
  const [videoError, setVideoError] = useState(false);

  return (
    <section ref={sectionRef} className="relative py-32 overflow-hidden">
      {/* Background video (desktop only) */}
      {!videoError && (
        <video
          className="absolute inset-0 w-full h-full object-cover hidden md:block"
          src={autoshowVideo}
          autoPlay
          loop
          muted
          playsInline
          onError={() => setVideoError(true)}
        />
      )}

      {/* Background effect */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-black/60 hidden md:block" />
        <div className={`absolute inset-0 bg-gradient-to-t from-accent/5 to-transparent ${videoError ? "" : "md:hidden"}`} />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-accent/20" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          {/* Eyebrow */}
          <span className="text-accent text-sm uppercase tracking-widest font-display mb-6 block">
            [ Ready to Begin? ]
          </span>

          {/* Main heading */}
          <h2 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-display mb-8 break-words">
            Join The <span className="text-accent">Revolution</span>
          </h2>

          {/* Description */}
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-12 font-body">
            Register now and become part of the most anticipated Industrial Engineering 
            event of the year. Limited spots available.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link to="/programs" className="btn-primary group flex items-center gap-2">
              Enter the Arena
              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link to="/about" className="btn-tactical">
              <span>Learn More</span>
            </Link>
          </div>
        </motion.div>

        {/* Bottom decoration */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mt-24 flex justify-center"
        >
          <div className="flex items-center gap-4">
            <div className="w-24 h-px bg-border" />
            <div className="w-3 h-3 border border-accent rotate-45" />
            <div className="w-24 h-px bg-border" />
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CTASection;
