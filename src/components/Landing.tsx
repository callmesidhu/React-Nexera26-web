import { useEffect, useRef, useState } from "react";
import { motion, useMotionValueEvent, useScroll } from "framer-motion";
import { Link } from "react-router-dom";
import * as THREE from "three";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry";

// accent: hsl(10, 86%, 54%) → #ef4524
const ACCENT       = new THREE.Color(0xef4524);
const ACCENT_DIM   = new THREE.Color(0x7a2210);
const ACCENT_HEX   = "#ef4524";
const ACCENT_DIM_HEX = "rgba(239,69,36,0.35)";

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

    // ── Scene ───────────────────────────────────────────────────────────
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, el.clientWidth / el.clientHeight, 0.1, 2000);
    camera.position.set(0, 0, 18);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(el.clientWidth, el.clientHeight);
    renderer.setClearColor(0x000000, 0);
    el.appendChild(renderer.domElement);

    // ── Lighting — warm accent tones ────────────────────────────────────
    scene.add(new THREE.AmbientLight(0xffffff, 0.2));

    scene.add(new THREE.AmbientLight(0x1a0805, 1)); // very dark warm ambient — keeps shadows rich

    // White key from front-top → creates crisp specular highlights on the orange surface
    const keyLight = new THREE.DirectionalLight(0xffffff, 2.5);
    keyLight.position.set(3, 8, 12);
    scene.add(keyLight);

    // Accent-coloured fill from left — saturates the colour
    const fillLight = new THREE.DirectionalLight(ACCENT, 2.0);
    fillLight.position.set(-10, 2, 5);
    scene.add(fillLight);

    // Deep red rim from behind — separation from bg
    const rimLight = new THREE.DirectionalLight(0x660000, 3.0);
    rimLight.position.set(0, -6, -12);
    scene.add(rimLight);

    // Close accent point — makes letters glow at centre
    const glowLight = new THREE.PointLight(ACCENT, 3, 50);
    glowLight.position.set(0, 0, 10);
    scene.add(glowLight);

    // ── Particle field ───────────────────────────────────────────────────
    const pGeo = new THREE.BufferGeometry();
    const pCount = 700;
    const pPos = new Float32Array(pCount * 3);
    for (let i = 0; i < pCount * 3; i++) pPos[i] = (Math.random() - 0.5) * 90;
    pGeo.setAttribute("position", new THREE.BufferAttribute(pPos, 3));
    const pMat = new THREE.PointsMaterial({
      color: ACCENT_DIM,
      size: 0.07,
      transparent: true,
      opacity: 0.5,
    });
    const particles = new THREE.Points(pGeo, pMat);
    scene.add(particles);

    // ── 3D Text ──────────────────────────────────────────────────────────
    const fontLoader = new FontLoader();
    fontLoader.load(
      "https://threejs.org/examples/fonts/helvetiker_bold.typeface.json",
      (font) => {
        const geo = new TextGeometry("NEXERA", {
          font,
          size: 3.2,
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

        // Phong gives sharp specular without needing an env map
        const solidMat = new THREE.MeshPhongMaterial({
          color: ACCENT,          // base = exact accent orange-red
          emissive: new THREE.Color(0x3a0d04),  // dark emissive so shadows stay rich
          specular: new THREE.Color(0xffffff),   // white specular for sharp highlight
          shininess: 120,
        });

        // Wireframe: accent orange, faint
        const wireMat = new THREE.MeshBasicMaterial({
          color: ACCENT,
          wireframe: true,
          transparent: true,
          opacity: 0.06,
        });

        const textMesh = new THREE.Mesh(geo, solidMat);
        const wireMesh = new THREE.Mesh(geo, wireMat);
        scene.add(textMesh);
        scene.add(wireMesh);

        if (sceneRef.current) {
          sceneRef.current.textMesh = textMesh;
          sceneRef.current.wireMesh = wireMesh;
        }
      }
    );

    // ── Render loop ──────────────────────────────────────────────────────
    let animFrame: number;
    const clock = new THREE.Clock();

    const loop = () => {
      animFrame = requestAnimationFrame(loop);
      const t = clock.getElapsedTime();

      particles.rotation.y = t * 0.02;
      particles.rotation.x = t * 0.007;

      // Pulse the glow light
      glowLight.intensity = 2.5 + Math.sin(t * 1.8) * 0.6;

      const mesh = sceneRef.current?.textMesh;
      if (mesh) {
        // Idle sway — overridden by scroll effect below
        mesh.rotation.y = Math.sin(t * 0.4) * 0.05;
        mesh.position.y = Math.sin(t * 0.6) * 0.1;
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

  // ── Scroll → camera zoom ──────────────────────────────────────────────
  useEffect(() => {
    const ref = sceneRef.current;
    if (!ref) return;
    const { camera } = ref;

    // z: 18 (far) → -8 (fully through)
    camera.position.z = THREE.MathUtils.lerp(-8, 18, Math.min(scrollProgress, 1));
    camera.fov = THREE.MathUtils.lerp(60, 90, Math.min(scrollProgress * 0.8, 0.8));
    camera.updateProjectionMatrix();

    // Wireframe brightens as we pass through
    const wire = ref.wireMesh;
    if (wire) {
      (wire.material as THREE.MeshBasicMaterial).opacity =
        THREE.MathUtils.lerp(0.06, 0.45, Math.min(scrollProgress * 2.5, 1));
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
    // Zoom phase = 2× viewport height
    const zoomRange = window.innerHeight * 2;
    const progress = Math.max(0, Math.min(1, (latest - el.offsetTop) / zoomRange));
    setScrollProgress(progress);
  });

  // UI elements fade out as zoom starts
  const uiFade = Math.max(0, 1 - scrollProgress * 2.5);

  return (
    // 300vh: sticky zoom for 200vh, then scroll continues naturally
    <div ref={sectionRef} style={{ height: "300vh" }}>
      <div className="sticky top-0 h-screen overflow-hidden">

        {/* ── Background — pure black matching --background ── */}
        <div className="absolute inset-0 -z-10 bg-background">
          {/* Scanlines — matching .scanlines component */}
          <div
            className="scanlines absolute inset-0"
            style={{ position: "absolute", zIndex: 1 }}
          />
          {/* Vignette */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse 110% 90% at 50% 50%, transparent 40%, rgba(0,0,0,0.85) 100%)",
              zIndex: 2,
            }}
          />
        </div>

        {/* ── 3D Title ── */}
        <div className="absolute inset-0 z-10">
          <ThreeDTitle scrollProgress={scrollProgress} />
        </div>

        {/* ── HUD corners — accent colour ── */}
        <div
          className="absolute inset-0 z-20 pointer-events-none"
          style={{ opacity: uiFade, transition: "opacity 0.08s linear" }}
        >
          {/* Corners */}
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

          {/* Horizontal rule accents */}
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
          style={{
            opacity: scrollProgress > 0.04 ? 0 : 0.7,
            transition: "opacity 0.4s",
          }}
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

        {/* ── Zoom progress bar (accent) ── */}
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
