export default function Ticker() {
  const ITEMS = [
    "Python","Machine Learning","Deep Learning","Computer Vision",
    "LLMs","PyTorch","React","System Design","Full Stack",
    "AI Development","Graph Neural Networks","RAG Systems",
    "Python","Machine Learning","Deep Learning","Computer Vision",
    "LLMs","PyTorch","React","System Design","Full Stack",
    "AI Development","Graph Neural Networks","RAG Systems",
  ];

  return (
    <div className="relative z-10 bg-black border-t border-b border-white/[0.06] py-[13px] overflow-hidden">
      <div className="inline-flex whitespace-nowrap animate-[tickerScroll_40s_linear_infinite]">
        {ITEMS.map((item, i) => (
          <span key={i} className="inline-flex items-center gap-3 font-mono text-[10px] tracking-[0.16em] uppercase text-white/25 px-6">
            {item}
            <span className="text-white/15">✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}
