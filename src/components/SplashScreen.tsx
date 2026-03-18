import { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import logo from "@/assets/logo.png";

// ── Config ──────────────────────────────────────────────────────────────────
const SPOTLIGHT_RADIUS   = 100;
const EDGE_SOFTNESS      = 60;
const CTA_DELAY_MS       = 2000;
const DISSOLVE_DURATION  = 900;

// Mobile spin config
const MOBILE_START_DELAY    = 800;
const MOBILE_SPIN_COUNT     = 3;
const MOBILE_SPIN_DURATION  = 600;  // ms per spin animation
const MOBILE_SPIN_GAP       = 500;  // ms pause between spins

interface SplashScreenProps {
  onComplete: () => void;
}

const isMobile = () => window.innerWidth < 768;

export default function SplashScreen({ onComplete }: SplashScreenProps) {
  const canvasRef  = useRef<HTMLCanvasElement>(null);
  const mouseRef   = useRef({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
  const rafRef     = useRef<number>(0);
  const mobile     = useRef(isMobile());

  const [showCTA,    setShowCTA]    = useState(false);
  const [dissolving, setDissolving] = useState(false);
  const [done,       setDone]       = useState(false);
  const [rotation,   setRotation]   = useState(0);

  // ── Canvas: spotlight follows mouse (desktop only) ─────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;

    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;

    if (mobile.current) return; // mobile uses no canvas

    const draw = () => {
      const { x, y }       = mouseRef.current;
      const { width, height } = canvas;

      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = "#000";
      ctx.fillRect(0, 0, width, height);

      ctx.globalCompositeOperation = "destination-out";
      const total = SPOTLIGHT_RADIUS + EDGE_SOFTNESS;
      const grad  = ctx.createRadialGradient(x, y, 0, x, y, total);
      grad.addColorStop(0,                        "rgba(0,0,0,1)");
      grad.addColorStop(SPOTLIGHT_RADIUS / total, "rgba(0,0,0,1)");
      grad.addColorStop(1,                        "rgba(0,0,0,0)");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);
      ctx.globalCompositeOperation = "source-over";

      rafRef.current = requestAnimationFrame(draw);
    };

    rafRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  // ── Desktop mouse tracking ─────────────────────────────────────────────────
  useEffect(() => {
    if (mobile.current) return;
    const onMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  // ── Desktop CTA timer ─────────────────────────────────────────────────────
  useEffect(() => {
    if (mobile.current) return;
    const t = setTimeout(() => setShowCTA(true), CTA_DELAY_MS);
    return () => clearTimeout(t);
  }, []);

  // ── Desktop click → dissolve ──────────────────────────────────────────────
  const handleClick = useCallback(() => {
    if (mobile.current || !showCTA || dissolving) return;
    setDissolving(true);
    setTimeout(() => { setDone(true); onComplete(); }, DISSOLVE_DURATION);
  }, [showCTA, dissolving, onComplete]);

  // ── Mobile: spin then dissolve ─────────────────────────────────────────────
  useEffect(() => {
    if (!mobile.current) return;

    let cancelled = false;
    const sleep = (ms: number) => new Promise<void>(res => setTimeout(res, ms));

    (async () => {
      await sleep(MOBILE_START_DELAY);

      for (let i = 0; i < MOBILE_SPIN_COUNT; i++) {
        if (cancelled) return;
        setRotation(prev => prev + 360);
        await sleep(MOBILE_SPIN_DURATION + MOBILE_SPIN_GAP);
      }

      if (cancelled) return;
      setDissolving(true);
      await sleep(DISSOLVE_DURATION);
      if (!cancelled) { setDone(true); onComplete(); }
    })();

    return () => { cancelled = true; };
  }, [onComplete]);

  if (done) return null;

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          key="splash"
          className="fixed inset-0 z-[9999] select-none"
          style={{ cursor: mobile.current ? "default" : "crosshair" }}
          initial={{ opacity: 1 }}
          animate={{ opacity: dissolving ? 0 : 1 }}
          transition={{ duration: DISSOLVE_DURATION / 1000, ease: "easeInOut" }}
          onClick={handleClick}
        >
          {/* Layer 1 — solid black base (mobile) / background (desktop) */}
          <div className="absolute inset-0 bg-black" />

          {/* Layer 2 — logo, rotates on mobile via framer */}
          <motion.img
            src={logo}
            alt="Nexera"
            className="pointer-events-none select-none object-contain"
            style={{
              position: "fixed",
              left: "50%",
              top: "50%",
              translateX: "-50.9%",
              translateY: "-55%",
              width: "80%",
              maxWidth: "1200px",
            }}
            animate={{ rotate: rotation }}
            transition={{
              duration: MOBILE_SPIN_DURATION / 1000,
              ease: "easeInOut",
            }}
            draggable={false}
          />

          {/* Layer 3 — canvas spotlight mask (desktop only, transparent on mobile) */}
          <canvas
            ref={canvasRef}
            className="absolute inset-0"
            style={{
              display: "block",
              width: "100%",
              height: "100%",
              // on mobile canvas is never drawn into so it stays transparent
            }}
          />

          {/* Layer 4 — HUD + CTA */}
          <div className="absolute inset-0 pointer-events-none z-10">
            {[
              "top-6 left-6 border-l border-t",
              "top-6 right-6 border-r border-t",
              "bottom-6 left-6 border-l border-b",
              "bottom-6 right-6 border-r border-b",
            ].map((cls, i) => (
              <div
                key={i}
                className={`absolute ${cls} w-10 h-10 hidden md:block`}
                style={{ borderColor: "rgba(239,69,36,0.3)" }}
              />
            ))}

            <AnimatePresence>
              {showCTA && !dissolving && (
                <motion.div
                  key="cta"
                  className="absolute bottom-12 flex flex-col items-center gap-3"
                  style={{ left: "50%", translateX: "-50%", whiteSpace: "nowrap" }}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 1.2, ease: "easeOut" }}
                >
                  <motion.div
                    className="w-1.5 h-1.5 rounded-full"
                    style={{ background: "#ef4524" }}
                    animate={{ opacity: [1, 0.2, 1] }}
                    transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
                  />
                  <span
                    style={{
                      fontFamily: "'Rajdhani', sans-serif",
                      fontSize: "14px",
                      letterSpacing: "0.3em",
                      color: "rgba(239,69,36,0.75)",
                      textTransform: "uppercase",
                    }}
                  >
                    Click to continue
                  </span>
                  <motion.div
                    className="h-px"
                    style={{ width: 120, background: "linear-gradient(to right, transparent, #ef452488, transparent)" }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1.0, delay: 0.3, ease: "easeOut" }}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}