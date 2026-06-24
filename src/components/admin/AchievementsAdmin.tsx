"use client";
import { useState } from "react";
import type { Achievement } from "@/lib/types";

const EMPTY: Omit<Achievement, "id"> = {
  type: "hackathon", title: "", rank: "", rankLabel: "", organizer: "",
  prize: "", date: new Date().getFullYear().toString(), description: "",
  tags: [], link: "", tier: "bronze", issuer: "", organization: "",
  role: "", visible: true,
};

interface Props { achievements: Achievement[]; onToast: (m: string, t?: "success" | "error") => void; }

export default function AchievementsAdmin({ achievements, onToast }: Props) {
  const [list, setList] = useState<Achievement[]>(achievements);
  const [editing, setEditing] = useState<Achievement | null>(null);
  const [form, setForm] = useState<Omit<Achievement,"id">>(EMPTY);
  const [saving, setSaving] = useState(false);

  const save = async () => {
    setSaving(true);
    const payload = editing
      ? list.map(a => a.id === editing.id ? { ...editing, ...form } : a)
      : [...list, { ...form, id: `ach_${Date.now()}`, tags: typeof form.tags === "string" ? (form.tags as unknown as string).split(",").map((s: string) => s.trim()).filter(Boolean) : form.tags }];
    try {
      const res = await fetch("/api/achievements", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      if (!res.ok) throw new Error();
      setList(payload);
      setEditing(null);
      setForm(EMPTY);
      onToast("Achievements saved!");
    } catch { onToast("Save failed.", "error"); }
    finally { setSaving(false); }
  };

  const del = async (id: string) => {
    if (!confirm("Delete this achievement?")) return;
    const payload = list.filter(a => a.id !== id);
    await fetch("/api/achievements", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
    setList(payload);
    onToast("Deleted.");
  };

  const startEdit = (a: Achievement) => { setEditing(a); setForm({ ...a }); window.scrollTo({ top: 0, behavior: "smooth" }); };

  const set = (field: keyof Omit<Achievement,"id">, val: string | boolean) =>
    setForm(prev => ({ ...prev, [field]: val }));

  return (
    <div>
      <h2 className="font-extrabold text-[24px] tracking-[-0.03em] mb-2" style={{ fontFamily: "var(--font-syne,sans-serif)" }}>
        {editing ? "Edit Achievement" : "Add Achievement"}
      </h2>
      <p className="text-sm mb-8" style={{ color: "rgba(240,244,255,0.4)" }}>
        Add hackathons, certifications, or leadership roles. They appear dynamically on the portfolio.
      </p>

      {/* Form */}
      <div className="rounded-2xl p-7 mb-10 grid grid-cols-1 md:grid-cols-2 gap-5"
           style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}>
        {/* Type */}
        <div>
          <label className="admin-label">Type *</label>
          <select className="admin-input" value={form.type} onChange={e => set("type", e.target.value)}>
            <option value="hackathon">Hackathon</option>
            <option value="certification">Certification</option>
            <option value="leadership">Leadership</option>
          </select>
        </div>
        <div>
          <label className="admin-label">Tier (Hackathon only)</label>
          <select className="admin-input" value={form.tier || "bronze"} onChange={e => set("tier", e.target.value)}>
            <option value="gold">Gold (Full-width featured)</option>
            <option value="silver">Silver</option>
            <option value="bronze">Bronze</option>
          </select>
        </div>

        <div className="md:col-span-2">
          <label className="admin-label">Title *</label>
          <input className="admin-input" placeholder="e.g. National Road Safety Hackathon 2025" value={form.title} onChange={e => set("title", e.target.value)} />
        </div>

        {/* Hackathon fields */}
        {form.type === "hackathon" && (
          <>
            <div>
              <label className="admin-label">Rank</label>
              <input className="admin-input" placeholder="e.g. 2nd" value={form.rank || ""} onChange={e => set("rank", e.target.value)} />
            </div>
            <div>
              <label className="admin-label">Rank Label</label>
              <input className="admin-input" placeholder="e.g. National" value={form.rankLabel || ""} onChange={e => set("rankLabel", e.target.value)} />
            </div>
            <div>
              <label className="admin-label">Organizer</label>
              <input className="admin-input" placeholder="e.g. IIT Madras · CoERS" value={form.organizer || ""} onChange={e => set("organizer", e.target.value)} />
            </div>
            <div>
              <label className="admin-label">Prize</label>
              <input className="admin-input" placeholder="e.g. ₹90K Prize Pool" value={form.prize || ""} onChange={e => set("prize", e.target.value)} />
            </div>
            <div className="md:col-span-2">
              <label className="admin-label">Description</label>
              <textarea className="admin-input" rows={3} placeholder="What did you build? What was the impact?" value={form.description || ""} onChange={e => set("description", e.target.value)} />
            </div>
            <div className="md:col-span-2">
              <label className="admin-label">Tech Tags (comma-separated)</label>
              <input className="admin-input" placeholder="React, Python, NLP" value={Array.isArray(form.tags) ? form.tags.join(", ") : (form.tags || "")} onChange={e => set("tags", e.target.value)} />
            </div>
          </>
        )}

        {/* Certification fields */}
        {form.type === "certification" && (
          <div>
            <label className="admin-label">Issuer</label>
            <input className="admin-input" placeholder="e.g. Kaggle, DataCamp" value={form.issuer || ""} onChange={e => set("issuer", e.target.value)} />
          </div>
        )}

        {/* Leadership fields */}
        {form.type === "leadership" && (
          <>
            <div>
              <label className="admin-label">Organization</label>
              <input className="admin-input" placeholder="e.g. ACM · Amrita Vishwa Vidyapeetham" value={form.organization || ""} onChange={e => set("organization", e.target.value)} />
            </div>
            <div>
              <label className="admin-label">Role</label>
              <input className="admin-input" placeholder="e.g. Ex-Mentor" value={form.role || ""} onChange={e => set("role", e.target.value)} />
            </div>
            <div className="md:col-span-2">
              <label className="admin-label">Description</label>
              <textarea className="admin-input" rows={3} placeholder="Describe your impact and responsibilities" value={form.description || ""} onChange={e => set("description", e.target.value)} />
            </div>
          </>
        )}

        <div>
          <label className="admin-label">Date / Year</label>
          <input className="admin-input" placeholder="e.g. 2025" value={form.date} onChange={e => set("date", e.target.value)} />
        </div>
        <div>
          <label className="admin-label">Link (LinkedIn, DevPost, etc.)</label>
          <input className="admin-input" placeholder="https://..." value={form.link} onChange={e => set("link", e.target.value)} />
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <input type="checkbox" checked={form.visible} onChange={e => set("visible", e.target.checked)} id="ach-visible" />
          <label htmlFor="ach-visible" className="admin-label" style={{ margin: 0 }}>Visible on portfolio</label>
        </div>

        <div className="md:col-span-2 flex gap-3">
          <button className="admin-btn" onClick={save} disabled={saving}>
            {saving ? "Saving..." : editing ? "Update Achievement" : "Add Achievement"}
          </button>
          {editing && (
            <button className="admin-btn-sm" onClick={() => { setEditing(null); setForm(EMPTY); }}>Cancel</button>
          )}
        </div>
      </div>

      {/* List */}
      <h3 className="font-bold text-[18px] mb-4" style={{ fontFamily: "var(--font-syne,sans-serif)" }}>
        All Achievements ({list.length})
      </h3>
      <div className="flex flex-col gap-3">
        {list.map(a => (
          <div key={a.id} className="flex items-center justify-between gap-4 rounded-xl px-5 py-4"
               style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", opacity: a.visible ? 1 : 0.5 }}>
            <div className="min-w-0">
              <div className="font-medium text-[14px] text-white truncate">{a.title}</div>
              <div className="font-mono text-[9px] tracking-[0.1em] uppercase" style={{ color: "rgba(240,244,255,0.35)" }}>
                {a.type} · {a.date} {a.rank ? `· Rank: ${a.rank}` : ""} {!a.visible ? "· Hidden" : ""}
              </div>
            </div>
            <div className="flex gap-2 shrink-0">
              <button className="admin-btn-sm" onClick={() => startEdit(a)}>Edit</button>
              <button className="admin-btn-sm admin-btn-danger" onClick={() => del(a.id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
