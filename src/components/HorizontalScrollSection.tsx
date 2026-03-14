import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import autoshow1 from "@/assets/horizontalscroll/autoshow_1.jpg";
import autoshow2 from "@/assets/horizontalscroll/autoshow_2.jpg";
import autoshow3 from "@/assets/horizontalscroll/autoshow_3.jpg";
import focus1 from "@/assets/horizontalscroll/focus_1.jpg";
import focus2 from "@/assets/horizontalscroll/focus_2.jpg";
import focus3 from "@/assets/horizontalscroll/focus_3.jpg";
import focus4 from "@/assets/horizontalscroll/focus_4.jpg";
import focus5 from "@/assets/horizontalscroll/focus_5.jpg";
import focus6 from "@/assets/horizontalscroll/focus_6.jpg";
import group1 from "@/assets/horizontalscroll/group_1.jpg";
import group2 from "@/assets/horizontalscroll/group_2.jpg";
import groupPhoto1 from "@/assets/horizontalscroll/group_photo_1.jpg";
import groupPhoto2 from "@/assets/horizontalscroll/group_photo_2.jpg";
import show1 from "@/assets/horizontalscroll/show_1.jpg";

gsap.registerPlugin(ScrollTrigger);

const horizontalScrollImages = {
  innovationPrimary: autoshow1,
  innovationSecondary: autoshow2,
  innovationAccent: autoshow3,
  nexeraPrimary: group1,
  nexeraSecondary: group2,
  nexeraAccent: show1,
  futurePrimary: focus1,
  futureSecondary: focus2,
  futureAccent: focus3,
  galleryOne: focus4,
  galleryTwo: focus5,
  galleryThree: focus6,
  galleryFour: groupPhoto1,
  galleryFive: groupPhoto2,
};

export default function HorizontalScrollSection() {
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const worldRef = useRef<HTMLDivElement | null>(null);
  const bgRef = useRef<HTMLDivElement | null>(null);
  const mobileBgRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const section = scrollRef.current;
    const world = worldRef.current;
    const bg = bgRef.current;
    const mobileBg = mobileBgRef.current;

    if (!section || !world || !bg) return;

    const mm = gsap.matchMedia();

    // =========================
    // DESKTOP ONLY (>= 768px)
    // =========================
    mm.add("(min-width: 768px)", () => {
      const totalWidth = world.scrollWidth;
      const viewportWidth = window.innerWidth;

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

      gsap.to(bg, {
        x: -(totalWidth - viewportWidth) * 0.15,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: `+=${totalWidth}`,
          scrub: true,
        },
      });

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

      gsap.utils.toArray<HTMLElement>(".reveal-text").forEach((el) => {
        const text = el.innerText.trim(); 

        el.innerHTML = text
          .split(" ")
          .map((word) => {
            const chars = word
              .split("")
              .map(
                (char) =>
                  `<span class="char inline-block opacity-0 translate-y-6">${char}</span>`
              )
              .join("");
            return `<span class="inline-block whitespace-nowrap">${chars}</span>`;
          })
          .join(" ");

        const chars = el.querySelectorAll(".char");

        gsap.to(chars, {
          opacity: 1,
          y: 0,
          stagger: 0.035,
          ease: "power2.out",
          scrollTrigger: {
            trigger: el,
            start: "left 80%",
            containerAnimation: tween,
          },
        });
      });

      return () => {
        tween.kill();
      };
    });

    // =========================
    // MOBILE ONLY (< 768px)
    // =========================
    mm.add("(max-width: 767px)", () => {
      if (mobileBg) {
        gsap.to(mobileBg, {
          y: (self: any) => -self.getBoundingClientRect().height * 0.3,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: "bottom bottom",
            scrub: 1,
          },
        });
      }

      gsap.utils.toArray<HTMLElement>(".reveal-text").forEach((el) => {
        const text = el.innerText.trim();

        el.innerHTML = text
          .split(" ")
          .map((word) => {
            const chars = word
              .split("")
              .map(
                (char) =>
                  `<span class="char inline-block opacity-100 translate-y-0">${char}</span>`
              )
              .join("");
            return `<span class="inline-block whitespace-nowrap">${chars}</span>`;
          })
          .join(" ");
      });

      gsap.utils.toArray<HTMLElement>(".reveal-text").forEach((el) => {
        gsap.fromTo(
          el,
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power2.out",
            scrollTrigger: {
              trigger: el,
              start: "top 80%",
              toggleActions: "play none none none",
            },
          }
        );
      });

      return () => {
        ScrollTrigger.getAll().forEach((t) => t.kill());
      };
    });

    return () => {
      mm.revert();
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  return (
    <section
      ref={scrollRef}
      className="relative bg-background overflow-hidden md:h-screen"
    >
      {/* Background Grid (Desktop Only) */}
      <div
        ref={bgRef}
        className="absolute inset-0 pointer-events-none z-0 hidden md:block"
        style={{
          width: "600vw",
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.15) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.15) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
        }}
      />

      {/* Content World */}
      <div
        ref={worldRef}
        className="
          relative z-10
          flex flex-col md:flex
          w-full md:w-[320vw]
          h-auto md:h-full
          gap-0 md:gap-0
          px-0 md:px-0
          py-0 md:py-0
        "
      >
        {/* ========================================================= */}
        {/* SECTION 1: LEFT IMAGE + RIGHT TEXT                        */}
        {/* ========================================================= */}
        
        {/* Desktop */}
        <div className="hidden md:block absolute near w-[24vw]" style={{ left: "40vw", top: "15vh" }}>
          <div className="w-full overflow-hidden rounded-xl shadow-2xl">
            <img
              src={horizontalScrollImages.innovationPrimary}
              className="w-full h-auto object-cover"
              alt="Innovation"
            />
          </div>
        </div>
        
        <div className="hidden md:block absolute far" style={{ left: "70vw", top: "18vh" }}>
          <div className="w-[20vw]">
            <h2 className="reveal-text text-5xl text-accent mb-4 whitespace-nowrap">
              INNOVATION
            </h2>
            <p className="text-muted-foreground">
              Innovation is what drives Nexera. It is a space where ideas are explored,
               improved, and turned into practical solutions. By blending industrial 
               engineering with new technology and sharp problem-solving, Nexera pushes 
               participants to think creatively, tackle challenges from fresh angles, and 
               build solutions that can make a real difference.
            </p>
          </div>
        </div>

        {/* Mobile: Staggered Left */}
        <div className="md:hidden w-full px-3 sm:px-6 py-6 sm:py-8">
          <div className="grid grid-cols-2 gap-3 sm:gap-6 items-start">
            <div className="col-span-1 relative mt-12 sm:mt-16 p-1 hud-border hud-glow rounded-lg sm:rounded-xl bg-background/50 backdrop-blur-sm">
              <div className="w-full h-full overflow-hidden rounded-md sm:rounded-lg">
                <img
                  src={horizontalScrollImages.innovationPrimary}
                  className="w-full h-full object-cover"
                  alt="Innovation"
                />
              </div>
            </div>
            <div className="col-span-1 flex flex-col justify-start pt-2 sm:pt-4">
              <h2 className="reveal-text text-base sm:text-xl font-bold text-accent mb-1 sm:mb-2 no-word-break">
                INNOVATION
              </h2>
              <p className="text-muted-foreground text-xs sm:text-sm leading-tight sm:leading-relaxed no-word-break">
              Innovation is what drives Nexera. It is a space where ideas are explored,
               improved, and turned into practical solutions. By blending industrial 
               engineering with new technology and sharp problem-solving, Nexera pushes 
               participants to think creatively, tackle challenges from fresh angles, and 
               build solutions that can make a real difference.
              </p>
            </div>
          </div>
        </div>

        {/* ========================================================= */}
        {/* SECTION 2: RIGHT IMAGE + LEFT TEXT                        */}
        {/* ========================================================= */}
        
        {/* Desktop */}
        <div className="hidden md:block absolute near w-[34vw]" style={{ left: "110vw", top: "20vh" }}>
          <div className="w-full overflow-hidden rounded-xl shadow-2xl">
            <img
              src={horizontalScrollImages.nexeraPrimary}
              className="w-full h-auto object-cover"
              alt="Nexera Platform"
            />
          </div>
        </div>

        {/* Grayscale image */}
        <div className="hidden md:block absolute far w-[12vw]" style={{ left: "130vw", top: "60vh" }}>
          <div className="w-full overflow-hidden rounded-lg shadow-xl">
            <img
              src={horizontalScrollImages.nexeraSecondary}
              className="w-full h-auto object-cover grayscale"
              alt="Detail"
            />
          </div>
        </div>

        {/* Faded image */}
        <div className="hidden md:block absolute far w-[16vw]" style={{ left: "150vw", top: "10vh" }}>
          <div className="w-full overflow-hidden rounded-lg shadow-xl">
            <img
              src={horizontalScrollImages.nexeraAccent}
              className="w-full h-auto object-cover opacity-70"
              alt="Detail"
            />
          </div>
        </div>

        <div className="hidden md:block absolute near" style={{ left: "175vw", top: "35vh" }}>
          <div className="max-w-lg">
            <h2 className="reveal-text text-6xl text-accent mb-6 whitespace-nowrap">
              NEXERA
            </h2>
            <p className="text-muted-foreground text-lg">
              Nexera, derived from “Next-Era,” represents the next generation of industrial
               engineers. As the flagship fest of the Industrial Engineering Department at 
               the College of Engineering, Trivandrum, it brings together students and 
               innovators through competitions, workshops, and interactive events that 
               celebrate learning, collaboration, and creativity.
            </p>
          </div>
        </div>

        {/* Mobile: Staggered Right */}
        <div className="md:hidden w-full px-3 sm:px-6 py-6 sm:py-8">
          <div className="grid grid-cols-2 gap-3 sm:gap-6 items-start">
            <div className="col-span-1 flex flex-col justify-start pt-2 sm:pt-4">
              <h2 className="reveal-text text-base sm:text-xl font-bold text-accent mb-1 sm:mb-2 no-word-break">
                NEXERA
              </h2>
              <p className="text-muted-foreground text-xs sm:text-sm leading-tight sm:leading-relaxed no-word-break">
                Nexera, derived from “Next-Era,” reflects the next generation of industrial 
                engineers. It brings together students and innovators through competitions, 
                workshops, and interactive events built around learning, collaboration, and 
                creativity.
              </p>
            </div>
            <div className="col-span-1 relative p-1 hud-border hud-glow rounded-lg sm:rounded-xl bg-background/50 backdrop-blur-sm">
              <div className="w-full h-full overflow-hidden rounded-md sm:rounded-lg">
                <img
                  src={horizontalScrollImages.galleryFour}
                  className="w-full h-full object-cover"
                  alt="Nexera Platform"
                />
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================= */}
        {/* SECTION 3: LEFT IMAGE + RIGHT TEXT                        */}
        {/* ========================================================= */}
        
        {/* Desktop */}
        <div className="hidden md:block absolute near w-[26vw]" style={{ left: "210vw", top: "18vh" }}>
          <div className="w-full overflow-hidden rounded-xl shadow-2xl">
            <img
              src={horizontalScrollImages.galleryFour}
              className="w-full h-auto object-cover"
              alt="Build the Future"
            />
          </div>
        </div>

        <div className="hidden md:block absolute far w-[14vw]" style={{ left: "230vw", top: "58vh" }}>
          <div className="w-full overflow-hidden rounded-lg shadow-xl">
            <img
              src={horizontalScrollImages.futureSecondary}
              className="w-full h-auto object-cover"
              alt="Impact Detail"
            />
          </div>
        </div>

        {/* Faded image */}
        <div className="hidden md:block absolute far w-[12vw]" style={{ left: "250vw", top: "12vh" }}>
          <div className="w-full overflow-hidden rounded-lg shadow-xl">
            <img
              src={horizontalScrollImages.futureAccent}
              className="w-full h-auto object-cover opacity-70"
              alt="Impact Detail"
            />
          </div>
        </div>

        <div className="hidden md:block absolute far" style={{ left: "275vw", top: "30vh" }}>
          <div className="max-w-md text-right">
            <h2 className="reveal-text text-5xl text-accent mb-4 whitespace-nowrap">
              BUILD THE FUTURE
            </h2>
            <p className="text-muted-foreground">
              Nexera encourages participants to look beyond the present and prepare for the 
              future. Through hands-on experiences, problem-solving challenges, and meaningful 
              interactions, it helps develop the skills and mindset needed to design smarter systems, 
              solve complex problems, and shape the future of industry.
            </p>
          </div>
        </div>

        {/* Mobile: Staggered Left */}
        <div className="md:hidden w-full px-3 sm:px-6 py-6 sm:py-8">
          <div className="grid grid-cols-2 gap-3 sm:gap-6 items-start">
            <div className="col-span-1 relative mt-12 sm:mt-16 p-1 hud-border hud-glow rounded-lg sm:rounded-xl bg-background/50 backdrop-blur-sm">
              <div className="w-full h-full overflow-hidden rounded-md sm:rounded-lg">
                <img
                  src={horizontalScrollImages.innovationAccent}
                  className="w-full h-full object-cover"
                  alt="Build the Future"
                />
              </div>
            </div>
            <div className="col-span-1 flex flex-col justify-start pt-2 sm:pt-4">
              <h2 className="reveal-text text-base sm:text-xl font-bold text-accent mb-1 sm:mb-2 no-word-break">
                BUILD THE FUTURE
              </h2>
              <p className="text-muted-foreground text-xs sm:text-sm leading-tight sm:leading-relaxed no-word-break">
                Nexera encourages participants to look beyond the present and prepare for the future. 
                Through hands-on experiences, problem-solving challenges, and meaningful interactions, 
                it helps develop the skills and mindset needed to design smarter systems, solve complex 
                problems, and shape the future of industry.    
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}