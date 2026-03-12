import { useState, useRef, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import { Linkedin, Github } from "lucide-react";
import PageTransition from "@/components/PageTransition";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import GridBackground from "@/components/GridBackground";

type TeamMember = {
  id: number;
  name: string;
  role: string;
  image: string;
  linkedin?: string;
  github?: string;
};

const TeamCard = ({
  member,
  showSocial = false,
}: {
  member: TeamMember;
  showSocial?: boolean;
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="group relative hud-border hud-glow bg-card/30 overflow-hidden rounded-lg"
    >
      <div className="relative h-48 md:h-64 overflow-hidden">
        <img
          src={member.image}
          alt={member.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />

        {showSocial && (
          <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            {member.linkedin && (
              <a
                href={member.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 md:w-10 md:h-10 border border-foreground bg-background/50 backdrop-blur-sm flex items-center justify-center hover:border-accent hover:text-accent transition-colors rounded-full"
              >
                <Linkedin className="w-4 h-4 md:w-5 md:h-5" />
              </a>
            )}

            {member.github && (
              <a
                href={member.github}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 md:w-10 md:h-10 border border-foreground bg-background/50 backdrop-blur-sm flex items-center justify-center hover:border-accent hover:text-accent transition-colors rounded-full"
              >
                <Github className="w-4 h-4 md:w-5 md:h-5" />
              </a>
            )}
          </div>
        )}
      </div>

      <div className="p-4 md:p-6 text-center md:text-left">
        <h3 className="font-display text-base md:text-lg mb-1 group-hover:text-accent transition-colors">
          {member.name}
        </h3>

        <p className="text-xs md:text-sm text-muted-foreground uppercase tracking-wider">
          {member.role}
        </p>
      </div>
    </motion.div>
  );
};

const Team = () => {
  const [activeTab, setActiveTab] = useState<"committee" | "webteam">("committee");

  const [committee, setCommittee] = useState<TeamMember[]>([]);
  const [webTeam, setWebTeam] = useState<TeamMember[]>([]);

  const headerRef = useRef<HTMLDivElement>(null);
  const isHeaderInView = useInView(headerRef, { once: true });

  useEffect(() => {
    fetch("/committee-team.json")
      .then((res) => res.json())
      .then((data) => setCommittee(data));

    fetch("/web-team.json")
      .then((res) => res.json())
      .then((data) => setWebTeam(data));
  }, []);

  const currentTeam = activeTab === "committee" ? committee : webTeam;
  const showSocial = activeTab === "webteam";

  return (
    <PageTransition>
      <GridBackground />
      <Navbar />

      <main className="relative z-10 pt-32 pb-20 min-h-screen">
        <div className="container mx-auto px-4 md:px-6">

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

            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Meet the warriors behind NEXERA. The ones who make it all happen.
            </p>
          </motion.div>

          <div className="flex justify-center mb-16">
            <div className="inline-flex border border-border p-1 bg-card/50 backdrop-blur-sm">
              {(["committee", "webteam"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-6 md:px-8 py-3 text-xs md:text-sm uppercase tracking-widest transition-all ${
                    activeTab === tab
                      ? "bg-accent text-background"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {tab === "committee" ? "Committee" : "Web Team"}
                </button>
              ))}
            </div>
          </div>

          <motion.div
            key={activeTab}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className={`grid grid-cols-2 gap-4 md:gap-6 ${
              activeTab === "committee"
                ? "md:grid-cols-3 xl:grid-cols-6"
                : "md:grid-cols-2 xl:grid-cols-6"
            }`}
          >
            {currentTeam.map((member) => (
              <TeamCard key={member.id} member={member} showSocial={showSocial} />
            ))}
          </motion.div>

        </div>
      </main>

      <Footer />
    </PageTransition>
  );
};

export default Team;