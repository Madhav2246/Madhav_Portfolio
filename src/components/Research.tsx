import type { ResearchPaper } from "@/lib/types";

interface ResearchProps { papers: ResearchPaper[] }

export default function Research({ papers }: ResearchProps) {
  const visible = papers.filter(p => p.visible).sort((a, b) => a.order - b.order);

  return (
    <section id="research" className="relative z-10 px-[6%] py-[120px] bg-black">
      <div data-gsap="fade-right" className="inline-flex items-center gap-3 font-mono text-[10px] tracking-[0.2em] uppercase text-white/35 mb-4">
        <span className="section-line" />Research
      </div>
      <h2 data-gsap="chars" className="font-display font-extrabold tracking-[-0.04em] leading-none mb-4" style={{ fontSize: "clamp(36px,5vw,64px)" }}>
        Research <span className="gradient-text">Projects</span>
      </h2>
      <p data-gsap="fade-up" className="text-white/40 text-[16px] leading-[1.7] max-w-[520px] mb-16">
        Unpublished research at the frontier of AI, bioinformatics, and continual learning.
      </p>

      <div className="flex flex-col gap-4">
        {visible.map((paper, i) => (
          <div
            key={paper.id}
            data-gsap="flip-in"
            data-delay={String(i * 0.12)}
            className="glass rounded-2xl p-9 hover:border-white/[0.16] hover:bg-white/[0.03] transition-all duration-300 group relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 right-0 h-[1px] bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            <div className="flex flex-wrap items-start justify-between gap-5 mb-3">
              <div className="font-mono text-[9px] tracking-[0.18em] uppercase text-white/30">{paper.num}</div>
              {paper.status === "in-progress" && (
                <div className="flex items-center gap-2 font-mono text-[9px] tracking-[0.14em] uppercase text-white/50 border border-white/[0.14] rounded-md px-3 py-[5px]">
                  <span className="w-[5px] h-[5px] rounded-full bg-white/60 shadow-[0_0_6px_rgba(255,255,255,0.4)] animate-[pulseDot_2s_ease-in-out_infinite]" />
                  In Progress
                </div>
              )}
              {paper.status === "published" && (
                <div className="flex items-center gap-2 font-mono text-[9px] tracking-[0.14em] uppercase text-white border border-white/30 rounded-md px-3 py-[5px]">
                  Published
                </div>
              )}
            </div>

            <div className="font-mono text-[9px] tracking-[0.14em] uppercase text-white/35 mb-3">{paper.domain}</div>
            <h3 className="font-display font-bold text-[clamp(16px,2vw,20px)] tracking-[-0.02em] text-white mb-3 leading-[1.3]">
              {paper.title}
            </h3>
            <p className="text-[14px] text-white/45 leading-[1.75] mb-5">{paper.abstract}</p>

            <div className="flex flex-wrap gap-2 mb-6">
              {paper.tags.map(tag => (
                <span key={tag} className="font-mono text-[8px] tracking-[0.1em] uppercase text-white/25 border border-white/[0.08] rounded px-2 py-1">
                  {tag}
                </span>
              ))}
            </div>

            <div className="flex flex-wrap gap-6 border-t border-white/[0.07] pt-5">
              {paper.metrics.map(m => (
                <div key={m.label} className="flex flex-col gap-1">
                  <span className="font-display font-extrabold text-[22px] tracking-[-0.03em] text-white">{m.value}</span>
                  <span className="font-mono text-[8px] tracking-[0.12em] uppercase text-white/30">{m.label}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div data-gsap="fade-up" className="flex items-center gap-4 px-8 py-5 bg-white/[0.03] border border-white/[0.08] rounded-xl mt-5 flex-wrap">
        <span className="w-[6px] h-[6px] rounded-full bg-white/40 animate-[pulseDot_2s_ease-in-out_infinite]" />
        <span className="font-mono text-[10px] tracking-[0.14em] uppercase text-white/40 flex-1">
          {visible.length} Active Research Tracks — Manuscripts Under Preparation
        </span>
        <span className="text-[11px] text-white/20 italic">Results not yet published</span>
      </div>
    </section>
  );
}
