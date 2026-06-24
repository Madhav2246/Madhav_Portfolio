import type { AcademicData } from "@/lib/types";

interface AboutProps { academic: AcademicData }

export default function About({ academic }: AboutProps) {
  return (
    <section id="about" className="relative z-10 px-[6%] py-[120px] bg-black">
      <div data-gsap="fade-right" className="inline-flex items-center gap-3 font-mono text-[10px] tracking-[0.2em] uppercase text-white/35 mb-4">
        <span className="section-line" />About Me
      </div>
      <h2 data-gsap="chars" className="font-display font-extrabold tracking-[-0.04em] leading-none mb-16" style={{ fontSize: "clamp(36px,5vw,64px)" }}>
        The Mind Behind<br /><span className="gradient-text">the Machine</span>
      </h2>

      {/* Two-column text layout — no photo */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-20 gap-y-6 mb-24">
        <div data-gsap="fade-right" className="text-[17px] leading-[1.85] text-white/45 space-y-5">
          <p>
            I&apos;m an <strong className="text-white font-semibold">AI-focused software developer</strong> pursuing a
            B.Tech in Computer Science with AI Specialization at{" "}
            <span className="text-white font-semibold">Amrita Vishwa Vidyapeetham</span>{" "}
            (CGPA: {academic.currentCGPA}/{academic.cgpaOutOf}).
          </p>
          <p>
            My work sits at the intersection of machine learning, data-driven insight, and
            production-grade software engineering — spanning{" "}
            <strong className="text-white font-semibold">
              computer vision, drug discovery, continual learning, and intelligent automation
            </strong>.
          </p>
        </div>

        <div data-gsap="fade-left" className="text-[17px] leading-[1.85] text-white/45 space-y-5">
          <p>
            Competed nationally at <span className="text-white font-semibold">IIT Madras</span> and{" "}
            <span className="text-white font-semibold">IISc Bengaluru</span>, achieving 2nd place nationally
            in road safety AI and Top 5 in computer vision among 565+ participants.
          </p>
          <p>
            Research interests:{" "}
            <strong className="text-white font-semibold">
              LLM systems, graph neural networks, continual learning, and AI for science
            </strong>{" "}
            — areas where the next decade&apos;s most important breakthroughs will emerge.
          </p>
        </div>
      </div>

      {/* Quick facts strip */}
      <div data-gsap="fade-up" className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-24">
        {[
          { label: "Degree",     value: "B.Tech CSE (AI)" },
          { label: "Institution",value: "Amrita Vishwa Vidyapeetham" },
          { label: "CGPA",       value: `${academic.currentCGPA} / ${academic.cgpaOutOf}` },
          { label: "Graduation", value: String(academic.graduationYear) },
        ].map(item => (
          <div key={item.label} className="glass rounded-xl p-5">
            <div className="font-mono text-[8px] tracking-[0.16em] uppercase text-white/25 mb-2">{item.label}</div>
            <div className="font-display font-bold text-[15px] text-white leading-tight">{item.value}</div>
          </div>
        ))}
      </div>

      {/* Education */}
      <div data-gsap="fade-right" className="inline-flex items-center gap-3 font-mono text-[10px] tracking-[0.2em] uppercase text-white/35 mb-4">
        <span className="section-line" />Education
      </div>
      <h3 className="font-display font-extrabold tracking-[-0.03em] leading-none mb-12" style={{ fontSize: "clamp(28px,4vw,48px)" }}>
        Academic <span className="gradient-text">Journey</span>
      </h3>

      <div className="relative pl-8">
        <div className="absolute left-2 top-2 bottom-2 w-px bg-gradient-to-b from-white/30 via-white/10 to-transparent" />
        {academic.education.map((edu, i) => (
          <div
            key={edu.institution}
            data-gsap="fade-up"
            data-delay={String(i * 0.15)}
            className="relative glass rounded-2xl p-7 mb-4 hover:border-white/[0.16] hover:bg-white/[0.04] transition-all duration-300"
          >
            <div className="absolute left-[-29px] top-7 w-[13px] h-[13px] rounded-full bg-black border-2 border-white/50 shadow-[0_0_12px_rgba(255,255,255,0.2)]" />
            <div className="font-mono text-[10px] tracking-[0.14em] uppercase text-white/30 mb-2">{edu.period}</div>
            <div className="font-display font-bold text-[18px] text-white mb-1">{edu.institution}</div>
            <div className="text-[14px] text-white/45 mb-3">{edu.degree}</div>
            <div className="flex items-center gap-3 flex-wrap">
              <span className="font-mono text-[9px] tracking-[0.1em] uppercase text-white/25">{edu.location}</span>
              <span className="flex items-baseline gap-1 bg-white/[0.06] border border-white/[0.1] rounded-md px-3 py-1">
                <span className="font-display font-extrabold text-[15px] text-white">{edu.grade}</span>
                <span className="font-mono text-[8px] tracking-[0.1em] uppercase text-white/30 ml-1">{edu.gradeLabel}</span>
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
