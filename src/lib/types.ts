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
