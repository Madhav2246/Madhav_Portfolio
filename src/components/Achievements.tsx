import type { Achievement } from "@/lib/types";

interface AchievementsProps { achievements: Achievement[] }

export default function Achievements({ achievements }: AchievementsProps) {
  const hackathons = achievements.filter(a => a.type === "hackathon" && a.visible);
  const certs = achievements.filter(a => a.type === "certification" && a.visible);
  const leadership = achievements.filter(a => a.type === "leadership" && a.visible);

  return (
    <section id="achievements" className="relative z-10 px-[6%] py-[120px] bg-black">
      <div data-gsap="fade-right" className="inline-flex items-center gap-3 font-mono text-[10px] tracking-[0.2em] uppercase text-white/35 mb-4">
        <span className="section-line" />Recognition
      </div>
      <h2 data-gsap="chars" className="font-display font-extrabold tracking-[-0.04em] leading-none mb-16" style={{ fontSize: "clamp(36px,5vw,64px)" }}>
        Milestones & <span className="gradient-text">Awards</span>
      </h2>

      {/* Hackathon bento */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-5">
        {hackathons.map((ach, i) => {
          const isFeatured = ach.tier === "gold";
          return (
            <div
              key={ach.id}
              data-gsap="fade-up"
              data-delay={String(i * 0.1)}
              className={`glass rounded-2xl p-8 relative overflow-hidden transition-all duration-300 hover:border-white/[0.18] hover:bg-white/[0.03] ${
                isFeatured ? "lg:col-span-3 grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-8 items-center" : ""
              }`}
            >
              <div className="absolute top-[-40%] right-[-10%] w-[220px] h-[220px] rounded-full bg-white/[0.02] pointer-events-none" />
              <div>
                <div className="font-mono text-[9px] tracking-[0.16em] uppercase text-white/30 mb-2">
                  {ach.organizer} · {ach.date}
                </div>
                <h3 className="font-display font-bold text-[clamp(16px,2.2vw,22px)] tracking-[-0.02em] text-white mb-3">{ach.title}</h3>
                <p className="text-[14px] text-white/45 leading-[1.7] mb-4">{ach.description}</p>
                {ach.tags && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {ach.tags.map(tag => (
                      <span key={tag} className="font-mono text-[8px] tracking-[0.1em] uppercase text-white/25 border border-white/[0.08] rounded px-2 py-1">{tag}</span>
                    ))}
                  </div>
                )}
                {ach.link && (
                  <a href={ach.link} target="_blank" rel="noreferrer"
                    className="inline-flex items-center gap-2 font-mono text-[9px] tracking-[0.1em] uppercase text-white/40 border border-white/[0.12] rounded-md px-3 py-[6px] hover:bg-white/[0.06] hover:text-white transition-all">
                    Learn More →
                  </a>
                )}
              </div>
              {ach.rank && (
                <div className="text-center shrink-0">
                  <div className="font-display font-black leading-none tracking-[-0.04em] text-white" style={{ fontSize: "clamp(48px,6vw,88px)", textShadow: "0 0 40px rgba(255,255,255,0.15)" }}>
                    {ach.rank}
                  </div>
                  <div className="font-mono text-[9px] tracking-[0.14em] uppercase text-white/30 mt-2">{ach.rankLabel}</div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Certs + Leadership */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div data-gsap="fade-up" className="glass rounded-2xl p-8">
          <div className="font-mono text-[9px] tracking-[0.16em] uppercase text-white/35 mb-2">Certifications</div>
          <h3 className="font-display font-bold text-[18px] text-white mb-5">Industry Credentials</h3>
          <div className="grid grid-cols-2 gap-3">
            {certs.map(cert => (
              <a key={cert.id} href={cert.link} target="_blank" rel="noreferrer"
                className="block p-4 bg-white/[0.02] border border-white/[0.07] rounded-xl hover:bg-white/[0.05] hover:border-white/[0.16] transition-all">
                <div className="font-mono text-[8px] tracking-[0.12em] uppercase text-white/35 mb-1">{cert.issuer}</div>
                <div className="text-[12px] text-white/55 leading-[1.4]">{cert.title}</div>
              </a>
            ))}
          </div>
        </div>

        <div data-gsap="fade-up" data-delay="0.1" className="glass rounded-2xl p-8">
          <div className="font-mono text-[9px] tracking-[0.16em] uppercase text-white/35 mb-2">Leadership</div>
          <h3 className="font-display font-bold text-[18px] text-white mb-5">Community Impact</h3>
          {leadership.map(l => (
            <div key={l.id} className="mb-4">
              <div className="font-mono text-[9px] tracking-[0.1em] uppercase text-white/30 mb-1">{l.role} · {l.organization}</div>
              <div className="font-display font-bold text-[15px] text-white mb-2">{l.title}</div>
              <div className="text-[13px] text-white/40 leading-[1.65] mb-3">{l.description}</div>
              <a href={l.link} target="_blank" rel="noreferrer"
                className="inline-flex items-center gap-2 font-mono text-[9px] tracking-[0.1em] uppercase text-white/40 border border-white/[0.1] rounded-md px-3 py-[6px] hover:bg-white/[0.06] hover:text-white transition-all">
                View Post →
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
