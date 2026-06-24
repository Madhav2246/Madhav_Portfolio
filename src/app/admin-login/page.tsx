"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // POST to our login API
    const res = await fetch("/api/admin-login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });

    if (res.ok) {
      router.push("/admin");
    } else {
      setError("Incorrect password.");
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-black"
      style={{
        backgroundImage: "radial-gradient(rgba(255,255,255,0.06) 1px, transparent 1px)",
        backgroundSize: "28px 28px",
      }}
    >
      <div
        className="w-full max-w-sm p-8 rounded-2xl"
        style={{
          background: "rgba(255,255,255,0.04)",
          border: "1px solid rgba(255,255,255,0.1)",
          backdropFilter: "blur(20px)",
        }}
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <p className="font-mono text-xs tracking-[0.2em] uppercase mb-2" style={{ color: "#38bdf8" }}>
            Admin Access
          </p>
          <h1 className="font-mono font-bold text-white text-xl tracking-[-0.02em]">
            MY.<span style={{ color: "#38bdf8" }}>Portfolio</span>
          </h1>
          <p className="font-mono text-[10px] tracking-[0.12em] mt-2" style={{ color: "rgba(255,255,255,0.3)" }}>
            Restricted — Madhav only
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="font-mono text-[9px] tracking-[0.18em] uppercase block mb-2" style={{ color: "rgba(255,255,255,0.4)" }}>
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              autoFocus
              placeholder="Enter admin password"
              className="w-full px-4 py-3 rounded-lg font-mono text-sm text-white outline-none transition-all"
              style={{
                background: "rgba(255,255,255,0.06)",
                border: error ? "1px solid rgba(248,113,113,0.5)" : "1px solid rgba(255,255,255,0.12)",
                caretColor: "#38bdf8",
              }}
              onFocus={e => { e.target.style.borderColor = "rgba(56,189,248,0.4)"; }}
              onBlur={e => { e.target.style.borderColor = error ? "rgba(248,113,113,0.5)" : "rgba(255,255,255,0.12)"; }}
            />
            {error && (
              <p className="font-mono text-[10px] mt-1.5" style={{ color: "#f87171" }}>
                {error}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading || !password}
            className="w-full py-3 rounded-lg font-mono text-[11px] tracking-[0.14em] uppercase font-bold text-black transition-all"
            style={{
              background: loading || !password
                ? "rgba(56,189,248,0.3)"
                : "linear-gradient(135deg,#38bdf8,#818cf8)",
              cursor: loading || !password ? "not-allowed" : "pointer",
            }}
          >
            {loading ? "Verifying…" : "Enter"}
          </button>
        </form>

        <p className="text-center font-mono text-[8px] tracking-[0.12em] uppercase mt-6" style={{ color: "rgba(255,255,255,0.18)" }}>
          © {new Date().getFullYear()} Madhav Yalamarthi
        </p>
      </div>
    </div>
  );
}
