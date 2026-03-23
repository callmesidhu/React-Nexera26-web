import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export default function CountdownReveal() {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    // Set target date to March 23rd, 9:00 AM of the current year
    const currentYear = new Date().getFullYear();
    // Format: YYYY-MM-DDTHH:MM:SS (24-hour time)
    const targetDate = new Date(`${currentYear}-03-24T09:00:00`);

    const interval = setInterval(() => {
      const now = new Date();
      const difference = targetDate.getTime() - now.getTime();

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      } else {
        // If the date has passed, clear the interval and keep everything at 0
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative w-full h-screen bg-background flex flex-col items-center justify-center border-t border-accent/50 shadow-[0_-30px_60px_rgba(0,0,0,0.9)] overflow-hidden">
      
      {/* Scanlines and Grid Background */}
      <div className="scanlines" />
      <div className="absolute inset-0 grid-overlay opacity-30 pointer-events-none" />

      <div className="relative z-20 flex flex-col items-center px-4 w-full max-w-6xl mx-auto">
        <h3 className="text-accent text-xl md:text-3xl font-bold tracking-[0.3em] mb-12 text-center drop-shadow-[0_0_10px_rgba(239,69,36,0.5)]">
          SYSTEM INITIATING IN
        </h3>

        {/* Countdown Grid */}
        <div className="flex items-center justify-center gap-2 sm:gap-4 md:gap-8 w-full">
          <TimeUnit value={timeLeft.days} label="DAYS" />
          <span className="text-3xl md:text-6xl font-bold text-accent animate-pulse pb-8">:</span>
          
          <TimeUnit value={timeLeft.hours} label="HOURS" />
          <span className="text-3xl md:text-6xl font-bold text-accent animate-pulse pb-8">:</span>
          
          <TimeUnit value={timeLeft.minutes} label="MINS" />
          <span className="text-3xl md:text-6xl font-bold text-accent animate-pulse pb-8 hidden sm:block">:</span>
          
          <div className="hidden sm:block">
            <TimeUnit value={timeLeft.seconds} label="SECS" />
          </div>
        </div>

        {/* Mobile Only Seconds (Moves seconds to a new row on very small screens) */}
        <div className="sm:hidden flex items-center justify-center mt-6 w-full">
           <TimeUnit value={timeLeft.seconds} label="SECS" />
        </div>

        <Link
          to="/programs"
          className="group relative mt-16 inline-flex w-full sm:w-auto items-center justify-center overflow-hidden text-center hover:-translate-y-1 hover:scale-[1.02] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background btn-primary"
        >
          <span className="absolute inset-0 bg-gradient-to-r from-transparent via-background/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          <span className="absolute inset-y-0 left-[-30%] w-1/3 -skew-x-12 bg-background/20 opacity-0 blur-md transition-all duration-500 group-hover:left-[110%] group-hover:opacity-100" />
          <span className="relative z-10">ACCESS TERMINAL</span>
        </Link>
      </div>
    </section>
  );
}

function TimeUnit({ value, label }: { value: number; label: string }) {
  // Pad single digits with a leading zero
  const formattedValue = value < 10 ? `0${value}` : value;

  return (
    <div className="flex flex-col items-center">
      <div className="relative hud-border hud-glow bg-card/80 backdrop-blur-md rounded-xl w-24 h-20 sm:w-32 sm:h-28 md:w-48 md:h-40 flex justify-center items-center shadow-lg transition-all duration-300">
        
        <span 
          className="text-4xl sm:text-5xl md:text-8xl font-black text-foreground tabular-nums tracking-tighter" 
          style={{ fontFamily: 'Orbitron, sans-serif' }}
        >
          {formattedValue}
        </span>

      </div>
      <span className="mt-4 text-muted-foreground font-bold tracking-[0.2em] text-xs md:text-sm uppercase">
        {label}
      </span>
    </div>
  );
}
