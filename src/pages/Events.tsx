import { useState, useRef, useMemo, useEffect } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { Search, Calendar, MapPin, X, Users, ArrowRight } from "lucide-react";
import Papa from "papaparse";

import PageTransition from "@/components/PageTransition";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import GridBackground from "@/components/GridBackground";

interface EventType {
  id: number;
  title: string;
  description: string;
  fullDescription: string;
  date: string;
  time: string;
  venue: string;
  capacity: string;
  image: string;
  link: string;
}

interface RawEventData {
  [key: string]: string;
}

const Events = () => {
  const [events, setEvents] = useState<EventType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedEvent, setSelectedEvent] = useState<EventType | null>(null);

  const headerRef = useRef<HTMLDivElement>(null);
  const isHeaderInView = useInView(headerRef, { once: true });

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await fetch(import.meta.env.VITE_EVENTS_URL);
        
        if (!res.ok) {
          throw new Error("Failed to fetch events data.");
        }
        
        const text = await res.text();

        Papa.parse<RawEventData>(text, {
          header: true,
          skipEmptyLines: true,
          complete: (result) => {
            const formatted = result.data.map((item) => {
              // Smart Link Logic
              let rawLink = item.link || item.Link || item.LINK || item.url || "";
              
              // Only add https if there is actually a link text
              if (rawLink && rawLink !== "#" && !rawLink.startsWith("http")) {
                rawLink = `https://${rawLink}`;
              }

              return {
                id: Number(item.id),
                title: item.title,
                description: item.description,
                fullDescription: item.fullDescription,
                date: item.date,
                time: item.time,
                venue: item.venue,
                capacity: item.capacity,
                image: item.image,
                link: rawLink,
              };
            });
            
            console.log("Events Loaded:", formatted);
            setEvents(formatted);
            setLoading(false);
          },
          error: (err: any) => {
            setError(err.message || "Error parsing events data.");
            setLoading(false);
          }
        });
      } catch (err: any) {
        console.error("Events fetch error:", err);
        setError(err.message || "An unexpected error occurred while loading events.");
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const filteredEvents = useMemo(() => {
    const query = searchQuery.toLowerCase();
    return events.filter((event) =>
      event.title?.toLowerCase().includes(query) ||
      event.description?.toLowerCase().includes(query) ||
      event.venue?.toLowerCase().includes(query)
    );
  }, [events, searchQuery]);

  const handleKeyDown = (e: React.KeyboardEvent, event: EventType) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setSelectedEvent(event);
    }
  };

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
              Beyond competitions, NEXERA offers unforgettable experiences.
            </p>
          </motion.div>

          {/* Search */}
          <div className="max-w-md mx-auto mb-16 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search by name, location, or keyword..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-card/50 border border-border pl-12 pr-4 py-4 font-body text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-accent transition-colors rounded-md"
            />
          </div>

          {/* Status Displays */}
          {loading && (
            <div className="text-center py-20 text-muted-foreground">
              Loading events...
            </div>
          )}

          {error && (
            <div className="text-center py-20 text-destructive font-semibold">
              {error}
            </div>
          )}

          {!loading && !error && filteredEvents.length === 0 && (
            <div className="text-center py-20 text-muted-foreground">
              No events found matching your search.
            </div>
          )}

          {/* Event Grid */}
          {!loading && !error && (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredEvents.map((event) => (
                <div
                  key={event.id}
                  onClick={() => setSelectedEvent(event)}
                  onKeyDown={(e) => handleKeyDown(e, event)}
                  role="button"
                  tabIndex={0}
                  aria-label={`View details for ${event.title}`}
                  className="group cursor-pointer hud-border hud-glow bg-card/30 overflow-hidden focus:outline-none focus:ring-2 focus:ring-accent rounded-lg flex flex-col h-full"
                >
                  <div className="relative h-48 overflow-hidden shrink-0">
                    <img
                      src={event.image}
                      alt={event.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      loading="lazy"
                    />
                  </div>

                  <div className="p-6 flex flex-col flex-grow">
                    <h3 className="font-display text-xl mb-2 group-hover:text-accent transition-colors">
                      {event.title}
                    </h3>
                    
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2 flex-grow">
                      {event.description}
                    </p>

                    <div className="space-y-2 text-xs text-muted-foreground mb-4">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-3 h-3 text-accent" />
                        <span>{event.date} • {event.time}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-3 h-3 text-accent" />
                        <span>{event.venue}</span>
                      </div>
                    </div>

                    {/* View Details Button */}
                    <div className="pt-4 border-t border-border mt-auto">
                      <button className="text-accent text-sm font-display tracking-wide uppercase flex items-center gap-2 group-hover:gap-3 transition-all duration-300">
                        View Details <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Modal */}
      <AnimatePresence>
        {selectedEvent && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedEvent(null)}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/90 backdrop-blur-sm"
            role="dialog"
            aria-modal="true"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-4xl bg-black border border-white/10 rounded-none shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedEvent(null)}
                className="absolute top-4 right-4 z-20 p-2 bg-black/60 hover:bg-accent hover:text-black rounded transition-all duration-300 focus:outline-none"
                aria-label="Close dialog"
              >
                <X className="w-5 h-5 text-white" />
              </button>

              {/* Hero Image Section */}
              <div className="shrink-0 relative h-80 w-full">
                <img
                  src={selectedEvent.image}
                  alt={selectedEvent.title}
                  className="w-full h-full object-cover"
                />
                
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />

                <div className="absolute bottom-0 left-0 w-full p-8">
                  <h2 className="text-4xl md:text-5xl font-display font-bold text-white uppercase tracking-wider mb-4 drop-shadow-lg">
                    {selectedEvent.title}
                  </h2>
                  
                  <div className="flex flex-wrap items-center gap-6 text-sm md:text-base font-medium text-accent/90">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-5 h-5" />
                      <span>{selectedEvent.date} • {selectedEvent.time}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                       <MapPin className="w-5 h-5" />
                       <span>{selectedEvent.venue}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="w-5 h-5" />
                      <span>Capacity: {selectedEvent.capacity}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Content Body */}
              <div className="p-8 overflow-y-auto flex-grow bg-black">
                <div className="text-gray-300 leading-relaxed text-lg mb-8 max-w-3xl">
                  {selectedEvent.fullDescription || selectedEvent.description}
                </div>

                {/* 🔹 REGISTER LINK (Only renders if link exists) */}
                {selectedEvent.link && selectedEvent.link !== "#" && (
                  <div className="mt-auto pt-4">
                    <a 
                      href={selectedEvent.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block relative bg-accent text-white font-display font-bold uppercase tracking-widest text-lg px-10 py-4 hover:bg-accent/80 transition-all duration-300 text-center"
                      style={{ clipPath: "polygon(0 0, 100% 0, 100% 70%, 85% 100%, 0 100%)" }}
                    >
                      Register Now
                    </a>
                  </div>
                )}
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