
export interface Employee {
  id: string;
  name: string;
  role: string;
  department: string;
  skills: string[];
  achievements: string[];
  performanceScore: number; // 0-100
  potentialScore: number; // 0-100
  engagementScore: number; // 0-100
  attritionRisk: number; // 0-100 (percentage)
  careerGoals: string;
  developmentPlan: string[];
  photoUrl: string;
  email: string;
  yearsAtCompany: number;
}

export interface Role {
  id: string;
  title: string;
  description: string;
  requiredSkills: string[];
  department: string;
  salaryRange: string;
  experienceLevel: string; // e.g., Junior, Mid, Senior, Lead
}

export interface TrainingProgram {
  id: string;
  name: string;
  description: string;
  targetAudience: string[]; // e.g., roles or skill sets
  duration: string; // e.g., "3 weeks", "20 hours"
  skillsGained: string[];
  provider?: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'bot' | 'system';
  text: string;
  timestamp: Date;
  metadata?: Record<string, any>; // For grounding chunks, etc.
}

export interface GroundingChunk {
  web?: {
    uri: string;
    title: string;
  };
  retrievedContext?: {
    uri: string;
    title: string;
  };
  // Add other types of chunks if needed
}

export interface SkillGap {
  skill: string;
  currentLevel: number; // 1-5
  desiredLevel: number; // 1-5
  gap: number;
}

export interface ForecastData {
  period: string;
  demand: number;
  supply: number;
  gap?: number;
}
