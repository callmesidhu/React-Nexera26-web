import { useState, useRef, useMemo } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { Search, Calendar, MapPin, ArrowRight, X, Users } from "lucide-react";
import PageTransition from "@/components/PageTransition";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import GridBackground from "@/components/GridBackground";

const events = [
  {
    id: 1,
    title: "Opening Ceremony",
    description: "Grand inauguration with industry leaders and special performances.",
    fullDescription: "Witness the spectacular opening of NEXERA with keynote speeches from industry veterans, cultural performances, and the unveiling of this year's theme. The ceremony sets the tone for three days of innovation and competition.",
    date: "March 15, 2024",
    time: "10:00 AM",
    venue: "Main Auditorium",
    capacity: "1000+ attendees",
    image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=600&fit=crop",
  },
  {
    id: 2,
    title: "Industry Panel Discussion",
    description: "Leaders from Fortune 500 companies discuss the future of manufacturing.",
    fullDescription: "Join an exclusive panel featuring executives from leading manufacturing companies. Topics include AI in manufacturing, sustainable operations, and the skills needed for tomorrow's industrial workforce. Q&A session included.",
    date: "March 15, 2024",
    time: "2:00 PM",
    venue: "Conference Hall A",
    capacity: "300 attendees",
    image: "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=800&h=600&fit=crop",
  },
  {
    id: 3,
    title: "Tech Exhibition",
    description: "Showcase of cutting-edge industrial technology and student projects.",
    fullDescription: "Explore the latest in industrial technology from our sponsor companies and witness innovative student projects. Interactive demos, VR experiences, and networking opportunities with company representatives.",
    date: "March 15-17, 2024",
    time: "All Day",
    venue: "Exhibition Center",
    capacity: "Open to all",
    image: "https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=800&h=600&fit=crop",
  },
  {
    id: 4,
    title: "Networking Night",
    description: "Connect with industry professionals in an exclusive evening event.",
    fullDescription: "An evening dedicated to building connections. Mix and mingle with industry professionals, alumni, and fellow participants. Light refreshments served. Dress code: Smart casual.",
    date: "March 16, 2024",
    time: "7:00 PM",
    venue: "Rooftop Garden",
    capacity: "200 attendees",
    image: "https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&h=600&fit=crop",
  },
  {
    id: 5,
    title: "Closing Ceremony & Awards",
    description: "Celebrate winners and wrap up an incredible technical fest.",
    fullDescription: "The grand finale of NEXERA! Winners of all competitions will be recognized, prizes distributed, and special achievements celebrated. Don't miss the closing performance and the announcement of next year's dates.",
    date: "March 17, 2024",
    time: "5:00 PM",
    venue: "Main Auditorium",
    capacity: "1000+ attendees",
    image: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&h=600&fit=crop",
  },
  {
    id: 6,
    title: "Career Fair",
    description: "Meet recruiters from top industrial and tech companies.",
    fullDescription: "Bring your resume and meet recruiters from leading companies. On-spot interviews, internship opportunities, and career guidance sessions. Open to all students and recent graduates.",
    date: "March 16, 2024",
    time: "10:00 AM - 4:00 PM",
    venue: "Sports Complex",
    capacity: "Open to all",
    image: "https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=800&h=600&fit=crop",
  },
];

const Events = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedEvent, setSelectedEvent] = useState<typeof events[0] | null>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const isHeaderInView = useInView(headerRef, { once: true });

  const filteredEvents = useMemo(() => {
    return events.filter((event) =>
      event.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

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
            className="text-center mb-16"
          >
            <span className="text-accent text-sm uppercase tracking-widest font-display mb-4 block">
              [ Events ]
            </span>
            <h1 className="text-5xl md:text-7xl font-display mb-6">
              The <span className="text-accent">Experience</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto font-body">
              Beyond competitions, NEXERA offers experiences that will shape your journey.
            </p>
          </motion.div>

          {/* Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="max-w-md mx-auto mb-16"
          >
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search events..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-card/50 border border-border pl-12 pr-4 py-4 font-body text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-accent transition-colors"
              />
            </div>
          </motion.div>

          {/* Events Grid */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filteredEvents.map((event, index) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => setSelectedEvent(event)}
                className="group cursor-pointer hud-border hud-glow bg-card/30 overflow-hidden"
              >
                {/* Image */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={event.image}
                    alt={event.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="font-display text-xl mb-2 group-hover:text-accent transition-colors">
                    {event.title}
                  </h3>
                  <p className="text-sm text-muted-foreground font-body mb-4 line-clamp-2">
                    {event.description}
                  </p>

                  {/* Meta */}
                  <div className="space-y-2 text-xs text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-3 h-3 text-accent" />
                      <span>{event.date} • {event.time}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3 h-3 text-accent" />
                      <span>{event.venue}</span>
                    </div>
                  </div>

                  {/* CTA */}
                  <div className="mt-4 pt-4 border-t border-border">
                    <span className="flex items-center gap-2 text-accent text-sm font-display uppercase tracking-wider group-hover:gap-4 transition-all">
                      Learn More
                      <ArrowRight className="w-4 h-4" />
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {filteredEvents.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <p className="text-muted-foreground text-lg">No events found matching your search.</p>
            </motion.div>
          )}
        </div>
      </main>

      {/* Detail Modal */}
      <AnimatePresence>
        {selectedEvent && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-background/90 backdrop-blur-sm"
            onClick={() => setSelectedEvent(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 50 }}
              transition={{ duration: 0.3 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-4xl w-full max-h-[90vh] overflow-y-auto bg-card border border-border"
            >
              {/* Close button */}
              <button
                onClick={() => setSelectedEvent(null)}
                className="absolute top-4 right-4 z-10 w-10 h-10 border border-border flex items-center justify-center hover:border-accent hover:text-accent transition-colors bg-background"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Image */}
              <div className="relative h-64 md:h-80">
                <img
                  src={selectedEvent.image}
                  alt={selectedEvent.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-card via-card/50 to-transparent" />
              </div>

              {/* Content */}
              <div className="p-8 -mt-20 relative">
                <h2 className="text-3xl md:text-4xl font-display mb-4">{selectedEvent.title}</h2>
                
                <div className="grid md:grid-cols-2 gap-4 mb-8 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-accent" />
                    <span>{selectedEvent.date}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-accent" />
                    <span>{selectedEvent.venue}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-accent" />
                    <span>{selectedEvent.capacity}</span>
                  </div>
                </div>

                <p className="text-lg text-muted-foreground font-body mb-8 leading-relaxed">
                  {selectedEvent.fullDescription}
                </p>

                <button className="btn-primary">
                  Add to Schedule
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </PageTransition>
  );
};

export default Events;
