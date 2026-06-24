import { readFileSync } from "fs";
import path from "path";
import AdminDashboard from "@/components/admin/AdminDashboard";
import type { Project, Achievement, ResearchPaper, AcademicData } from "@/lib/types";

function readData<T>(filename: string): T {
  const filePath = path.join(process.cwd(), "data", filename);
  return JSON.parse(readFileSync(filePath, "utf-8")) as T;
}

export default function AdminPage() {
  const projects = readData<Project[]>("projects.json");
  const achievements = readData<Achievement[]>("achievements.json");
  const research = readData<ResearchPaper[]>("research.json");
  const academic = readData<AcademicData>("academic.json");

  return (
    <AdminDashboard
      projects={projects}
      achievements={achievements}
      research={research}
      academic={academic}
    />
  );
}
