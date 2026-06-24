"use client";
import { useState } from "react";
import type { ResearchPaper, ResearchMetric } from "@/lib/types";

const EMPTY: Omit<ResearchPaper, "id" | "order"> = {
  num: "R — 0X", title: "", domain: "", status: "in-progress",
  abstract: "", tags: [], metrics: [], course: "", visible: true,
};

interface Props { research: ResearchPaper[]; onToast: (m: string, t?: "success" | "error") => void; }

export default function ResearchAdmin({ research, onToast }: Props) {
  const [list, setList] = useState<ResearchPaper[]>(research);
  const [editing, setEditing] = useState<ResearchPaper | null>(null);
  const [form, setForm] = useState<Omit<ResearchPaper,"id"|"order">>(EMPTY);
  const [metricsRaw, setMetricsRaw] = useState(""); // "0.94 ROC-AUC, 92% Accuracy"
  const [saving, setSaving] = useState(false);

  const parseMetrics = (raw: string): ResearchMetric[] =>
    raw.split(",").map(part => {
      const trimmed = part.trim();
      const match = trimmed.match(/^([^\s]+)\s+(.+)$/);
      return match ? { value: match[1], label: match[2] } : { value: trimmed, label: "" };
    }).filter(m => m.value);

  const save = async () => {
    setSaving(true);
    const metrics = parseMetrics(metricsRaw);
    const tagsArr = typeof form.tags === "string"
      ? (form.tags as unknown as string).split(",").map((s: string) => s.trim()).filter(Boolean)
      : form.tags;
    const payload = editing
      ? list.map(p => p.id === editing.id ? { ...editing, ...form, metrics, tags: tagsArr } : p)
      : [...list, { ...form, id: `res_${Date.now()}`, order: list.length + 1, metrics, tags: tagsArr }];
    try {
      const res = await fetch("/api/research", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      if (!res.ok) throw new Error();
      setList(payload);
      setEditing(null);
      setForm(EMPTY);
      setMetricsRaw("");
      onToast("Research saved!");
    } catch { onToast("Save failed.", "error"); }
    finally { setSaving(false); }
  };

  const del = async (id: string) => {
    if (!confirm("Delete this research entry?")) return;
    const payload = list.filter(p => p.id !== id);
    await fetch("/api/research", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
    setList(payload);
    onToast("Deleted.");
  };

  const startEdit = (p: ResearchPaper) => {
    setEditing(p);
    setForm({ ...p });
    setMetricsRaw(p.metrics.map(m => `${m.value} ${m.label}`).join(", "));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const set = (field: keyof Omit<ResearchPaper, "id" | "order">, val: string | boolean) =>
    setForm(prev => ({ ...prev, [field]: val }));

  return (
    <div>
      <h2 className="font-extrabold text-[24px] tracking-[-0.03em] mb-2" style={{ fontFamily: "var(--font-syne,sans-serif)" }}>
        {editing ? "Edit Research" : "Add Research Paper"}
      </h2>
      <p className="text-sm mb-8" style={{ color: "rgba(240,244,255,0.4)" }}>
        Add or update research tracks. These show on the portfolio with their metrics and status badge.
      </p>

      {/* Form */}
      <div className="rounded-2xl p-7 mb-10 grid grid-cols-1 md:grid-cols-2 gap-5"
           style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}>
        <div>
          <label className="admin-label">Research Number Label</label>
          <input className="admin-input" placeholder="e.g. R — 01" value={form.num} onChange={e => set("num", e.target.value)} />
        </div>
        <div>
          <label className="admin-label">Status</label>
          <select className="admin-input" value={form.status} onChange={e => set("status", e.target.value)}>
            <option value="in-progress">In Progress</option>
            <option value="submitted">Submitted</option>
            <option value="published">Published</option>
          </select>
        </div>
        <div className="md:col-span-2">
          <label className="admin-label">Full Title *</label>
          <input className="admin-input" placeholder="e.g. Multi-Stage Toxicity Prediction..." value={form.title} onChange={e => set("title", e.target.value)} />
        </div>
        <div className="md:col-span-2">
          <label className="admin-label">Domain / Area</label>
          <input className="admin-input" placeholder="e.g. Drug Discovery · Cheminformatics · Graph ML" value={form.domain} onChange={e => set("domain", e.target.value)} />
        </div>
        <div className="md:col-span-2">
          <label className="admin-label">Abstract / Description *</label>
          <textarea className="admin-input" rows={4} placeholder="Describe the research problem, methodology, and key results" value={form.abstract} onChange={e => set("abstract", e.target.value)} />
        </div>
        <div className="md:col-span-2">
          <label className="admin-label">Tech Tags (comma-separated)</label>
          <input className="admin-input" placeholder="PyTorch, GIN, UMAP, RDKit" value={Array.isArray(form.tags) ? form.tags.join(", ") : (form.tags || "")} onChange={e => set("tags", e.target.value)} />
        </div>
        <div className="md:col-span-2">
          <label className="admin-label">Metrics (format: &quot;value label&quot; — comma-separated)</label>
          <input className="admin-input" placeholder='e.g. "0.94 ROC-AUC, 92% Accuracy, 4 Models"' value={metricsRaw} onChange={e => setMetricsRaw(e.target.value)} />
          <div className="mt-1 font-mono text-[9px]" style={{ color: "rgba(240,244,255,0.3)" }}>
            Format each metric as: <code style={{ color: "#8b5cf6" }}>value label</code> — e.g. &ldquo;0.94 ROC-AUC&rdquo;
          </div>
          {metricsRaw && (
            <div className="flex gap-3 mt-2 flex-wrap">
              {parseMetrics(metricsRaw).map((m, i) => (
                <div key={i} className="rounded-lg px-3 py-2 text-center" style={{ background: "rgba(139,92,246,0.1)", border: "1px solid rgba(139,92,246,0.2)" }}>
                  <div className="font-bold text-[16px]" style={{ background: "linear-gradient(135deg,#3b82f6,#8b5cf6)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>{m.value}</div>
                  <div className="font-mono text-[8px] uppercase" style={{ color: "rgba(240,244,255,0.35)" }}>{m.label}</div>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="md:col-span-2">
          <label className="admin-label">Course / Context</label>
          <input className="admin-input" placeholder="e.g. Deep Learning · 24AIE304 · Term Project" value={form.course} onChange={e => set("course", e.target.value)} />
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <input type="checkbox" id="res-visible" checked={form.visible} onChange={e => set("visible", e.target.checked)} />
          <label htmlFor="res-visible" className="admin-label" style={{ margin: 0 }}>Visible on portfolio</label>
        </div>

        <div className="md:col-span-2 flex gap-3">
          <button className="admin-btn" onClick={save} disabled={saving}>
            {saving ? "Saving..." : editing ? "Update Research" : "Add Research"}
          </button>
          {editing && (
            <button className="admin-btn-sm" onClick={() => { setEditing(null); setForm(EMPTY); setMetricsRaw(""); }}>Cancel</button>
          )}
        </div>
      </div>

      {/* List */}
      <h3 className="font-bold text-[18px] mb-4" style={{ fontFamily: "var(--font-syne,sans-serif)" }}>
        All Research ({list.length})
      </h3>
      <div className="flex flex-col gap-3">
        {list.sort((a, b) => a.order - b.order).map(p => (
          <div key={p.id} className="flex items-center justify-between gap-4 rounded-xl px-5 py-4"
               style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", opacity: p.visible ? 1 : 0.5 }}>
            <div className="min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-mono text-[9px] tracking-[0.14em] uppercase" style={{ color: "#8b5cf6" }}>{p.num}</span>
                <span className={`font-mono text-[8px] tracking-[0.1em] uppercase px-2 py-[2px] rounded ${p.status === "published" ? "text-emerald-400" : "text-amber-400"}`}
                      style={{ background: p.status === "published" ? "rgba(16,185,129,0.1)" : "rgba(245,158,11,0.1)" }}>
                  {p.status}
                </span>
              </div>
              <div className="font-medium text-[13px] text-white truncate">{p.title}</div>
              <div className="font-mono text-[9px] uppercase mt-1" style={{ color: "rgba(240,244,255,0.35)" }}>{p.domain}</div>
            </div>
            <div className="flex gap-2 shrink-0">
              <button className="admin-btn-sm" onClick={() => startEdit(p)}>Edit</button>
              <button className="admin-btn-sm admin-btn-danger" onClick={() => del(p.id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
