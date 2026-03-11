import { useRef } from "react";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import PageTransition from "@/components/PageTransition";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const About = () => {
  const headerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const isHeaderInView = useInView(headerRef, { once: true });
  const { scrollYProgress } = useScroll({
    target: contentRef,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [50, -50]);

  return (
    <PageTransition>
      <Navbar />
      
      <main className="relative z-10 min-h-screen">
        {/* Hero Section with Video Background */}
        <section className="relative h-screen flex items-center justify-center overflow-hidden">
          {/* Video Background Placeholder */}
          <div className="absolute inset-0 z-0">
            <video
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover"
              poster="https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1920&h=1080&fit=crop"
            >
              <source src="https://assets.mixkit.co/videos/preview/mixkit-digital-animation-of-futuristic-devices-99786-large.mp4" type="video/mp4" />
            </video>
            {/* Dark overlay */}
            <div className="absolute inset-0 bg-background/70" />
            {/* Grid overlay */}
            <div 
              className="absolute inset-0 opacity-30"
              style={{
                backgroundImage: `
                  linear-gradient(rgba(255, 255, 255, 0.02) 1px, transparent 1px),
                  linear-gradient(90deg, rgba(255, 255, 255, 0.02) 1px, transparent 1px)
                `,
                backgroundSize: '50px 50px',
              }}
            />
          </div>

          {/* Content */}
          <div ref={headerRef} className="relative z-10 text-center px-6">
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              animate={isHeaderInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6 }}
              className="text-accent text-sm uppercase tracking-widest font-display mb-6 block"
            >
              [ About ]
            </motion.span>
            
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={isHeaderInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-5xl md:text-7xl lg:text-8xl font-display mb-8"
            >
              What is <span className="text-accent">NEXERA</span>?
            </motion.h1>

            <motion.div
              initial={{ scaleX: 0 }}
              animate={isHeaderInView ? { scaleX: 1 } : {}}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="w-32 h-px bg-accent mx-auto mb-8"
            />

            <motion.p
              initial={{ opacity: 0 }}
              animate={isHeaderInView ? { opacity: 1 } : {}}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto font-body"
            >
              More than a fest. A space where future industrial engineers discover what they are truly capable of.
            </motion.p>
          </div>

          {/* Scroll indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
            className="absolute bottom-12 left-1/2 -translate-x-1/2"
          >
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              className="w-px h-12 bg-gradient-to-b from-accent to-transparent"
            />
          </motion.div>
        </section>

        {/* Story Section */}
        <section ref={contentRef} className="relative py-32 overflow-hidden">
          {/* Parallax elements */}
          <motion.div
            style={{ y }}
            className="absolute top-20 left-10 text-[15rem] font-display text-accent/5 font-black leading-none pointer-events-none"
          >
            N
          </motion.div>

          <div className="container mx-auto px-6 relative z-10">
            <div className="max-w-4xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="mb-16"
              >
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-12 h-px bg-accent" />
                  <span className="text-accent text-sm uppercase tracking-widest font-display">What Is Nexera?</span>
                </div>

                <p className="text-xl md:text-2xl text-foreground font-body leading-relaxed mb-8">
                  More than a fest. A space where future industrial engineers discover what they are truly capable of.
                </p>

                <p className="text-lg text-muted-foreground font-body leading-relaxed">
                  Nexera is the flagship technical fest of the Industrial Engineering Department at the College of Engineering,
                  Trivandrum. It is built as a platform where ideas are tested, skills are sharpened, and innovation meets
                  execution. Through competitions, workshops, and industry interaction, Nexera creates an environment that
                  challenges students to think critically, act decisively, and collaborate effectively.
                </p>
              </motion.div>

              <motion.div
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="w-full h-px bg-border my-16"
              />

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="mb-16"
              >
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-12 h-px bg-accent" />
                  <span className="text-accent text-sm uppercase tracking-widest font-display">The Origin</span>
                </div>
                
                <p className="text-xl md:text-2xl text-foreground font-body leading-relaxed mb-8">
                  <span className="text-accent">NEXERA</span> began with a simple question: what if industrial engineering 
                  students had a platform designed entirely for themselves?
                </p>
                
                <p className="text-lg text-muted-foreground font-body leading-relaxed">
                  In 2024, a group of driven students from the department envisioned something beyond a conventional 
                  college fest. They imagined a space where theory meets application, where analytical thinking is pushed 
                  under pressure, and where collaboration fuels innovation. What started as an idea soon evolved into a 
                  movement rooted in ambition, precision, and purpose.
                </p>
              </motion.div>

              <motion.div
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="w-full h-px bg-border my-16"
              />

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="mb-16"
              >
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-12 h-px bg-accent" />
                  <span className="text-accent text-sm uppercase tracking-widest font-display">The Mission</span>
                </div>
                
                <p className="text-xl md:text-2xl text-foreground font-body leading-relaxed mb-8">
                  To bridge the gap between academia and industry by creating meaningful, practical experiences.
                </p>
                
                <p className="text-lg text-muted-foreground font-body leading-relaxed">
                  Every workshop is curated to reflect industry relevance. Every competition is designed to simulate real
                  challenges. Every interaction opens doors to new perspectives and opportunities. Nexera exists to help 
                  students move beyond textbooks and prove their ability to solve, optimize, and lead.
                </p>
              </motion.div>

              <motion.div
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="w-full h-px bg-border my-16"
              />

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-12 h-px bg-accent" />
                  <span className="text-accent text-sm uppercase tracking-widest font-display">The Vision</span>
                </div>
                
                <p className="text-xl md:text-2xl text-foreground font-body leading-relaxed mb-8">
                  To grow into a nationally recognized platform for <span className="text-accent">excellence</span> in industrial engineering.
                </p>
                
                <p className="text-lg text-muted-foreground font-body leading-relaxed">
                  We envision Nexera as more than an annual event. It is a growing community of thinkers, builders, 
                  and problem solvers who strive to raise standards each year. Together, we aim to shape not only 
                  better engineers, but future leaders who understand systems, strategy, and impact.
                </p>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Quote Section */}
        <section className="relative py-32 overflow-hidden border-t border-b border-border">
          <div className="container mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="max-w-4xl mx-auto text-center"
            >
              <div className="text-6xl text-accent mb-8">"</div>
              <p className="text-3xl md:text-4xl font-display leading-tight mb-8">
                Engineering the Future. One Innovation at a Time.
              </p>
              <div className="flex items-center justify-center gap-4">
                <div className="w-8 h-px bg-accent" />
                <span className="text-muted-foreground font-body">NEXERA</span>
                <div className="w-8 h-px bg-accent" />
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </PageTransition>
  );
};

export default About;
