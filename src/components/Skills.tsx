"use client";
import { useEffect, useRef } from "react";

const SKILLS = [
  { name: "Python",       cat: 0, level: 5, tag: "Primary Language",  icon: "🐍" },
  { name: "PyTorch",      cat: 0, level: 5, tag: "Deep Learning",     icon: "🔥" },
  { name: "TensorFlow",   cat: 0, level: 4, tag: "Neural Networks",   icon: "🧠" },
  { name: "OpenCV",       cat: 0, level: 5, tag: "Computer Vision",   icon: "👁️" },
  { name: "NLP & LLMs",   cat: 0, level: 4, tag: "Language AI",       icon: "💬" },
  { name: "Graph NNs",    cat: 0, level: 4, tag: "Graph ML",          icon: "🕸️" },
  { name: "scikit-learn", cat: 0, level: 5, tag: "Classical ML",      icon: "📊" },
  { name: "React/Next",   cat: 1, level: 4, tag: "Frontend",          icon: "⚛️" },
  { name: "FastAPI",      cat: 1, level: 4, tag: "Backend",           icon: "⚡" },
  { name: "Docker/K8s",   cat: 2, level: 4, tag: "DevOps",            icon: "🐳" },
  { name: "SQL/MongoDB",  cat: 2, level: 4, tag: "Databases",         icon: "🗄️" },
  { name: "Git/Linux",    cat: 2, level: 5, tag: "Tools",             icon: "🔧" },
];

const CAT_LABELS = ["AI & ML", "Development", "Tools & Infra"];
// Monochrome: use white at different opacities
const CAT_COLORS = ["rgba(255,255,255,0.9)", "rgba(255,255,255,0.65)", "rgba(255,255,255,0.45)"];

const POSITIONS = [
  [0.5,0.18],[0.72,0.32],[0.28,0.32],[0.14,0.55],
  [0.35,0.68],[0.65,0.65],[0.86,0.52],[0.5,0.84],
  [0.3,0.86],[0.15,0.22],[0.85,0.2],[0.88,0.76],
];
const EDGES = [[0,1],[0,2],[0,3],[0,4],[0,5],[1,2],[1,6],[2,3],[3,4],[4,5],[5,6],[7,8],[0,9],[0,10],[0,7]];

export default function Skills() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapRef   = useRef<HTMLDivElement>(null);
  const hovered   = useRef(-1);

  useEffect(() => {
    const canvas = canvasRef.current, wrap = wrapRef.current;
    if (!canvas || !wrap) return;
    const ctx = canvas.getContext("2d")!;

    const nodes = POSITIONS.map((pos, i) => ({
      x: pos[0], y: pos[1],
      vx: (Math.random()-0.5)*0.0004,
      vy: (Math.random()-0.5)*0.0004,
      pulse: Math.random()*Math.PI*2,
      cat: SKILLS[i]?.cat ?? 2,
    }));

    const resize = () => { canvas.width = wrap.clientWidth; canvas.height = wrap.clientHeight; };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(wrap);

    const onMouse = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const mx = (e.clientX - rect.left) / canvas.width;
      const my = (e.clientY - rect.top) / canvas.height;
      let minD = 0.07, best = -1;
      nodes.forEach((n,i) => { const d = Math.hypot(n.x-mx,n.y-my); if(d<minD){minD=d;best=i;} });
      hovered.current = best;
    };
    canvas.addEventListener("mousemove", onMouse);
    canvas.addEventListener("mouseleave", () => { hovered.current = -1; });

    let raf = 0, scrollY = 0;
    const onScroll = () => { scrollY = window.scrollY; };
    window.addEventListener("scroll", onScroll, { passive: true });

    const draw = () => {
      raf = requestAnimationFrame(draw);
      ctx.clearRect(0,0,canvas.width,canvas.height);
      const W = canvas.width, H = canvas.height;
      const scrollRot = (scrollY * 0.0002) % (Math.PI*2);

      nodes.forEach(n => {
        n.x += n.vx; n.y += n.vy; n.pulse += 0.02;
        if(n.x<0.06||n.x>0.94) n.vx *= -1;
        if(n.y<0.06||n.y>0.94) n.vy *= -1;
      });

      const rc = (n: typeof nodes[0]) => {
        const cx=0.5,cy=0.5,dx=n.x-cx,dy=n.y-cy;
        const cos=Math.cos(scrollRot),sin=Math.sin(scrollRot);
        return { x:(cx+dx*cos-dy*sin)*W, y:(cy+dx*sin+dy*cos)*H };
      };

      // Edges
      EDGES.forEach(([a,b]) => {
        if(a>=nodes.length||b>=nodes.length) return;
        const pa=rc(nodes[a]),pb=rc(nodes[b]);
        const isH = hovered.current===a||hovered.current===b;
        ctx.beginPath(); ctx.moveTo(pa.x,pa.y); ctx.lineTo(pb.x,pb.y);
        ctx.strokeStyle = isH ? "rgba(255,255,255,0.4)" : "rgba(255,255,255,0.12)";
        ctx.lineWidth = isH ? 1.2 : 0.6;
        ctx.stroke();
      });

      // Nodes
      nodes.forEach((n,i) => {
        const {x:px,y:py}=rc(n);
        const isH=hovered.current===i;
        const r=isH?10:6+Math.sin(n.pulse)*1.5;
        const color=CAT_COLORS[n.cat];
        const alpha=isH?"cc":"55";

        // Halo
        const grd=ctx.createRadialGradient(px,py,0,px,py,r*(isH?4:2.5));
        grd.addColorStop(0,color.replace("rgba","rgba").replace(/[\d.]+\)$/,`${isH?0.3:0.12})`));
        grd.addColorStop(1,"rgba(255,255,255,0)");
        ctx.beginPath(); ctx.arc(px,py,r*(isH?4:2.5),0,Math.PI*2);
        ctx.fillStyle=grd; ctx.fill();

        // Core
        ctx.beginPath(); ctx.arc(px,py,r,0,Math.PI*2);
        ctx.fillStyle=isH?"rgba(255,255,255,0.9)":"rgba(255,255,255,0.5)";
        ctx.fill();

        // Label
        ctx.font=isH?"bold 11px Inter,sans-serif":"10px Inter,sans-serif";
        ctx.fillStyle=isH?"rgba(255,255,255,0.9)":"rgba(255,255,255,0.4)";
        ctx.textAlign="center";
        ctx.fillText(SKILLS[i]?.name??"",px,py+r+14);
      });
    };
    draw();

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      canvas.removeEventListener("mousemove",onMouse);
      window.removeEventListener("scroll",onScroll);
    };
  }, []);

  return (
    <section id="skills" className="relative z-10 px-[6%] py-[120px] bg-black">
      <div data-gsap="fade-right" className="inline-flex items-center gap-3 font-mono text-[10px] tracking-[0.2em] uppercase text-white/35 mb-4">
        <span className="section-line" />Expertise
      </div>
      <h2 data-gsap="chars" className="font-display font-extrabold tracking-[-0.04em] leading-none mb-4" style={{ fontSize: "clamp(36px,5vw,64px)" }}>
        Technical <span className="gradient-text">Arsenal</span>
      </h2>
      <p data-gsap="fade-up" className="text-white/40 text-[16px] leading-[1.7] max-w-[520px] mb-16">
        A diverse toolkit spanning AI research, full-stack engineering, and modern MLOps.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
        {/* Canvas */}
        <div ref={wrapRef} data-gsap="fade-left" className="glass rounded-2xl relative overflow-hidden" style={{ aspectRatio: "1" }}>
          <canvas ref={canvasRef} className="block w-full h-full" />
          <div className="absolute bottom-4 left-0 right-0 text-center font-mono text-[9px] tracking-[0.14em] uppercase text-white/20">
            Interactive Constellation · Scroll to Rotate
          </div>
        </div>

        {/* Skill rows */}
        <div data-gsap="fade-right" className="flex flex-col gap-2">
          {CAT_LABELS.map((cat, ci) => (
            <div key={cat}>
              <div className="font-mono text-[9px] tracking-[0.16em] uppercase text-white/25 mb-2 mt-5 first:mt-0 pl-3 border-l border-white/20">
                {cat}
              </div>
              {SKILLS.filter(s => s.cat === ci).map(skill => (
                <div key={skill.name} className="flex items-center justify-between px-[18px] py-[13px] glass rounded-xl mb-2 hover:border-white/[0.16] hover:bg-white/[0.04] transition-all duration-200">
                  <div className="flex items-center gap-3">
                    <span className="text-[18px] grayscale">{skill.icon}</span>
                    <div>
                      <div className="font-sans text-[14px] font-medium text-white">{skill.name}</div>
                      <div className="font-mono text-[8px] tracking-[0.1em] uppercase text-white/25 mt-[2px]">{skill.tag}</div>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    {[...Array(5)].map((_,pi) => (
                      <div key={pi} className={`skill-pip ${pi < skill.level ? "on" : ""}`} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
