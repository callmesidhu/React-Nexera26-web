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
  parsedDate: Date;
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

  // ✅ Robust Date Parser
  const parseDate = (dateStr: string): Date => {
    if (!dateStr) return new Date();

    // YYYY-MM-DD
    if (dateStr.includes("-")) {
      return new Date(dateStr);
    }

    // DD/MM/YYYY
    if (dateStr.includes("/")) {
      const [day, month, year] = dateStr.split("/");
      return new Date(`${year}-${month}-${day}`);
    }

    return new Date(dateStr);
  };

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
            const today = new Date();

            const formatted: EventType[] = result.data.map((item) => {
              let rawLink =
                item.link || item.Link || item.LINK || item.url || "";

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
                parsedDate: parseDate(item.date),
              };
            });

            // ✅ Smart Sorting
            const sorted = formatted.sort((a, b) => {
              const aTime = a.parsedDate.getTime();
              const bTime = b.parsedDate.getTime();
              const todayTime = today.getTime();

              const aIsPast = aTime < todayTime;
              const bIsPast = bTime < todayTime;

              // Future first
              if (aIsPast !== bIsPast) {
                return aIsPast ? 1 : -1;
              }

              // Both future → nearest first
              if (!aIsPast && !bIsPast) {
                return aTime - bTime;
              }

              // Both past → most recent first
              return bTime - aTime;
            });

            setEvents(sorted);
            setLoading(false);
          },
          error: (err: any) => {
            setError(err.message || "Error parsing events data.");
            setLoading(false);
          },
        });
      } catch (err: any) {
        setError(err.message || "An unexpected error occurred.");
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const filteredEvents = useMemo(() => {
    const query = searchQuery.toLowerCase();
    return events.filter(
      (event) =>
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
              className="w-full bg-card/50 border border-border pl-12 pr-4 py-4 rounded-md"
            />
          </div>

          {/* States */}
          {loading && <div className="text-center py-20">Loading events...</div>}
          {error && <div className="text-center py-20 text-red-500">{error}</div>}

          {!loading && !error && filteredEvents.length === 0 && (
            <div className="text-center py-20">No events found</div>
          )}

          {/* Grid */}
          {!loading && !error && (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredEvents.map((event) => (
                <div
                  key={event.id}
                  onClick={() => setSelectedEvent(event)}
                  onKeyDown={(e) => handleKeyDown(e, event)}
                  role="button"
                  tabIndex={0}
                  className="group cursor-pointer bg-card/30 overflow-hidden rounded-lg flex flex-col"
                >
                  {/* 3:2 Image */}
                  <div className="relative aspect-[3/2] overflow-hidden">
                    <img
                      src={event.image}
                      alt={event.title}
                      className="w-full h-full object-contain transition"
                    />
                  </div>

                  <div className="p-6 flex flex-col flex-grow">
                    <h3 className="text-xl mb-2">{event.title}</h3>

                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2 flex-grow">
                      {event.description}
                    </p>

                    <div className="text-xs mb-4">
                      <div>{event.date} • {event.time}</div>
                      <div>{event.venue}</div>
                    </div>

                    <button className="text-accent flex items-center gap-2">
                      View Details <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <AnimatePresence>
        {selectedEvent && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/90 backdrop-blur-sm"
            onClick={() => setSelectedEvent(null)}
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

              {/* Uncropped Full-size Image Container */}
              <div className="relative w-full flex justify-center bg-zinc-950 p-4 shrink-0 border-b border-white/5">
                <img
                  src={selectedEvent.image}
                  alt={selectedEvent.title}
                  className="max-w-full max-h-[55vh] object-contain rounded-sm"
                />
              </div>

              <div className="p-8 overflow-y-auto flex-grow bg-black">
                <h2 className="text-3xl md:text-4xl font-display font-bold text-white uppercase tracking-wider mb-4 drop-shadow-lg">
                  {selectedEvent.title}
                </h2>
                
                <div className="flex flex-wrap items-center gap-6 text-sm md:text-base font-medium text-accent/90 mb-6">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-5 h-5" />
                    <span>{selectedEvent.date} • {selectedEvent.time}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="w-5 h-5" />
                    <span>{selectedEvent.venue}</span>
                  </div>
                </div>

                <div className="text-gray-300 leading-relaxed text-lg mb-8 max-w-3xl">
                  {selectedEvent.fullDescription || selectedEvent.description}
                </div>
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