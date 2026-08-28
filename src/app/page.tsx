import { readFileSync } from "fs";
import path from "path";
import PortfolioShell from "@/components/PortfolioShell";
import type { Project, AcademicData, Achievement, ResearchPaper, HobbiesData } from "@/lib/types";

function readData<T>(filename: string): T {
  const filePath = path.join(process.cwd(), "data", filename);
  return JSON.parse(readFileSync(filePath, "utf-8")) as T;
}

export default function Home() {
  const projects     = readData<Project[]>("projects.json");
  const academic     = readData<AcademicData>("academic.json");
  const achievements = readData<Achievement[]>("achievements.json");
  const research     = readData<ResearchPaper[]>("research.json");
  const hobbies      = readData<HobbiesData>("hobbies.json");

  return (
    <PortfolioShell
      projects={projects}
      academic={academic}
      achievements={achievements}
      research={research}
      hobbies={hobbies}
    />
  );
}
