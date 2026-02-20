import { useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Linkedin, Github } from "lucide-react";
import PageTransition from "@/components/PageTransition";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import GridBackground from "@/components/GridBackground";

// 10 members for Committee (Layout: 6 then 4)
const committee = [
  { id: 1, name: "Arjun Sharma", role: "Fest Coordinator", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face" },
  { id: 2, name: "Priya Patel", role: "Technical Head", image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop&crop=face" },
  { id: 3, name: "Rahul Verma", role: "Events Head", image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&crop=face" },
  { id: 4, name: "Sneha Gupta", role: "Marketing Head", image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face" },
  { id: 5, name: "Vikram Singh", role: "Sponsorship Head", image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face" },
  { id: 6, name: "Ananya Reddy", role: "Operations Head", image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop&crop=face" },
  { id: 7, name: "Karan Mehta", role: "Logistics Head", image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop&crop=face" },
  { id: 8, name: "Divya Nair", role: "Creative Head", image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop&crop=face" },
  { id: 9, name: "Aryan Malhotra", role: "Public Relations", image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&crop=face" },
  { id: 10, name: "Meera Iyer", role: "Content Head", image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop&crop=face" },
];

// 4 members for Web Team (Layout: Full Row of 4)
const webTeam = [
  { id: 1, name: "Aditya Kumar", role: "Lead Developer", image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&h=400&fit=crop&crop=face" },
  { id: 2, name: "Neha Saxena", role: "UI/UX Designer", image: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=400&h=400&fit=crop&crop=face" },
  { id: 3, name: "Rohan Joshi", role: "Frontend Developer", image: "https://images.unsplash.com/photo-1463453091185-61582044d556?w=400&h=400&fit=crop&crop=face" },
  { id: 4, name: "Kavya Sharma", role: "Backend Developer", image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&h=400&fit=crop&crop=face" },
];

type TeamMember = typeof committee[0];

const TeamCard = ({ member, showGithub = false }: { member: TeamMember; showGithub?: boolean }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="group relative hud-border hud-glow bg-card/30 overflow-hidden rounded-lg"
    >
      {/* Image */}
      <div className="relative h-48 md:h-64 overflow-hidden">
        <img
          src={member.image}
          alt={member.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
        
        {/* Social icons */}
        <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <a 
            href="#" 
            className="w-8 h-8 md:w-10 md:h-10 border border-foreground bg-background/50 backdrop-blur-sm flex items-center justify-center hover:border-accent hover:text-accent transition-colors rounded-full"
          >
            <Linkedin className="w-4 h-4 md:w-5 md:h-5" />
          </a>
          {showGithub && (
            <a 
              href="#" 
              className="w-8 h-8 md:w-10 md:h-10 border border-foreground bg-background/50 backdrop-blur-sm flex items-center justify-center hover:border-accent hover:text-accent transition-colors rounded-full"
            >
              <Github className="w-4 h-4 md:w-5 md:h-5" />
            </a>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-4 md:p-6 text-center md:text-left">
        <h3 className="font-display text-base md:text-lg mb-1 group-hover:text-accent transition-colors">
          {member.name}
        </h3>
        <p className="text-xs md:text-sm text-muted-foreground font-body uppercase tracking-wider">
          {member.role}
        </p>
      </div>
    </motion.div>
  );
};

const Team = () => {
  const [activeTab, setActiveTab] = useState<"committee" | "webteam">("committee");
  const headerRef = useRef<HTMLDivElement>(null);
  const isHeaderInView = useInView(headerRef, { once: true });

  const currentTeam = activeTab === "committee" ? committee : webTeam;
  const showGithub = activeTab === "webteam";

  return (
    <PageTransition>
      <GridBackground />
      <Navbar />
      
      <main className="relative z-10 pt-32 pb-20 min-h-screen">
        <div className="container mx-auto px-4 md:px-6">
          {/* Header */}
          <motion.div
            ref={headerRef}
            initial={{ opacity: 0, y: 30 }}
            animate={isHeaderInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <span className="text-accent text-sm uppercase tracking-widest font-display mb-4 block">
              [ Squad ]
            </span>
            <h1 className="text-5xl md:text-7xl font-display mb-6">
              The <span className="text-accent">Team</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto font-body">
              Meet the warriors behind NEXERA. The ones who make it all happen.
            </p>
          </motion.div>

          {/* Tab Toggle */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex justify-center mb-16"
          >
            <div className="inline-flex border border-border p-1 bg-card/50 backdrop-blur-sm">
              {(["committee", "webteam"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-6 md:px-8 py-3 font-display text-xs md:text-sm uppercase tracking-widest transition-all duration-300 ${
                    activeTab === tab
                      ? "bg-accent text-background"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {tab === "committee" ? "Committee" : "Web Team"}
                </button>
              ))}
            </div>
          </motion.div>

          {/* DYNAMIC GRID:
            - Mobile: Always grid-cols-2 (2 per row)
            - Desktop (Committee): xl:grid-cols-6 (10 items = 6 then 4)
            - Desktop (Web Team): xl:grid-cols-4 (4 items = 1 full row)
          */}
          <motion.div
            key={activeTab}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className={`grid grid-cols-2 gap-4 md:gap-6 ${
              activeTab === "committee" 
                ? "md:grid-cols-3 xl:grid-cols-6" 
                : "md:grid-cols-2 xl:grid-cols-4"
            }`}
          >
            {currentTeam.map((member) => (
              <TeamCard key={member.id} member={member} showGithub={showGithub} />
            ))}
          </motion.div>
        </div>
      </main>

      <Footer />
    </PageTransition>
  );
};

export default Team;