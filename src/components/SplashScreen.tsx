import { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import logo from "@/assets/logo.png";

// ── Config ──────────────────────────────────────────────────────────────────
const SPOTLIGHT_RADIUS  = 70;  // px — hard radius of revealed circle
const EDGE_SOFTNESS     = 60;   // px — feather at edge
const CTA_DELAY_MS      = 2000;
const DISSOLVE_DURATION = 900;

interface SplashScreenProps {
  onComplete: () => void;
}

export default function SplashScreen({ onComplete }: SplashScreenProps) {
  const canvasRef  = useRef<HTMLCanvasElement>(null);
  const mouseRef   = useRef({ x: -9999, y: -9999 });
  const rafRef     = useRef<number>(0);

  const [showCTA,    setShowCTA]    = useState(false);
  const [dissolving, setDissolving] = useState(false);
  const [done,       setDone]       = useState(false);

  // ── Canvas: ONLY draws the black mask with a transparent hole ─────────────
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;

    const resize = () => {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const draw = () => {
      const { width, height } = canvas;
      const { x, y } = mouseRef.current;

      // 1) Fill entire canvas black
      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = "#000000";
      ctx.fillRect(0, 0, width, height);

      // 2) Punch a transparent hole — destination-out erases the black
      ctx.globalCompositeOperation = "destination-out";
      const total = SPOTLIGHT_RADIUS + EDGE_SOFTNESS;
      const grad  = ctx.createRadialGradient(x, y, 0, x, y, total);
      grad.addColorStop(0,                        "rgba(0,0,0,1)"); // fully erased
      grad.addColorStop(SPOTLIGHT_RADIUS / total, "rgba(0,0,0,1)"); // holds hard until here
      grad.addColorStop(1,                        "rgba(0,0,0,0)"); // fades back to opaque
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);
      ctx.globalCompositeOperation = "source-over";

      rafRef.current = requestAnimationFrame(draw);
    };

    rafRef.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", resize);
    };
  }, []);

  // ── Mouse / touch tracking ────────────────────────────────────────────────
  useEffect(() => {
    const onMove  = (e: MouseEvent) => { mouseRef.current = { x: e.clientX, y: e.clientY }; };
    const onTouch = (e: TouchEvent) => {
      if (e.touches[0]) mouseRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("touchmove", onTouch, { passive: true });
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("touchmove", onTouch);
    };
  }, []);

  // ── CTA timer ─────────────────────────────────────────────────────────────
  useEffect(() => {
    const t = setTimeout(() => setShowCTA(true), CTA_DELAY_MS);
    return () => clearTimeout(t);
  }, []);

  // ── Click → dissolve ──────────────────────────────────────────────────────
  const handleClick = useCallback(() => {
    if (!showCTA || dissolving) return;
    setDissolving(true);
    setTimeout(() => { setDone(true); onComplete(); }, DISSOLVE_DURATION);
  }, [showCTA, dissolving, onComplete]);

  if (done) return null;

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          key="splash"
          className="fixed inset-0 z-[9999] cursor-crosshair select-none"
          initial={{ opacity: 1 }}
          animate={{ opacity: dissolving ? 0 : 1 }}
          transition={{ duration: DISSOLVE_DURATION / 1000, ease: "easeInOut" }}
          onClick={handleClick}
        >
          {/* Layer 1 — solid black base */}
          <div className="absolute inset-0 bg-black" />

          {/* Layer 2 - logo centred absolutely, immune to flex quirks */}
          <img
            src={logo}
            alt="Nexera"
            className="pointer-events-none select-none object-contain"
            style={{
              position: "fixed",
              width: "75vmin",
              maxWidth: "700px",
              top: "45%",
              left: "49.5%",
              marginTop: "calc(-75vmin / 2)",
              marginLeft: "calc(-75vmin / 2)",
            }}
            draggable={false}
          />

          {/* Layer 3 — canvas: black fill with transparent spotlight hole on top of logo */}
          <canvas
            ref={canvasRef}
            className="absolute inset-0"
            style={{ display: "block", width: "100%", height: "100%" }}
          />

          {/* Layer 4 — HUD + CTA above everything */}
          <div className="absolute inset-0 pointer-events-none z-10">

            {/* Corner HUD marks */}
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

            {/* CTA — motion.div gets key for AnimatePresence, translateX via style prop not transform string */}
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
                      fontSize: "11px",
                      letterSpacing: "0.45em",
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