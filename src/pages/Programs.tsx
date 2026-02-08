import { useState, useRef, useMemo } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { Search, Calendar, DollarSign, Clock, ArrowRight, X } from "lucide-react";
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
  duration?: string;
  difficulty?: string;
  image: string;
}

const workshops = [
  {
    id: 1,
    title: "Industrial Automation 4.0",
    description: "Master the fundamentals of Industry 4.0 and smart manufacturing systems.",
    fullDescription: "Dive deep into the world of Industry 4.0 with hands-on experience in PLC programming, SCADA systems, and IoT integration. Learn how modern factories leverage automation to achieve unprecedented efficiency and quality control. This workshop covers everything from sensor networks to cloud-based monitoring systems.",
    date: "March 15, 2024",
    fee: "₹500",
    duration: "6 hours",
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&h=600&fit=crop",
  },
  {
    id: 2,
    title: "Lean Manufacturing Mastery",
    description: "Learn Toyota Production System and eliminate waste in manufacturing.",
    fullDescription: "Understand the core principles of Lean Manufacturing derived from the legendary Toyota Production System. Master techniques like 5S, Kaizen, Value Stream Mapping, and Just-In-Time production. Transform your understanding of operational efficiency and waste elimination.",
    date: "March 16, 2024",
    fee: "₹450",
    duration: "4 hours",
    image: "https://images.unsplash.com/photo-1565043666747-69f6646db940?w=800&h=600&fit=crop",
  },
  {
    id: 3,
    title: "Supply Chain Analytics",
    description: "Data-driven decision making for modern supply chain management.",
    fullDescription: "Leverage the power of data analytics in supply chain optimization. Learn predictive modeling, demand forecasting, and inventory optimization techniques using industry-standard tools. Understand how global leaders use analytics to gain competitive advantage.",
    date: "March 17, 2024",
    fee: "₹600",
    duration: "5 hours",
    image: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&h=600&fit=crop",
  },
  {
    id: 4,
    title: "Six Sigma Green Belt",
    description: "Statistical process control and quality improvement methodologies.",
    fullDescription: "Begin your Six Sigma journey with Green Belt certification preparation. Master DMAIC methodology, statistical process control, and data-driven quality improvement. Learn to lead improvement projects and drive organizational excellence.",
    date: "March 18, 2024",
    fee: "₹750",
    duration: "8 hours",
    image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&h=600&fit=crop",
  },
];

const competitions = [
  {
    id: 1,
    title: "OptiMind Challenge",
    description: "Optimize real-world industrial problems under extreme time pressure.",
    fullDescription: "Face off against the best minds in a high-stakes optimization challenge. Given real industrial datasets and constraints, design the most efficient solution. Top performers will be recognized by industry partners and may receive internship opportunities.",
    date: "March 19, 2024",
    fee: "₹300",
    difficulty: "Advanced",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop",
  },
  {
    id: 2,
    title: "Factory Simulation Wars",
    description: "Build and optimize virtual factory systems in a competitive arena.",
    fullDescription: "Design, build, and optimize a virtual factory using simulation software. Compete against other teams to achieve maximum throughput, minimum cost, and optimal resource utilization. Real-time scoring and live leaderboards make this an intense experience.",
    date: "March 19, 2024",
    fee: "₹400",
    difficulty: "Intermediate",
    image: "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=800&h=600&fit=crop",
  },
  {
    id: 3,
    title: "Supply Chain Showdown",
    description: "Navigate disruptions and manage a global supply network.",
    fullDescription: "Take control of a global supply chain network and navigate through simulated disruptions, demand fluctuations, and market changes. Make strategic decisions on inventory, transportation, and supplier selection to maximize profitability.",
    date: "March 20, 2024",
    fee: "₹350",
    difficulty: "Advanced",
    image: "https://images.unsplash.com/photo-1494412574643-ff11b0a5c1c3?w=800&h=600&fit=crop",
  },
  {
    id: 4,
    title: "Hackathon: Future Factory",
    description: "48-hour sprint to design the factory of tomorrow.",
    fullDescription: "In this intense 48-hour hackathon, teams will conceptualize and prototype solutions for the factory of the future. Incorporate AI, robotics, sustainability, and human factors into your design. Present to a panel of industry judges for prizes and recognition.",
    date: "March 20-21, 2024",
    fee: "₹500",
    difficulty: "Expert",
    image: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&h=600&fit=crop",
  },
];



const Programs = () => {
  const [activeTab, setActiveTab] = useState<"workshops" | "competitions">("workshops");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProgram, setSelectedProgram] = useState<Program | null>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const isHeaderInView = useInView(headerRef, { once: true });

  const currentData = activeTab === "workshops" ? workshops : competitions;
  
  const filteredData = useMemo(() => {
    return currentData.filter((item) =>
      item.title.toLowerCase().includes(searchQuery.toLowerCase())
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
              Select from our arsenal of workshops and competitions designed to challenge and inspire.
            </p>
          </motion.div>

          {/* Tab Toggle */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex justify-center mb-12"
          >
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
          </motion.div>

          {/* Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="max-w-md mx-auto mb-16"
          >
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                placeholder={`Search ${activeTab}...`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-card/50 border border-border pl-12 pr-4 py-4 font-body text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-accent transition-colors"
              />
            </div>
          </motion.div>

          {/* Grid */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
            >
              {filteredData.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => setSelectedProgram(item)}
                  className="group cursor-pointer hud-border hud-glow bg-card/30 overflow-hidden"
                >
                  {/* Image */}
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
                    
                    {/* Difficulty badge for competitions */}
                    {"difficulty" in item && (
                      <div className="absolute top-3 right-3">
                        <span className={`px-3 py-1 text-xs font-display uppercase tracking-wider border ${
                          item.difficulty === "Expert" ? "border-accent text-accent" :
                          item.difficulty === "Advanced" ? "border-foreground text-foreground" :
                          "border-muted-foreground text-muted-foreground"
                        }`}>
                          {item.difficulty}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <h3 className="font-display text-lg mb-2 group-hover:text-accent transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-sm text-muted-foreground font-body mb-4 line-clamp-2">
                      {item.description}
                    </p>

                    {/* Meta */}
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        <span>{item.date}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <DollarSign className="w-3 h-3" />
                        <span>{item.fee}</span>
                      </div>
                    </div>

                    {/* CTA */}
                    <div className="mt-4 pt-4 border-t border-border">
                      <span className="flex items-center gap-2 text-accent text-sm font-display uppercase tracking-wider group-hover:gap-4 transition-all">
                        View Details
                        <ArrowRight className="w-4 h-4" />
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>

          {filteredData.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <p className="text-muted-foreground text-lg">No {activeTab} found matching your search.</p>
            </motion.div>
          )}
        </div>
      </main>

      {/* Detail Modal */}
      <AnimatePresence>
        {selectedProgram && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-background/90 backdrop-blur-sm"
            onClick={() => setSelectedProgram(null)}
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
                onClick={() => setSelectedProgram(null)}
                className="absolute top-4 right-4 z-10 w-10 h-10 border border-border flex items-center justify-center hover:border-accent hover:text-accent transition-colors bg-background"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Image */}
              <div className="relative h-64 md:h-80">
                <img
                  src={selectedProgram.image}
                  alt={selectedProgram.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-card via-card/50 to-transparent" />
              </div>

              {/* Content */}
              <div className="p-8 -mt-20 relative">
                {"difficulty" in selectedProgram && (
                  <span className="inline-block px-4 py-1 text-xs font-display uppercase tracking-wider border border-accent text-accent mb-4">
                    {selectedProgram.difficulty}
                  </span>
                )}
                
                <h2 className="text-3xl md:text-4xl font-display mb-4">{selectedProgram.title}</h2>
                
                <div className="flex flex-wrap gap-6 mb-8 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-accent" />
                    <span>{selectedProgram.date}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-accent" />
                    <span>{selectedProgram.fee}</span>
                  </div>
                  {"duration" in selectedProgram && (
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-accent" />
                      <span>{selectedProgram.duration}</span>
                    </div>
                  )}
                </div>

                <p className="text-lg text-muted-foreground font-body mb-8 leading-relaxed">
                  {selectedProgram.fullDescription}
                </p>

                <button className="btn-primary">
                  {activeTab === "competitions" ? "Enter Arena" : "Register Now"}
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

export default Programs;
