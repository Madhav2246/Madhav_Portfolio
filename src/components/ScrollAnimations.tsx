"use client";
import { useEffect } from "react";

export default function ScrollAnimations() {
  useEffect(() => {
    const initGSAP = async () => {
      const { gsap } = await import("gsap");
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      const { default: Lenis } = await import("lenis");

      gsap.registerPlugin(ScrollTrigger);

      // ── Lenis smooth scroll ──────────────────────────────────
      const lenis = new Lenis({
        duration: 1.2,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
      });

      function raf(time: number) {
        lenis.raf(time);
        requestAnimationFrame(raf);
      }
      requestAnimationFrame(raf);

      // Sync GSAP ScrollTrigger with Lenis
      lenis.on("scroll", ScrollTrigger.update);
      gsap.ticker.add((time) => { lenis.raf(time * 1000); });
      gsap.ticker.lagSmoothing(0);

      // ── Custom cursor setup ──────────────────────────────────
      const dot = document.getElementById("__cursor_dot");
      const ring = document.getElementById("__cursor_ring");
      if (dot) dot.style.display = "block";
      if (ring) ring.style.display = "block";

      // ── Magnetic buttons ─────────────────────────────────────
      document.querySelectorAll<HTMLElement>(".magnetic-btn").forEach(btn => {
        btn.addEventListener("mousemove", (e: MouseEvent) => {
          const rect = btn.getBoundingClientRect();
          const cx = rect.left + rect.width / 2;
          const cy = rect.top + rect.height / 2;
          gsap.to(btn, {
            x: (e.clientX - cx) * 0.3,
            y: (e.clientY - cy) * 0.3,
            duration: 0.3,
            ease: "power2.out",
          });
        });
        btn.addEventListener("mouseleave", () => {
          gsap.to(btn, { x: 0, y: 0, duration: 0.5, ease: "elastic.out(1, 0.5)" });
        });
      });

      // ── 3D fade-up reveals ────────────────────────────────────
      document.querySelectorAll<HTMLElement>("[data-gsap='fade-up']").forEach(el => {
        const delay = parseFloat(el.dataset.delay || "0");
        gsap.fromTo(el,
          { opacity: 0, y: 40, rotateX: 8, transformPerspective: 600 },
          {
            opacity: 1, y: 0, rotateX: 0,
            duration: 0.9, delay,
            ease: "power3.out",
            scrollTrigger: {
              trigger: el,
              start: "top 88%",
              toggleActions: "play none none none",
            },
          }
        );
      });

      // ── Fade right/left ───────────────────────────────────────
      document.querySelectorAll<HTMLElement>("[data-gsap='fade-right']").forEach(el => {
        const delay = parseFloat(el.dataset.delay || "0");
        gsap.fromTo(el,
          { opacity: 0, x: -40 },
          {
            opacity: 1, x: 0, duration: 0.8, delay,
            ease: "power3.out",
            scrollTrigger: { trigger: el, start: "top 88%", toggleActions: "play none none none" },
          }
        );
      });

      document.querySelectorAll<HTMLElement>("[data-gsap='fade-left']").forEach(el => {
        const delay = parseFloat(el.dataset.delay || "0");
        gsap.fromTo(el,
          { opacity: 0, x: 40 },
          {
            opacity: 1, x: 0, duration: 0.8, delay,
            ease: "power3.out",
            scrollTrigger: { trigger: el, start: "top 88%", toggleActions: "play none none none" },
          }
        );
      });

      // ── 3D Flip-in (rotateX) for cards ───────────────────────
      document.querySelectorAll<HTMLElement>("[data-gsap='flip-in']").forEach(el => {
        const delay = parseFloat(el.dataset.delay || "0");
        gsap.fromTo(el,
          { opacity: 0, y: 50, rotateX: -20, transformPerspective: 1000, scale: 0.97 },
          {
            opacity: 1, y: 0, rotateX: 0, scale: 1,
            duration: 0.9, delay,
            ease: "back.out(1.2)",
            scrollTrigger: { trigger: el, start: "top 88%", toggleActions: "play none none none" },
          }
        );
      });

      // ── Character split for headings ──────────────────────────
      document.querySelectorAll<HTMLElement>("[data-gsap='chars']").forEach(el => {
        const text = el.innerHTML;
        // Split by visible characters, keep HTML tags
        const words = text.split(/(<[^>]+>|<\/[^>]+>)/g);
        let wrapped = "";
        words.forEach(word => {
          if (word.startsWith("<")) {
            wrapped += word;
          } else {
            wrapped += word
              .split("")
              .map(ch => ch === " " ? " " : `<span class="char-split" style="display:inline-block;overflow:hidden;vertical-align:top"><span class="char-inner" style="display:inline-block">${ch}</span></span>`)
              .join("");
          }
        });
        el.innerHTML = wrapped;

        gsap.fromTo(
          el.querySelectorAll(".char-inner"),
          { y: "110%", rotateX: -50, opacity: 0 },
          {
            y: "0%", rotateX: 0, opacity: 1,
            duration: 0.7,
            ease: "power3.out",
            stagger: 0.03,
            scrollTrigger: { trigger: el, start: "top 85%", toggleActions: "play none none none" },
          }
        );
      });

      // ── Clip-path reveal for contact section ─────────────────
      document.querySelectorAll<HTMLElement>("[data-gsap='reveal-clip']").forEach(el => {
        gsap.fromTo(el,
          { clipPath: "inset(8% 4% 8% 4% round 24px)", opacity: 0, scale: 0.96 },
          {
            clipPath: "inset(0% 0% 0% 0% round 24px)", opacity: 1, scale: 1,
            duration: 1.1,
            ease: "power3.out",
            scrollTrigger: { trigger: el, start: "top 82%", toggleActions: "play none none none" },
          }
        );
      });

      // ── Hero name entry animation ─────────────────────────────
      const heroName = document.querySelector("#hero h1");
      if (heroName) {
        gsap.fromTo(heroName,
          { opacity: 0, y: 30, rotateX: 10, transformPerspective: 800 },
          { opacity: 1, y: 0, rotateX: 0, duration: 1.2, delay: 1.9, ease: "power4.out" }
        );
      }

      // Hero badge
      const heroBadge = document.querySelector("[data-gsap='fade-right']");
      if (heroBadge?.closest("#hero")) {
        gsap.fromTo(heroBadge,
          { opacity: 0, x: -30 },
          { opacity: 1, x: 0, duration: 0.8, delay: 1.6, ease: "power3.out" }
        );
      }

      // ── Skills section: parallax constellation ────────────────
      const skillsCanvas = document.querySelector("#skills canvas");
      if (skillsCanvas) {
        gsap.to(skillsCanvas, {
          y: -40,
          ease: "none",
          scrollTrigger: {
            trigger: "#skills",
            start: "top bottom",
            end: "bottom top",
            scrub: 1.5,
          },
        });
      }

      // ── Achievements: bounce in ───────────────────────────────
      gsap.utils.toArray<HTMLElement>(".glass.rounded-2xl").forEach((card, i) => {
        if (!card.dataset.gsap) { // only if not already handled
          gsap.fromTo(card,
            { opacity: 0, y: 30, scale: 0.96 },
            {
              opacity: 1, y: 0, scale: 1,
              duration: 0.8,
              delay: (i % 3) * 0.08,
              ease: "back.out(1.4)",
              scrollTrigger: { trigger: card, start: "top 88%", toggleActions: "play none none none" },
            }
          );
        }
      });

      // ── Parallax on hero content ──────────────────────────────
      const heroContent = document.querySelector("#hero .relative.z-10");
      if (heroContent) {
        gsap.to(heroContent, {
          y: 80,
          ease: "none",
          scrollTrigger: {
            trigger: "#hero",
            start: "top top",
            end: "bottom top",
            scrub: true,
          },
        });
      }

      // ── VanillaTilt on project cards ──────────────────────────
      try {
        const { default: VanillaTilt } = await import("vanilla-tilt");
        VanillaTilt.init(document.querySelectorAll("[data-tilt]"), {
          max: 6, speed: 400, glare: true, "max-glare": 0.08,
        });
      } catch {}

      return () => {
        lenis.destroy();
        ScrollTrigger.getAll().forEach(t => t.kill());
        gsap.ticker.remove(raf);
      };
    };

    const cleanup = initGSAP();
    return () => { cleanup.then(fn => fn && fn()); };
  }, []);

  return null;
}
