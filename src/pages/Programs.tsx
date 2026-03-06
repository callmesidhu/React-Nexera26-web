import { useState, useRef, useMemo, useEffect } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { Search, Calendar, DollarSign, X, MapPin, Users, ArrowRight, Clock } from "lucide-react"; 
import Papa from "papaparse";

import PageTransition from "@/components/PageTransition";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import GridBackground from "@/components/GridBackground";

interface Program {
  id: number;
  title: string;
  description: string;
  fullDescription: string;
  date: string;
  fee: string;
  venue: string;
  capacity: string;
  image: string;
  duration?: string; 
  link: string; // This property drives the button
}

const Programs = () => {
  const [activeTab, setActiveTab] = useState<"workshops" | "competitions">("workshops");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProgram, setSelectedProgram] = useState<Program | null>(null);

  const [workshops, setWorkshops] = useState<Program[]>([]);
  const [competitions, setCompetitions] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);

  const headerRef = useRef<HTMLDivElement>(null);
  const isHeaderInView = useInView(headerRef, { once: true });

  useEffect(() => {
    // Reusable fetch function for BOTH Workshops and Competitions
    const fetchSheet = async (url: string, setter: any, type: string) => {
      try {
        const res = await fetch(url);
        const text = await res.text();

        Papa.parse(text, {
          header: true,
          skipEmptyLines: true,
          complete: (result) => {
            const formatted = result.data.map((item: any) => {
              // 🔹 ULTRA SMART LINK LOGIC
              // Checks multiple common header names to find the link
              let rawLink = 
                item.link || 
                item.Link || 
                item.LINK || 
                item.url || 
                item.URL || 
                item["Registration Link"] || 
                item["Register"] || 
                "";
              
              // Clean up the link (add https if missing)
              if (rawLink && rawLink !== "#" && !rawLink.startsWith("http")) {
                rawLink = `https://${rawLink}`;
              }

              return {
                ...item,
                id: Number(item.id),
                link: rawLink, // This assigns the link to the object
              };
            });
            
            console.log(`${type} Loaded:`, formatted); // Check your Console (F12)
            setter(formatted);
          },
        });
      } catch (err) {
        console.error(`${type} fetch error:`, err);
      }
    };

    const loadData = async () => {
      setLoading(true);
      await Promise.all([
        fetchSheet(import.meta.env.VITE_WORKSHOPS_URL, setWorkshops, "Workshops"),
        fetchSheet(import.meta.env.VITE_COMPETITIONS_URL, setCompetitions, "Competitions"),
      ]);
      setLoading(false);
    };

    loadData();
  }, []);

  const currentData = activeTab === "workshops" ? workshops : competitions;

  const filteredData = useMemo(() => {
    return currentData.filter((item) =>
      item.title?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [currentData, searchQuery]);

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
              [ Programs ]
            </span>
            <h1 className="text-5xl md:text-7xl font-display mb-6">
              Choose Your <span className="text-accent">Battle</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto font-body">
              Select from our arsenal of workshops and competitions.
            </p>
          </motion.div>

          {/* Tabs */}
          <div className="flex justify-center mb-12">
            <div className="inline-flex border border-border p-1 bg-card/50 backdrop-blur-sm">
              {(["workshops", "competitions"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-8 py-3 font-display text-sm uppercase tracking-widest transition-all duration-300 ${
                    activeTab === tab
                      ? "bg-accent text-background"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {/* Search */}
          <div className="max-w-md mx-auto mb-16 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              placeholder={`Search ${activeTab}...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-card/50 border border-border pl-12 pr-4 py-4 font-body text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-accent transition-colors"
            />
          </div>

          {/* Loading */}
          {loading && (
            <div className="text-center py-20 text-muted-foreground">
              Loading programs...
            </div>
          )}

          {/* Grid */}
          {!loading && (
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredData.map((item) => (
                <div
                  key={item.id}
                  onClick={() => setSelectedProgram(item)}
                  className="group cursor-pointer hud-border hud-glow bg-card/30 overflow-hidden flex flex-col h-full"
                >
                  <div className="relative h-48 overflow-hidden shrink-0">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  </div>

                  <div className="p-6 flex flex-col flex-grow">
                    <h3 className="font-display text-lg mb-2 group-hover:text-accent transition-colors">
                      {item.title}
                    </h3>

                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2 flex-grow">
                      {item.description}
                    </p>

                    <div className="flex items-center gap-4 text-xs text-muted-foreground mb-4">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        <span>{item.date}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <DollarSign className="w-3 h-3" />
                        <span>{item.fee}</span>
                      </div>
                    </div>

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

      {/* 🔹 MODAL */}
      <AnimatePresence>
        {selectedProgram && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedProgram(null)}
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
                onClick={() => setSelectedProgram(null)}
                className="absolute top-4 right-4 z-20 p-2 bg-black/60 hover:bg-accent hover:text-black rounded transition-all duration-300 focus:outline-none"
                aria-label="Close dialog"
              >
                <X className="w-5 h-5 text-white" />
              </button>

              {/* Hero Image Section */}
              <div className="shrink-0 relative h-80 w-full">
                {/* Image */}
                <img
                  src={selectedProgram.image}
                  alt={selectedProgram.title}
                  className="w-full h-full object-cover"
                />
                
                {/* Gradient Overlay for Text Readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />

                {/* Title & Metadata Overlay */}
                <div className="absolute bottom-0 left-0 w-full p-8">
                  <h2 className="text-4xl md:text-5xl font-display font-bold text-white uppercase tracking-wider mb-4 drop-shadow-lg">
                    {selectedProgram.title}
                  </h2>
                  
                  {/* Metadata Row */}
                  <div className="flex flex-wrap items-center gap-6 text-sm md:text-base font-medium text-accent/90">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-5 h-5" />
                      <span>{selectedProgram.date}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-5 h-5" />
                      <span>{selectedProgram.fee}</span>
                    </div>
                    {selectedProgram.duration && (
                       <div className="flex items-center gap-2">
                         <Clock className="w-5 h-5" />
                         <span>{selectedProgram.duration}</span>
                       </div>
                    )}
                    <div className="flex items-center gap-2 text-muted-foreground">
                       <MapPin className="w-5 h-5" />
                       <span>{selectedProgram.venue}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Content Body */}
              <div className="p-8 overflow-y-auto flex-grow bg-black">
                <div className="text-gray-300 leading-relaxed text-lg mb-8 max-w-3xl">
                  {selectedProgram.fullDescription || selectedProgram.description}
                </div>

                {/* 🔹 REGISTER LINK (Only renders if link exists) */}
                {selectedProgram.link && selectedProgram.link !== "#" && (
                  <div className="mt-auto pt-4">
                    <a 
                      href={selectedProgram.link}
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

export default Programs;