"use client";
import { useState } from "react";
import type { Project } from "@/lib/types";

const EMPTY: Omit<Project, "id" | "order"> = {
  title: "", description: "", longDescription: "",
  category: [], tags: [], github: "", demo: "",
  emoji: "🚀", gradient: "from-indigo-950 via-violet-950 to-indigo-950",
  featured: false, visible: true, impact: "",
};

interface Props { projects: Project[]; onToast: (m: string, t?: "success"|"error") => void; }

export default function ProjectsAdmin({ projects, onToast }: Props) {
  const [list, setList] = useState<Project[]>(projects);
  const [editing, setEditing] = useState<Project | null>(null);
  const [form, setForm] = useState<Omit<Project,"id"|"order">>(EMPTY);
  const [saving, setSaving] = useState(false);

  const save = async () => {
    setSaving(true);
    const payload = editing
      ? list.map(p => p.id === editing.id ? { ...p, ...form } : p)
      : [...list, { ...form, id: Date.now().toString(), order: list.length + 1, category: typeof form.category === "string" ? (form.category as string).split(",").map(s=>s.trim()) : form.category, tags: typeof form.tags === "string" ? (form.tags as unknown as string).split(",").map((s: string)=>s.trim()) : form.tags }];
    try {
      const res = await fetch("/api/projects", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      if (!res.ok) throw new Error();
      setList(payload);
      setEditing(null);
      setForm(EMPTY);
      onToast("Projects saved successfully!");
    } catch {
      onToast("Failed to save. Check console.", "error");
    } finally { setSaving(false); }
  };

  const del = async (id: string) => {
    if (!confirm("Delete this project?")) return;
    const payload = list.filter(p => p.id !== id);
    await fetch("/api/projects", { method: "POST", headers: { "Content-Type":"application/json" }, body: JSON.stringify(payload) });
    setList(payload);
    onToast("Project deleted.");
  };

  const startEdit = (p: Project) => { setEditing(p); setForm({ ...p }); window.scrollTo({ top: 0, behavior: "smooth" }); };

  const inp = (field: keyof typeof form) => ({
    value: Array.isArray((form as Record<string,unknown>)[field]) ? ((form as Record<string,unknown>)[field] as string[]).join(", ") : String((form as Record<string,unknown>)[field] ?? ""),
    onChange: (e: React.ChangeEvent<HTMLInputElement|HTMLTextAreaElement|HTMLSelectElement>) => {
      setForm(prev => ({ ...prev, [field]: e.target.value }));
    },
  });

  return (
    <div>
      <h2 className="font-extrabold text-[24px] tracking-[-0.03em] mb-2" style={{ fontFamily:"var(--font-syne,sans-serif)" }}>
        {editing ? "Edit Project" : "Add New Project"}
      </h2>
      <p className="text-sm mb-8" style={{ color: "rgba(240,244,255,0.4)" }}>
        Changes are saved to <code style={{ color:"#8b5cf6" }}>data/projects.json</code> and reflected live on the portfolio.
      </p>

      {/* Form */}
      <div className="rounded-2xl p-7 mb-10 grid grid-cols-1 md:grid-cols-2 gap-5"
           style={{ background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.08)" }}>
        <div className="md:col-span-2">
          <label className="admin-label">Project Title *</label>
          <input className="admin-input" placeholder="e.g. Advanced Face Biometric System" {...inp("title")} />
        </div>
        <div className="md:col-span-2">
          <label className="admin-label">Short Description *</label>
          <textarea className="admin-input" rows={2} placeholder="One-line project description shown on cards" {...inp("description")} />
        </div>
        <div className="md:col-span-2">
          <label className="admin-label">Long Description</label>
          <textarea className="admin-input" rows={3} placeholder="Detailed description for expanded view" {...inp("longDescription")} />
        </div>
        <div>
          <label className="admin-label">Categories (comma-separated)</label>
          <input className="admin-input" placeholder="ai, cv, nlp, fullstack, hackathon, research" {...inp("category")} />
        </div>
        <div>
          <label className="admin-label">Tech Tags (comma-separated)</label>
          <input className="admin-input" placeholder="Python, Flask, OpenCV, TensorFlow" {...inp("tags")} />
        </div>
        <div>
          <label className="admin-label">GitHub URL</label>
          <input className="admin-input" placeholder="https://github.com/..." {...inp("github")} />
        </div>
        <div>
          <label className="admin-label">Demo / Live URL</label>
          <input className="admin-input" placeholder="https://..." {...inp("demo")} />
        </div>
        <div>
          <label className="admin-label">Emoji</label>
          <input className="admin-input" placeholder="🚀" maxLength={2} {...inp("emoji")} />
        </div>
        <div>
          <label className="admin-label">Impact Label</label>
          <input className="admin-input" placeholder="e.g. 🥈 IIT Madras National" {...inp("impact")} />
        </div>
        <div style={{ display:"flex", gap:16, alignItems:"center" }}>
          <label style={{ display:"flex", alignItems:"center", gap:8, cursor:"pointer" }}>
            <input type="checkbox" checked={form.featured} onChange={e => setForm(prev => ({ ...prev, featured: e.target.checked }))} />
            <span className="admin-label" style={{ margin:0 }}>Featured (large card)</span>
          </label>
          <label style={{ display:"flex", alignItems:"center", gap:8, cursor:"pointer" }}>
            <input type="checkbox" checked={form.visible} onChange={e => setForm(prev => ({ ...prev, visible: e.target.checked }))} />
            <span className="admin-label" style={{ margin:0 }}>Visible on portfolio</span>
          </label>
        </div>

        <div className="md:col-span-2 flex gap-3">
          <button className="admin-btn" onClick={save} disabled={saving}>
            {saving ? "Saving..." : editing ? "Update Project" : "Add Project"}
          </button>
          {editing && (
            <button className="admin-btn-sm" onClick={() => { setEditing(null); setForm(EMPTY); }}>Cancel</button>
          )}
        </div>
      </div>

      {/* Project list */}
      <h3 className="font-bold text-[18px] mb-4" style={{ fontFamily:"var(--font-syne,sans-serif)" }}>
        All Projects ({list.length})
      </h3>
      <div className="flex flex-col gap-3">
        {list.sort((a,b)=>a.order-b.order).map(p => (
          <div key={p.id} className="flex items-center justify-between gap-4 rounded-xl px-5 py-4"
               style={{ background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.07)", opacity: p.visible ? 1 : 0.5 }}>
            <div className="flex items-center gap-3 min-w-0">
              <span className="text-[20px]">{p.emoji}</span>
              <div className="min-w-0">
                <div className="font-medium text-[14px] text-white truncate">{p.title}</div>
                <div className="font-mono text-[9px] tracking-[0.1em] uppercase" style={{ color:"rgba(240,244,255,0.35)" }}>
                  {p.category.join(" · ")} {p.featured ? "· ⭐ Featured" : ""} {!p.visible ? "· Hidden" : ""}
                </div>
              </div>
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
