const SOCIAL_LINKS = [
  { label: "LinkedIn",        href: "https://www.linkedin.com/in/yalamarthi-madhav-1776a9287/" },
  { label: "GitHub",          href: "https://github.com/Madhav2246/" },
  { label: "Email",           href: "mailto:yalamarthi.sriram123@gmail.com" },
  { label: "Instagram",       href: "https://www.instagram.com/madhav_yalamarthi" },
  { label: "+91 99497 95982", href: "tel:+919949795982" },
  { label: "Analytics ↗",    href: "/Analysis.html" },
];

export default function Contact() {
  return (
    <section id="contact" className="relative z-10 px-[6%] py-[120px] bg-black">
      <div
        data-gsap="reveal-clip"
        className="glass rounded-3xl px-[80px] py-[80px] text-center relative overflow-hidden max-sm:px-8 max-sm:py-12"
      >
        {/* Center glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full pointer-events-none"
             style={{ background: "radial-gradient(circle, rgba(255,255,255,0.04) 0%, transparent 70%)" }} />

        <h2
          data-gsap="chars"
          className="font-display font-black leading-none tracking-[-0.05em] text-white mb-5"
          style={{ fontSize: "clamp(32px,6vw,68px)" }}
        >
          Let&apos;s build something<br />
          <span className="gradient-text">intelligent</span> together.
        </h2>

        <p data-gsap="fade-up" className="text-[17px] text-white/40 max-w-[460px] mx-auto mb-12 leading-[1.7]">
          Open to research collaborations, internships, and full-time opportunities.
        </p>

        <div data-gsap="fade-up" data-delay="0.2" className="flex flex-wrap gap-3 justify-center mb-10">
          {SOCIAL_LINKS.map(link => (
            <a
              key={link.label}
              href={link.href}
              target={link.href.startsWith("http") ? "_blank" : undefined}
              rel={link.href.startsWith("http") ? "noreferrer" : undefined}
              className="inline-flex items-center gap-2 font-mono text-[10px] tracking-[0.1em] uppercase text-white/50 border border-white/[0.1] rounded-[10px] px-[22px] py-3 bg-white/[0.03] hover:border-white/[0.28] hover:text-white hover:bg-white/[0.07] hover:-translate-y-1 transition-all duration-250 magnetic-btn"
            >
              {link.label}
            </a>
          ))}
        </div>

        <div data-gsap="fade-up" data-delay="0.35" className="font-mono text-[13px] text-white/25">
          Or email:{" "}
          <a href="mailto:yalamarthi.sriram123@gmail.com" className="text-white/55 hover:text-white transition-colors">
            yalamarthi.sriram123@gmail.com
          </a>
        </div>
      </div>
    </section>
  );
}
