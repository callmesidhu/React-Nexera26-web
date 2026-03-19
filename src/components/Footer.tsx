import { Link } from "react-router-dom";
import { Instagram, Linkedin, Youtube } from "lucide-react";
import logo from "@/assets/logo.png";

const Footer = () => {
  return (
    <footer className="relative border-t border-border py-16">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-12">
          {/* Logo & Info */}
          <div className="md:col-span-2">
            <Link to="/" className="flex items-center gap-3 mb-6">
              <img src={logo} alt="NEXERA" className="h-12 w-12" />
              <span className="font-display text-2xl font-bold tracking-widest">NEXERA</span>
            </Link>
            <p className="text-muted-foreground font-body max-w-md mb-6">
              The premier Industrial Engineering Technical Fest. Where innovation meets 
              excellence, and future engineers prove their worth.
            </p>
            <div className="flex gap-4">
              <a 
                href="https://www.instagram.com/nexera.fest" 
                className="w-10 h-10 border border-border flex items-center justify-center hover:border-accent hover:text-accent transition-colors"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a 
                href="https://www.linkedin.com/company/nexera-official" 
                className="w-10 h-10 border border-border flex items-center justify-center hover:border-accent hover:text-accent transition-colors"
              >
                <Linkedin className="w-5 h-5" />
              </a>
           
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display text-sm uppercase tracking-widest mb-6">Navigate</h4>
            <ul className="space-y-3">
              {["Home", "Programs", "Events", "Team", "About", "Contact"].map((item) => (
                <li key={item}>
                  <Link 
                    to={item === "Home" ? "/" : `/${item.toLowerCase()}`}
                    className="text-muted-foreground hover:text-accent transition-colors font-body"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-display text-sm uppercase tracking-widest mb-6">Contact</h4>
            <ul className="space-y-3 text-muted-foreground font-body">
              <li>nexera@cet.ac.in</li>
              <li>+91 8330021086</li>
              <li>Industrial Engineering Dept.</li>
              <li>College of Engineering Trivandrum</li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-16 pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground font-body">
            © 2026 NEXERA. All rights reserved.
          </p>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-accent rounded-full animate-pulse" />
            <span className="text-xs font-mono text-muted-foreground">Industrial Engineering</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
