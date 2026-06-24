import { readFileSync } from "fs";
import path from "path";
import AnalyticsClient from "./AnalyticsClient";
import type { Project, AcademicData, Achievement, ResearchPaper } from "@/lib/types";

function read<T>(file: string): T {
  return JSON.parse(readFileSync(path.join(process.cwd(), "data", file), "utf-8")) as T;
}

export default function AnalyticsPage() {
  const projects     = read<Project[]>("projects.json");
  const academic     = read<AcademicData>("academic.json");
  const achievements = read<Achievement[]>("achievements.json");
  const research     = read<ResearchPaper[]>("research.json");

  return <AnalyticsClient projects={projects} academic={academic} achievements={achievements} research={research} />;
}
