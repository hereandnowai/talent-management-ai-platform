
import { Employee, Role, TrainingProgram } from '../types';

const firstNames = ["Alice", "Bob", "Charlie", "Diana", "Edward", "Fiona", "George", "Hannah", "Ian", "Julia", "Kevin", "Laura"];
const lastNames = ["Smith", "Jones", "Williams", "Brown", "Davis", "Miller", "Wilson", "Moore", "Taylor", "Anderson", "Thomas"];
const roles = ["Software Engineer", "Product Manager", "UX Designer", "Data Scientist", "Marketing Specialist", "HR Manager", "Sales Representative", "DevOps Engineer", "QA Tester", "Project Manager"];
const departments = ["Engineering", "Product", "Design", "Data Science", "Marketing", "Human Resources", "Sales", "Operations"];
const skills = [
  "JavaScript", "Python", "React", "Node.js", "SQL", "Communication", "Leadership", "Project Management", "Agile", "AWS", 
  "Machine Learning", "Strategic Planning", "Team Building", "Public Speaking", "Data Analysis", "Figma", "Canva", "Google Ads"
];
const achievements = [
  "Launched new product feature", "Exceeded sales targets by 20%", "Improved team efficiency by 15%", 
  "Mentored junior team member", "Led successful project completion", "Received positive client feedback",
  "Implemented new HR policy", "Reduced operational costs"
];
const careerGoalsList = [
    "Become a team lead", "Transition to a management role", "Specialize in AI/ML", "Improve public speaking skills",
    "Gain cross-functional experience", "Lead a major product launch", "Develop expertise in cloud architecture"
];
const developmentPlanItems = [
    "Complete Advanced React course", "Attend leadership workshop", "Shadow senior manager", "Obtain AWS certification",
    "Lead a small project", "Improve presentation skills through practice"
];

const getRandomElement = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];
const getRandomSubset = <T,>(arr: T[], maxCount: number = 3): T[] => {
  const shuffled = [...arr].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, Math.floor(Math.random() * maxCount) + 1);
};
const getRandomNumber = (min: number, max: number): number => Math.floor(Math.random() * (max - min + 1)) + min;

export const getMockEmployees = (count: number): Employee[] => {
  const mockEmployees: Employee[] = [];
  for (let i = 0; i < count; i++) {
    const id = `emp-${Date.now()}-${i}`;
    mockEmployees.push({
      id,
      name: `${getRandomElement(firstNames)} ${getRandomElement(lastNames)}`,
      role: getRandomElement(roles),
      department: getRandomElement(departments),
      skills: getRandomSubset(skills, 5),
      achievements: getRandomSubset(achievements, 3),
      performanceScore: getRandomNumber(60, 98),
      potentialScore: getRandomNumber(50, 99),
      engagementScore: getRandomNumber(40, 95),
      attritionRisk: getRandomNumber(5, 75),
      careerGoals: getRandomElement(careerGoalsList),
      developmentPlan: getRandomSubset(developmentPlanItems, 2),
      photoUrl: `https://picsum.photos/seed/${id}/200/200`,
      email: `${firstNames[i % firstNames.length].toLowerCase()}.${lastNames[i % lastNames.length].toLowerCase()}@example.com`,
      yearsAtCompany: getRandomNumber(1,10)
    });
  }
  return mockEmployees;
};

const roleTitles = [
    "Senior Software Engineer", "Engineering Manager", "Director of Product", "Lead Data Scientist", 
    "Marketing Director", "VP of Sales", "Chief Technology Officer", "HR Business Partner", "Principal UX Designer"
];
const experienceLevels = ["Associate", "Mid-Level", "Senior", "Lead", "Principal", "Manager", "Director", "VP"];

export const getMockRoles = (count: number): Role[] => {
  const mockRoles: Role[] = [];
  for (let i = 0; i < count; i++) {
    mockRoles.push({
      id: `role-${Date.now()}-${i}`,
      title: getRandomElement(roleTitles),
      description: `Responsible for leading ${getRandomElement(departments)} initiatives and driving innovation. This role requires strong ${getRandomElement(skills)} and ${getRandomElement(skills)} skills.`,
      requiredSkills: getRandomSubset(skills, 4),
      department: getRandomElement(departments),
      salaryRange: `$${getRandomNumber(70, 120)}k - $${getRandomNumber(130, 200)}k`,
      experienceLevel: getRandomElement(experienceLevels)
    });
  }
  return mockRoles;
};

const programNames = [
  "Future Leaders Program", "Tech Innovators Bootcamp", "Strategic Management Workshop", 
  "Advanced Communication Skills", "Data-Driven Decision Making", "Agile Project Leadership",
  "Inclusive Leadership Training", "Executive Presence Coaching"
];
const programDurations = ["3 Weeks", "6 Months", "40 Hours", "3 Days Intensive", "Ongoing Mentorship"];
const programProviders = ["Internal L&D", "Coursera", "LinkedIn Learning", "ExecEd Inc.", "University Extension"];

export const getMockTrainingPrograms = (count: number): TrainingProgram[] => {
  const mockPrograms: TrainingProgram[] = [];
  for (let i = 0; i < count; i++) {
    const name = getRandomElement(programNames);
    mockPrograms.push({
      id: `prog-${Date.now()}-${i}`,
      name: name,
      description: `A comprehensive program designed to enhance ${getRandomElement(skills)} and ${getRandomElement(skills)}. Ideal for ${getRandomElement(roles)} looking to advance their careers. This program focuses on practical application and real-world scenarios.`,
      targetAudience: [getRandomElement(roles), `Aspiring ${getRandomElement(experienceLevels)}`],
      duration: getRandomElement(programDurations),
      skillsGained: getRandomSubset(skills, 4),
      provider: getRandomElement(programProviders)
    });
  }
  return mockPrograms;
};
