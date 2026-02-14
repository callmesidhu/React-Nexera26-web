import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const VisionSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const descriptionRef = useRef<HTMLParagraphElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      /* ---------------------------------------
         LETTER REVEAL (SCRUB)
      --------------------------------------- */

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 70%",
          end: "bottom 60%",
          scrub: true,
        },
      });

      tl.to(".vision-letter", {
        opacity: 1,
        stagger: 0.04,
        ease: "none",
      }).to(
        ".vision-letter-2",
        {
          opacity: 1,
          stagger: 0.04,
          ease: "none",
        },
        "-=0.5"
      );

      /* ---------------------------------------
         PARAGRAPH FADE (SLOW + VIEWPORT BASED)
      --------------------------------------- */

      if (descriptionRef.current) {
        gsap.fromTo(
          descriptionRef.current,
          { opacity: 0 },
          {
            opacity: 1,
            ease: "none",
            scrollTrigger: {
              trigger: descriptionRef.current,
              start: "top 90%",
              end: "top 30%",
              scrub: true,
            },
          }
        );
        /* ---------------------------------------
          DIVIDER STRETCH (ISOLATED TRIGGER)
        --------------------------------------- */
        gsap.set(".vision-line-left", { scaleX: 0, transformOrigin: "left center" });
        gsap.set(".vision-line-right", { scaleX: 0, transformOrigin: "right center" });
        
        gsap.to(".vision-line-left", {
          scaleX: 1,
          ease: "none",
          scrollTrigger: {
            trigger: ".vision-line-left",
            start: "top 65%",
            end: "top 45%",
            scrub: true,
          },
        });

        gsap.to(".vision-line-right", {
          scaleX: 1,
          ease: "none",
          scrollTrigger: {
            trigger: ".vision-line-right",
            start: "top 65%",
            end: "top 45%",
            scrub: true,
          },
        });

        /* ---------------------------------------
           PARAGRAPH PARALLAX DRIFT
        --------------------------------------- */

        gsap.fromTo(
          descriptionRef.current,
          { y: 60 },
          {
            y: -30,
            ease: "none",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 75%",
              end: "bottom 30%",
              scrub: true,
            },
          }
        );
      }

      /* ---------------------------------------
         GRID PARALLAX (DEPTH EFFECT)
      --------------------------------------- */
      gsap.to(".grid-overlay", {
        backgroundPosition: "400px 800px",
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      });

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative py-32 md:py-48 overflow-hidden"
    >
      {/* Grid Background */}
      <div className="absolute inset-0 grid-overlay opacity-50 pointer-events-none" />

      <div className="container mx-auto px-6">
        <div className="max-w-5xl mx-auto">
          {/* Section Label */}
          <div className="flex items-center gap-4 mb-12">
            <div className="w-12 h-px bg-accent" />
            <span className="text-accent text-sm uppercase tracking-widest font-display">
              Our Vision
            </span>
          </div>

          <div className="space-y-8">
            {/* First Heading */}
            <h2 className="text-4xl md:text-6xl lg:text-7xl font-display leading-tight">
              {"Where ".split("").map((char, i) => (
                <span
                  key={`w-${i}`}
                  className="vision-letter inline-block opacity-0"
                >
                  {char === " " ? "\u00A0" : char}
                </span>
              ))}
              
              <span className="text-accent whitespace-nowrap">
                {"Innovation".split("").map((char, i) => (
                  <span
                    key={`i-${i}`}
                    className="vision-letter inline-block opacity-0"
                  >
                    {char}
                  </span>
                ))}
              </span>

              <br />

              {"Meets".split("").map((char, i) => (
                <span
                  key={`m-${i}`}
                  className="vision-letter inline-block opacity-0"
                >
                  {char}
                </span>
              ))}
            </h2>

            {/* Divider Left */}
            <div className="relative w-full h-[2px]">
              <div className="vision-line-left absolute inset-0 bg-border" />
            </div>

            {/* Second Heading */}
            <h2 className="text-4xl md:text-6xl lg:text-7xl font-display leading-tight text-right">
              {"Industrial ".split("").map((char, i) => (
                <span
                  key={`ind-${i}`}
                  className="vision-letter-2 inline-block opacity-0"
                >
                  {char === " " ? "\u00A0" : char}
                </span>
              ))}

              <span className="text-accent whitespace-nowrap">
                {"Excellence".split("").map((char, i) => (
                  <span
                    key={`exc-${i}`}
                    className="vision-letter-2 inline-block opacity-0"
                  >
                    {char}
                  </span>
                ))}
              </span>
            </h2>

            {/* Divider Right */}
            <div className="relative w-full h-[2px]">
              <div className="vision-line-right absolute inset-0 bg-border" />
            </div>
          </div>

          {/* Description */}
          <p
            ref={descriptionRef}
            className="mt-16 text-xl md:text-2xl text-muted-foreground max-w-3xl font-body leading-relaxed"
          >
            NEXERA is not just a technical fest—it's an arena where future
            engineers clash in intellectual combat, pushing the boundaries of
            innovation and industrial engineering prowess.
          </p>
        </div>
      </div>
    </section>
  );
};

export default VisionSection;