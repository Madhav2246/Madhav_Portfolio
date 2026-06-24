"use client";
import { useState } from "react";
import type { AcademicData, AttendanceRecord } from "@/lib/types";

interface Props { academic: AcademicData; onToast: (m: string, t?: "success"|"error") => void; }

export default function AcademicAdmin({ academic, onToast }: Props) {
  const [cgpa, setCgpa] = useState(String(academic.currentCGPA));
  const [year, setYear] = useState(String(academic.year));
  const [attendance, setAttendance] = useState<AttendanceRecord[]>(academic.attendance);
  const [saving, setSaving] = useState(false);

  // Add new subject
  const [newSubj, setNewSubj] = useState<AttendanceRecord>({ subject:"", code:"", attended:0, total:0, percentage:0 });

  const addSubject = () => {
    if (!newSubj.subject) return;
    const pct = newSubj.total > 0 ? Math.round((newSubj.attended / newSubj.total) * 1000) / 10 : 0;
    setAttendance(prev => [...prev, { ...newSubj, percentage: pct }]);
    setNewSubj({ subject:"", code:"", attended:0, total:0, percentage:0 });
  };

  const updateAttendance = (i: number, field: keyof AttendanceRecord, val: string | number) => {
    setAttendance(prev => {
      const next = [...prev];
      const updated = { ...next[i], [field]: typeof next[i][field] === "number" ? Number(val) : val };
      if (field === "attended" || field === "total") {
        updated.percentage = updated.total > 0 ? Math.round((updated.attended / updated.total) * 1000) / 10 : 0;
      }
      next[i] = updated;
      return next;
    });
  };

  const removeSubject = (i: number) => setAttendance(prev => prev.filter((_, idx) => idx !== i));

  const save = async () => {
    setSaving(true);
    const payload = { ...academic, currentCGPA: parseFloat(cgpa), year: parseInt(year), attendance };
    try {
      const res = await fetch("/api/academic", { method: "POST", headers: {"Content-Type":"application/json"}, body: JSON.stringify(payload) });
      if (!res.ok) throw new Error();
      onToast("Academic data saved!");
    } catch { onToast("Save failed.", "error"); }
    finally { setSaving(false); }
  };

  return (
    <div>
      <h2 className="font-extrabold text-[24px] tracking-[-0.03em] mb-2" style={{ fontFamily:"var(--font-syne,sans-serif)" }}>
        Academic Data
      </h2>
      <p className="text-sm mb-8" style={{ color:"rgba(240,244,255,0.4)" }}>
        Update your CGPA and attendance here. Changes reflect live on the portfolio.
      </p>

      {/* CGPA */}
      <div className="rounded-2xl p-7 mb-6" style={{ background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.08)" }}>
        <h3 className="font-bold text-[16px] mb-4" style={{ fontFamily:"var(--font-syne,sans-serif)" }}>📊 Current Academic Status</h3>
        <div className="grid grid-cols-2 gap-5">
          <div>
            <label className="admin-label">Current CGPA (out of {academic.cgpaOutOf})</label>
            <input className="admin-input" type="number" step="0.01" min="0" max="10" value={cgpa} onChange={e => setCgpa(e.target.value)} />
          </div>
          <div>
            <label className="admin-label">Current Year (1–{academic.totalYears})</label>
            <input className="admin-input" type="number" min="1" max={academic.totalYears} value={year} onChange={e => setYear(e.target.value)} />
          </div>
        </div>
      </div>

      {/* Attendance */}
      <div className="rounded-2xl p-7 mb-6" style={{ background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.08)" }}>
        <h3 className="font-bold text-[16px] mb-4" style={{ fontFamily:"var(--font-syne,sans-serif)" }}>📅 Subject Attendance</h3>

        {/* Existing subjects */}
        <div className="flex flex-col gap-3 mb-6">
          {attendance.map((s, i) => (
            <div key={i} className="grid grid-cols-[2fr_1fr_80px_80px_80px_auto] gap-2 items-center">
              <input className="admin-input" value={s.subject} onChange={e => updateAttendance(i, "subject", e.target.value)} placeholder="Subject name" />
              <input className="admin-input" value={s.code} onChange={e => updateAttendance(i, "code", e.target.value)} placeholder="Code" />
              <input className="admin-input" type="number" value={s.attended} onChange={e => updateAttendance(i, "attended", e.target.value)} placeholder="Attended" />
              <input className="admin-input" type="number" value={s.total} onChange={e => updateAttendance(i, "total", e.target.value)} placeholder="Total" />
              <div className="text-center font-mono text-sm font-bold"
                   style={{ color: s.percentage >= 85 ? "#10b981" : s.percentage >= 75 ? "#f59e0b" : "#f43f5e" }}>
                {s.percentage.toFixed(1)}%
              </div>
              <button className="admin-btn-sm admin-btn-danger" onClick={() => removeSubject(i)}>✕</button>
            </div>
          ))}
        </div>

        {/* Add new subject */}
        <div className="border-t border-white/[0.07] pt-5">
          <div className="font-mono text-[10px] tracking-[0.1em] uppercase mb-3" style={{ color:"rgba(240,244,255,0.35)" }}>
            Add New Subject
          </div>
          <div className="grid grid-cols-[2fr_1fr_80px_80px_auto] gap-2 items-end">
            <div>
              <label className="admin-label">Subject Name</label>
              <input className="admin-input" placeholder="Deep Learning" value={newSubj.subject} onChange={e => setNewSubj(p=>({...p, subject:e.target.value}))} />
            </div>
            <div>
              <label className="admin-label">Code</label>
              <input className="admin-input" placeholder="24AIE304" value={newSubj.code} onChange={e => setNewSubj(p=>({...p, code:e.target.value}))} />
            </div>
            <div>
              <label className="admin-label">Attended</label>
              <input className="admin-input" type="number" value={newSubj.attended} onChange={e => setNewSubj(p=>({...p, attended:parseInt(e.target.value)||0}))} />
            </div>
            <div>
              <label className="admin-label">Total</label>
              <input className="admin-input" type="number" value={newSubj.total} onChange={e => setNewSubj(p=>({...p, total:parseInt(e.target.value)||0}))} />
            </div>
            <button className="admin-btn" onClick={addSubject} style={{ marginBottom:0 }}>Add</button>
          </div>
        </div>
      </div>

      <button className="admin-btn" onClick={save} disabled={saving}>
        {saving ? "Saving..." : "Save All Academic Data"}
      </button>
    </div>
  );
}
