import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function HorizontalScrollSection() {
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const worldRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const world = worldRef.current;
    if (!section || !world) return;

    // 📱 MOBILE FALLBACK
    if (window.innerWidth < 768) {
      world.style.overflowX = "auto";
      world.style.display = "flex";
      world.style.gap = "24px";
      return;
    }

    const totalWidth = world.scrollWidth;
    const viewportWidth = window.innerWidth;

    // 🏎️ MAIN HORIZONTAL SCROLL
    const tween = gsap.to(world, {
      x: -(totalWidth - viewportWidth),
      ease: "none",
      scrollTrigger: {
        trigger: section,
        start: "top top",
        end: `+=${totalWidth}`,
        scrub: 1,
        pin: true,
        anticipatePin: 1,
      },
    });

    // 🔥 PARALLAX DEPTH
    gsap.utils.toArray<HTMLElement>(".near").forEach((el) => {
      gsap.to(el, {
        xPercent: -35,
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: `+=${totalWidth}`,
          scrub: true,
        },
      });
    });

    gsap.utils.toArray<HTMLElement>(".far").forEach((el) => {
      gsap.to(el, {
        xPercent: -12,
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: `+=${totalWidth}`,
          scrub: true,
        },
      });
    });

    // ✨ LETTER-BY-LETTER TEXT REVEAL
    gsap.utils.toArray<HTMLElement>(".reveal-text").forEach((el) => {
      const text = el.innerText;

      el.innerHTML = text
        .split("")
        .map((char) =>
          char === " "
            ? " "
            : `<span class="char inline-block opacity-0 translate-y-6">${char}</span>`
        )
        .join("");

      const chars = el.querySelectorAll(".char");

      gsap.to(chars, {
        opacity: 1,
        y: 0,
        stagger: 0.035,
        ease: "power2.out",
        scrollTrigger: {
          trigger: el,
          start: "left center",
          containerAnimation: tween,
        },
      });

      // 🔥 Glow pulse after reveal
      gsap.fromTo(
        el,
        { textShadow: "0 0 0px rgba(239,69,36,0)" },
        {
          textShadow: "0 0 20px rgba(239,69,36,0.8)",
          duration: 1,
          scrollTrigger: {
            trigger: el,
            start: "left center",
            containerAnimation: tween,
          },
        }
      );
    });

    return () => {
      tween.kill();
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  return (

    <section
      ref={sectionRef}
      className="relative bg-background overflow-hidden"
      style={{ height: "100vh" }}
    >
      {/* 🌌 DENSE HORIZONTAL CANVAS */}
      <div
        ref={worldRef}
        className="relative h-full"
        style={{ width: "320vw" }}
      >
        {/* ===== LEFT CLUSTER ===== */}
        <img
          src="https://picsum.photos/900/1100?1"
          className="absolute near rounded-xl shadow-2xl"
          style={{ left: "40vw", top: "15vh", width: "24vw" }}
        />

        <img
          src="https://picsum.photos/600/800?2"
          className="absolute far opacity-70 rounded-lg"
          style={{ left: "55vw", top: "55vh", width: "14vw" }}
        />

        <div
          className="absolute far max-w-sm"
          style={{ left: "70vw", top: "18vh" }}
        >
          <h2 className="reveal-text text-5xl text-accent mb-4">
            INNOVATION
          </h2>
          <p className="text-muted-foreground">
            Transforming industrial engineering through
            precision technology.
          </p>
        </div>

        {/* ===== CENTER HERO ===== */}
        <img
          src="https://picsum.photos/1200/900?3"
          className="absolute near rounded-xl shadow-2xl"
          style={{ left: "110vw", top: "20vh", width: "34vw" }}
        />

        <img
          src="https://picsum.photos/500/700?4"
          className="absolute far grayscale rounded-lg"
          style={{ left: "130vw", top: "60vh", width: "12vw" }}
        />

        <img
          src="https://picsum.photos/700/900?5"
          className="absolute far opacity-80 rounded-lg"
          style={{ left: "150vw", top: "10vh", width: "16vw" }}
        />

        {/* ===== MAIN TEXT BLOCK ===== */}
        <div
          className="absolute near max-w-lg"
          style={{ left: "175vw", top: "35vh" }}
        >
          <h2 className="reveal-text text-6xl text-accent mb-6">
            NEXERA
          </h2>
          <p className="text-muted-foreground text-lg">
            A platform where engineering excellence meets
            real-world innovation challenges.
          </p>
        </div>

        {/* ===== RIGHT CLUSTER ===== */}
        <img
          src="https://picsum.photos/900/1200?6"
          className="absolute near rounded-xl shadow-2xl"
          style={{ left: "210vw", top: "18vh", width: "26vw" }}
        />

        <img
          src="https://picsum.photos/600/800?7"
          className="absolute far rounded-lg"
          style={{ left: "230vw", top: "58vh", width: "14vw" }}
        />

        <img
          src="https://picsum.photos/500/700?8"
          className="absolute far opacity-70 rounded-lg"
          style={{ left: "250vw", top: "12vh", width: "12vw" }}
        />

        {/* ===== FINAL MESSAGE ===== */}
        <div
          className="absolute far text-right max-w-md"
          style={{ left: "275vw", top: "30vh" }}
        >
          <h2 className="reveal-text text-5xl text-accent mb-4">
            BUILD THE FUTURE
          </h2>
          <p className="text-muted-foreground">
            Where ideas turn into impact.
          </p>
        </div>
      </div>
    </section>
  );
}