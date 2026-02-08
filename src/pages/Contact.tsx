import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Phone, Mail, MapPin, Instagram, Linkedin, Youtube } from "lucide-react";
import PageTransition from "@/components/PageTransition";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import GridBackground from "@/components/GridBackground";

const contacts = [
  { name: "Arjun Sharma", role: "Fest Coordinator", phone: "+91 98765 43210" },
  { name: "Priya Patel", role: "Technical Head", phone: "+91 98765 43211" },
  { name: "Rahul Verma", role: "Events Head", phone: "+91 98765 43212" },
];

const socials = [
  { name: "Instagram", icon: Instagram, handle: "@nexera.fest", url: "#" },
  { name: "LinkedIn", icon: Linkedin, handle: "NEXERA Official", url: "#" },
  { name: "YouTube", icon: Youtube, handle: "NEXERA Channel", url: "#" },
];

const Contact = () => {
  const headerRef = useRef<HTMLDivElement>(null);
  const isHeaderInView = useInView(headerRef, { once: true });

  return (
    <PageTransition>
      <GridBackground />
      <Navbar />
      
      <main className="relative z-10 pt-32 pb-20 min-h-screen">
        <div className="container mx-auto px-6">
          {/* Header */}
          <motion.div
            ref={headerRef}
            initial={{ opacity: 0, y: 30 }}
            animate={isHeaderInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-center mb-20"
          >
            <span className="text-accent text-sm uppercase tracking-widest font-display mb-4 block">
              [ Contact ]
            </span>
            <h1 className="text-5xl md:text-7xl font-display mb-6">
              Get in <span className="text-accent">Touch</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto font-body">
              Have questions? Ready to join the arena? Reach out to us.
            </p>
          </motion.div>

          <div className="max-w-5xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-16">
              {/* Contact Info */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-12 h-px bg-accent" />
                  <span className="text-accent text-sm uppercase tracking-widest font-display">Command Center</span>
                </div>

                <div className="space-y-6">
                  {contacts.map((contact, index) => (
                    <motion.div
                      key={contact.name}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 + index * 0.1 }}
                      className="group hud-border hud-glow p-6 bg-card/30"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-display text-lg mb-1 group-hover:text-accent transition-colors">
                            {contact.name}
                          </h3>
                          <p className="text-sm text-muted-foreground font-body mb-3">
                            {contact.role}
                          </p>
                          <div className="flex items-center gap-2 text-accent">
                            <Phone className="w-4 h-4" />
                            <span className="font-body">{contact.phone}</span>
                          </div>
                        </div>
                        <div className="w-2 h-2 bg-accent rounded-full animate-pulse" />
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* General Contact */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="mt-8 space-y-4"
                >
                  <div className="flex items-center gap-3 text-muted-foreground">
                    <Mail className="w-5 h-5 text-accent" />
                    <span className="font-body">nexera@techfest.com</span>
                  </div>
                  <div className="flex items-center gap-3 text-muted-foreground">
                    <MapPin className="w-5 h-5 text-accent" />
                    <span className="font-body">Industrial Engineering Department, Your College</span>
                  </div>
                </motion.div>
              </motion.div>

              {/* Social Links */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-12 h-px bg-accent" />
                  <span className="text-accent text-sm uppercase tracking-widest font-display">Connect</span>
                </div>

                <div className="space-y-6">
                  {socials.map((social, index) => (
                    <motion.a
                      key={social.name}
                      href={social.url}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 + index * 0.1 }}
                      className="group flex items-center gap-6 hud-border hud-glow p-6 bg-card/30 cursor-pointer"
                    >
                      <div className="w-14 h-14 border border-border flex items-center justify-center group-hover:border-accent group-hover:text-accent transition-all duration-300">
                        <social.icon className="w-7 h-7" />
                      </div>
                      <div>
                        <h3 className="font-display text-lg mb-1 group-hover:text-accent transition-colors">
                          {social.name}
                        </h3>
                        <p className="text-sm text-muted-foreground font-body">
                          {social.handle}
                        </p>
                      </div>
                    </motion.a>
                  ))}
                </div>

                {/* HUD decoration */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8 }}
                  className="mt-12 hud-border p-6 bg-card/20"
                >
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-mono text-muted-foreground">SYS.STATUS</span>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-accent rounded-full animate-pulse" />
                      <span className="text-xs font-mono text-accent">ONLINE</span>
                    </div>
                  </div>
                  <div className="space-y-2 text-xs font-mono text-muted-foreground">
                    <div className="flex justify-between">
                      <span>Response Time</span>
                      <span className="text-accent">&lt; 24hrs</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Query Queue</span>
                      <span className="text-foreground">Active</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Location</span>
                      <span className="text-foreground">NEXERA.HQ</span>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </PageTransition>
  );
};

export default Contact;
