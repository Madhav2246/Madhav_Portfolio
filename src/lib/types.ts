// Navigation section identifiers — shared across all components
export type SectionId =
  | "hero" | "home" | "about" | "projects" | "skills"
  | "research" | "achievements" | "passions" | "contact" | "arcade";

export interface Project {

  id: string;
  title: string;
  description: string;
  longDescription: string;
  category: string[];
  tags: string[];
  github: string;
  demo: string;
  emoji: string;
  gradient: string;
  featured: boolean;
  visible: boolean;
  impact: string;
  order: number;
}

export interface SemesterGrade {
  semester: string;
  cgpa: number;
  year: string;
}

export interface AttendanceRecord {
  subject: string;
  code: string;
  attended: number;
  total: number;
  percentage: number;
}

export interface EducationEntry {
  institution: string;
  degree: string;
  period: string;
  location: string;
  grade: string;
  gradeLabel: string;
  current: boolean;
}

export interface AcademicData {
  currentCGPA: number;
  cgpaOutOf: number;
  institution: string;
  degree: string;
  year: number;
  totalYears: number;
  graduationYear: number;
  semesterHistory: SemesterGrade[];
  attendance: AttendanceRecord[];
  education: EducationEntry[];
}

export interface Achievement {
  id: string;
  type: "hackathon" | "certification" | "leadership";
  title: string;
  rank?: string;
  rankLabel?: string;
  organizer?: string;
  prize?: string;
  date: string;
  description?: string;
  tags?: string[];
  link: string;
  tier?: "gold" | "silver" | "bronze";
  issuer?: string;
  organization?: string;
  role?: string;
  visible: boolean;
}

export interface ResearchMetric {
  value: string;
  label: string;
}

export interface ResearchPaper {
  id: string;
  num: string;
  title: string;
  domain: string;
  status: "in-progress" | "published" | "submitted";
  abstract: string;
  tags: string[];
  metrics: ResearchMetric[];
  course: string;
  visible: boolean;
  order: number;
}

export interface SoftSkill {
  id: string;
  name: string;
  category: "Leadership" | "Collaboration" | "Strategy" | "Execution";
  description: string;
  icon: string;
  highlights: string[];
}

export interface FavoriteMovie {
  id: string;
  title: string;
  year: number;
  director: string;
  genre: string;
  vibe: string;
  note: string;
}

export interface TriviaQuestion {
  id: string;
  quoteOrQuestion: string;
  context?: string;
  options: string[];
  answer: number;
  explanation: string;
}

export interface DirectorEntry {
  name: string;
  signature: string;
  emoji: string;
}

export interface HobbiesData {
  cricket: {
    role: string;
    favoritePlayer: string;
    battingStyle: string;
    stats: { label: string; value: string }[];
    philosophy: string;
  };
  cinema: {
    philosophy: string;
    favoriteActors: string[];
    favoriteDirectors: DirectorEntry[];
    topGenres: string[];
    favoriteMovies: FavoriteMovie[];
    trivia: TriviaQuestion[];
  };
  softSkills: SoftSkill[];
}
