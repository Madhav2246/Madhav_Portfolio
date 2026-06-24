const INTERESTS = [
  { icon: "🤖", title: "Generative AI",       desc: "Diffusion models, GANs, VAEs, and controllable generation" },
  { icon: "🧬", title: "LLM Systems",          desc: "Large language model architectures, fine-tuning, alignment" },
  { icon: "📚", title: "RAG Systems",           desc: "Retrieval-augmented generation and knowledge-grounded AI" },
  { icon: "🕵️", title: "AI Agents",            desc: "Autonomous multi-agent systems, planning, and tool use" },
  { icon: "👁️", title: "Computer Vision",      desc: "Object detection, segmentation, visual understanding" },
  { icon: "💬", title: "NLP & Semantics",       desc: "Semantic parsing, information extraction, linguistic AI" },
  { icon: "🕸️", title: "Knowledge Graphs",     desc: "Graph-structured knowledge representation and reasoning" },
  { icon: "🎮", title: "Reinforcement Learning",desc: "RLHF, policy optimization, reward model design" },
];

export default function Interests() {
  return (
    <section id="interests" className="relative z-10 px-[6%] py-[120px] bg-black">
      <div data-gsap="fade-right" className="inline-flex items-center gap-3 font-mono text-[10px] tracking-[0.2em] uppercase text-white/35 mb-4">
        <span className="section-line" />Curiosity
      </div>
      <h2 data-gsap="chars" className="font-display font-extrabold tracking-[-0.04em] leading-none mb-4" style={{ fontSize: "clamp(36px,5vw,64px)" }}>
        Research <span className="gradient-text">Interests</span>
      </h2>
      <p data-gsap="fade-up" className="text-white/40 text-[16px] leading-[1.7] max-w-[520px] mb-16">
        Areas where the next decade&apos;s most transformative breakthroughs will emerge.
      </p>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {INTERESTS.map((item, i) => (
          <div
            key={item.title}
            data-gsap="fade-up"
            data-delay={String(i * 0.06)}
            className="glass rounded-2xl px-6 py-7 text-center hover:-translate-y-2 hover:border-white/[0.18] hover:bg-white/[0.04] transition-all duration-300 group"
          >
            <span className="text-[34px] mb-4 block grayscale">{item.icon}</span>
            <div className="font-display font-bold text-[14px] text-white mb-2">{item.title}</div>
            <div className="text-[12px] text-white/40 leading-[1.6]">{item.desc}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
