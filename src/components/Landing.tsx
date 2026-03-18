import { useEffect, useRef, useState } from "react";
import { motion, useMotionValueEvent, useScroll } from "framer-motion";
import * as THREE from "three";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry";

const ACCENT       = new THREE.Color(0xef4524);
const ACCENT_DIM   = new THREE.Color(0x7a2210);
const ACCENT_HEX   = "#ef4524";

const isMobile = () => window.innerWidth < 768;

// z=18: camera far back (small text) → z=-14 desktop / z=2 mobile (big text)
const DESKTOP_Z_START =  -18;
const DESKTOP_Z_END   = 10;
const MOBILE_Z_START  =  -18;
const MOBILE_Z_END    =   18;

const DESKTOP_FOV_START = 60;
const DESKTOP_FOV_END   = 85;
const MOBILE_FOV_START  = 75;   // wider start on mobile so text fits
const MOBILE_FOV_END    = 90;

// ─── Three.js 3D Title ────────────────────────────────────────────────────────
const ThreeDTitle = ({ scrollProgress }: { scrollProgress: number }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<{
    renderer: THREE.WebGLRenderer;
    camera: THREE.PerspectiveCamera;
    textMesh?: THREE.Mesh;
    wireMesh?: THREE.Mesh;
    particles: THREE.Points;
    animFrame: number;
  } | null>(null);

  useEffect(() => {
    const el = mountRef.current;
    if (!el) return;
    const mobile = isMobile();

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      mobile ? MOBILE_FOV_START : DESKTOP_FOV_START,
      el.clientWidth / el.clientHeight,
      0.1,
      2000
    );
    // Start far back — text is small at page load
    camera.position.set(0, 0, mobile ? MOBILE_Z_START : DESKTOP_Z_START);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(el.clientWidth, el.clientHeight);
    renderer.setClearColor(0x000000, 0);
    el.appendChild(renderer.domElement);

    scene.add(new THREE.AmbientLight(0xffffff, 0.2));
    scene.add(new THREE.AmbientLight(0x1a0805, 1));

    const keyLight = new THREE.DirectionalLight(0xffffff, 2.5);
    keyLight.position.set(3, 8, 12);
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(ACCENT, 2.0);
    fillLight.position.set(-10, 2, 5);
    scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight(0x660000, 3.0);
    rimLight.position.set(0, -6, -12);
    scene.add(rimLight);

    const glowLight = new THREE.PointLight(ACCENT, 3, 50);
    glowLight.position.set(0, 0, 10);
    scene.add(glowLight);

    const pGeo = new THREE.BufferGeometry();
    const pCount = 700;
    const pPos = new Float32Array(pCount * 3);
    for (let i = 0; i < pCount * 3; i++) pPos[i] = (Math.random() - 0.5) * 90;
    pGeo.setAttribute("position", new THREE.BufferAttribute(pPos, 3));
    const particles = new THREE.Points(pGeo, new THREE.PointsMaterial({
      color: ACCENT_DIM, size: 0.07, transparent: true, opacity: 0.5,
    }));
    scene.add(particles);

    const fontLoader = new FontLoader();
    fontLoader.load(
      "https://threejs.org/examples/fonts/helvetiker_bold.typeface.json",
      (font) => {
        const geo = new TextGeometry("NEXERA", {
          font,
          size: mobile ? 2.8 : 3.2,
          depth: 0.9,
          curveSegments: 14,
          bevelEnabled: true,
          bevelThickness: 0.1,
          bevelSize: 0.05,
          bevelSegments: 8,
        });
        geo.computeBoundingBox();
        const bb = geo.boundingBox!;
        geo.translate(
          -(bb.max.x + bb.min.x) / 2,
          -(bb.max.y + bb.min.y) / 2,
          -(bb.max.z + bb.min.z) / 2
        );

        const textMesh = new THREE.Mesh(geo, new THREE.MeshPhongMaterial({
          color: ACCENT,
          emissive: new THREE.Color(0x3a0d04),
          specular: new THREE.Color(0xffffff),
          shininess: 120,
        }));
        const wireMesh = new THREE.Mesh(geo, new THREE.MeshBasicMaterial({
          color: ACCENT, wireframe: true, transparent: true, opacity: 0.06,
        }));
        scene.add(textMesh);
        scene.add(wireMesh);
        if (sceneRef.current) {
          sceneRef.current.textMesh = textMesh;
          sceneRef.current.wireMesh = wireMesh;
        }
      }
    );

    let animFrame: number;
    const clock = new THREE.Clock();
    const loop = () => {
      animFrame = requestAnimationFrame(loop);
      const t = clock.getElapsedTime();
      particles.rotation.y = t * 0.02;
      particles.rotation.x = t * 0.007;
      glowLight.intensity = 2.5 + Math.sin(t * 1.8) * 0.6;
      const mesh = sceneRef.current?.textMesh;
      if (mesh) {
        // static — no idle sway
      }
      renderer.render(scene, camera);
    };
    loop();

    sceneRef.current = { renderer, camera, particles, animFrame };

    const onResize = () => {
      camera.aspect = el.clientWidth / el.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(el.clientWidth, el.clientHeight);
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(animFrame);
      window.removeEventListener("resize", onResize);
      renderer.dispose();
      if (el.contains(renderer.domElement)) el.removeChild(renderer.domElement);
    };
  }, []);

  // Scroll drives camera: p=0 → far back (small), p=1 → close (big)
  useEffect(() => {
    const ref = sceneRef.current;
    if (!ref) return;
    const mobile = isMobile();
    const p = Math.min(Math.max(scrollProgress, 0), 1);

    // lerp(start, end, p): p=0 → start (far, small), p=1 → end (close, big)
    ref.camera.position.z = THREE.MathUtils.lerp(
      mobile ? MOBILE_Z_START : DESKTOP_Z_START,
      mobile ? MOBILE_Z_END   : DESKTOP_Z_END,
      p
    );
    ref.camera.fov = THREE.MathUtils.lerp(
      mobile ? MOBILE_FOV_START : DESKTOP_FOV_START,
      mobile ? MOBILE_FOV_END   : DESKTOP_FOV_END,
      p
    );
    ref.camera.updateProjectionMatrix();

    const wire = ref.wireMesh;
    if (wire) {
      (wire.material as THREE.MeshBasicMaterial).opacity =
        THREE.MathUtils.lerp(0.06, 0.45, Math.min(p * 2.5, 1));
    }
  }, [scrollProgress]);

  return <div ref={mountRef} className="absolute inset-0" />;
};

// ─── Hero Section ─────────────────────────────────────────────────────────────
const HeroSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    const el = sectionRef.current;
    if (!el) return;
    const zoomRange = window.innerHeight * 2;
    const progress = Math.max(0, Math.min(1, (latest - el.offsetTop) / zoomRange));
    setScrollProgress(progress);
  });

  const uiFade = Math.max(0, 1 - scrollProgress * 2.5);

  return (
    <div ref={sectionRef} style={{ height: "300vh" }}>
      <div className="sticky top-0 h-screen overflow-hidden">

        {/* ── Background layers ── */}
        <div className="absolute inset-0 -z-10">

          {/* bg.mp4 must be in /public/bg.mp4 */}
          <video
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 w-full h-full"
            style={{ objectFit: "cover" }}
          >
            <source src="/bg.mp4" type="video/mp4" />
          </video>

          {/* Mobile zoom override — scoped class to avoid global video side-effects */}
          <style>{`
            @media (max-width: 767px) {
              .hero-bg-video { transform: scale(1.6) !important; transform-origin: center center; }
            }
          `}</style>

          {/* Dark overlay */}
          <div className="absolute inset-0" style={{ background: "rgba(0,0,0,0.55)", zIndex: 1 }} />
          {/* Scanlines */}
          <div className="scanlines absolute inset-0" style={{ zIndex: 2 }} />
          {/* Vignette */}
          <div
            className="absolute inset-0"
            style={{
              background: "radial-gradient(ellipse 110% 90% at 50% 50%, transparent 40%, rgba(0,0,0,0.85) 100%)",
              zIndex: 3,
            }}
          />
        </div>

        {/* ── 3D Title ── */}
        <div className="absolute inset-0 z-10">
          <ThreeDTitle scrollProgress={scrollProgress} />
        </div>

        {/* ── HUD corners ── */}
        <div
          className="absolute inset-0 z-20 pointer-events-none"
          style={{ opacity: uiFade, transition: "opacity 0.08s linear" }}
        >
          {[
            "top-6 left-6 border-l-2 border-t-2",
            "top-6 right-6 border-r-2 border-t-2",
            "bottom-6 left-6 border-l-2 border-b-2",
            "bottom-6 right-6 border-r-2 border-b-2",
          ].map((cls, i) => (
            <div
              key={i}
              className={`absolute ${cls} w-16 h-16 hidden md:block`}
              style={{ borderColor: ACCENT_HEX, opacity: 0.55 }}
            />
          ))}
          <div
            className="absolute top-0 left-0 right-0 h-px hidden md:block"
            style={{ background: `linear-gradient(to right, transparent, ${ACCENT_HEX}55, transparent)` }}
          />
          <div
            className="absolute bottom-0 left-0 right-0 h-px hidden md:block"
            style={{ background: `linear-gradient(to right, transparent, ${ACCENT_HEX}55, transparent)` }}
          />
        </div>

        {/* ── Scroll indicator ── */}
        <div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center gap-2 pointer-events-none"
          style={{ opacity: scrollProgress > 0.04 ? 0 : 0.7, transition: "opacity 0.4s" }}
        >
          <span
            className="text-[9px] uppercase tracking-[0.4em]"
            style={{ color: ACCENT_HEX, fontFamily: "Rajdhani, sans-serif" }}
          >
            Scroll
          </span>
          <motion.div
            animate={{ y: [0, 7, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            className="w-px h-10"
            style={{ background: `linear-gradient(to bottom, ${ACCENT_HEX}, transparent)` }}
          />
        </div>

        {/* ── Zoom progress bar ── */}
        <div
          className="absolute bottom-0 left-0 h-[2px] z-40"
          style={{
            width: `${scrollProgress * 100}%`,
            background: `linear-gradient(to right, ${ACCENT_HEX}44, ${ACCENT_HEX})`,
            opacity: scrollProgress > 0.02 ? 1 : 0,
            transition: "opacity 0.3s",
          }}
        />
      </div>
    </div>
  );
};

export default HeroSection;