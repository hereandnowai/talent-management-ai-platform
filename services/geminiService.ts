
import { GoogleGenAI, GenerateContentResponse, Chat } from "@google/genai";
import { Employee, Role, TrainingProgram, SkillGap, ForecastData } from '../types'; // Added ForecastData import
import { GEMINI_API_KEY, BRAND_INFO } from "../constants";

let ai: GoogleGenAI | null = null;

const getAIInstance = (): GoogleGenAI => {
  if (!GEMINI_API_KEY) {
    throw new Error("Gemini API Key is not configured.");
  }
  if (!ai) {
    ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });
  }
  return ai;
};

// Helper to parse JSON, potentially cleaning markdown fences
const parseJsonSafe = <T,>(text: string): T | null => {
  let jsonStr = text.trim();
  const fenceRegex = /^```(\w*)?\s*\n?(.*?)\n?\s*```$/s;
  const match = jsonStr.match(fenceRegex);
  if (match && match[2]) {
    jsonStr = match[2].trim();
  }
  try {
    return JSON.parse(jsonStr) as T;
  } catch (e) {
    console.error("Failed to parse JSON response:", e, "Original text:", text);
    // Try to recover if it's a list of objects but not a valid top-level JSON array
    if (jsonStr.startsWith("{") && jsonStr.endsWith("}")) {
        try {
            const wrappedAsArray = `[${jsonStr.replace(/}\s*{/g, "},{")}]`;
            return JSON.parse(wrappedAsArray) as T;
        } catch (e2) {
             console.error("Failed to parse JSON response after attempting array wrap:", e2);
        }
    }
    return null;
  }
};


export const generateSkillGapAnalysis = async (employee: Employee, desiredRoleTitle: string): Promise<SkillGap[]> => {
  const aiInstance = getAIInstance();
  const prompt = `
    Analyze the skill gap for employee ${employee.name} (current role: ${employee.role}) aspiring for the role of ${desiredRoleTitle}.
    Current skills: ${employee.skills.join(', ')}.
    Assume typical skills for a ${desiredRoleTitle} include [e.g., Leadership, Strategic Planning, Advanced ${employee.skills[0] || 'Relevant Skill'}, Project Management, etc. - you can infer these].
    Provide the analysis as a JSON array of objects, where each object has: "skill" (string), "currentLevel" (number 1-5, estimate based on current role and skills), "desiredLevel" (number 1-5, for ${desiredRoleTitle}), and "gap" (number, desiredLevel - currentLevel).
    Only include skills where there's a gap (gap > 0). Estimate currentLevel based on their existing skills and role.
    Example: [{"skill": "Strategic Planning", "currentLevel": 2, "desiredLevel": 4, "gap": 2}]
  `;

  try {
    const response: GenerateContentResponse = await aiInstance.models.generateContent({
      model: "gemini-2.5-flash-preview-04-17",
      contents: prompt,
      config: { responseMimeType: "application/json" }
    });
    
    const parsedGaps = parseJsonSafe<SkillGap[]>(response.text);
    if (parsedGaps && Array.isArray(parsedGaps)) {
        return parsedGaps.filter(gap => typeof gap.skill === 'string' && typeof gap.currentLevel === 'number' && typeof gap.desiredLevel === 'number' && typeof gap.gap === 'number');
    }
    console.warn("Could not parse skill gap analysis or result is not an array:", response.text);
    return []; // Fallback to empty array if parsing fails or structure is wrong
  } catch (error) {
    console.error("Error in generateSkillGapAnalysis:", error);
    throw error;
  }
};


export const simulateSuccessionScenario = async (role: Role, candidate: Employee): Promise<string> => {
  const aiInstance = getAIInstance();
  const prompt = `
    Simulate a succession scenario for ${BRAND_INFO.organizationShortName}.
    Key Role to Fill: ${role.title} (Department: ${role.department}, Required Skills: ${role.requiredSkills.join(', ')})
    Potential Candidate: ${candidate.name} (Current Role: ${candidate.role}, Skills: ${candidate.skills.join(', ')}, Performance: ${candidate.performanceScore}/100, Potential: ${candidate.potentialScore}/100)

    Provide a brief (2-3 paragraphs) predictive analysis covering:
    1. Candidate's readiness for the role (strengths, potential gaps).
    2. Potential impact on the team/department if they take this role.
    3. Key development areas for the candidate to succeed in this new role.
    Be concise and insightful.
  `;
  try {
    const response: GenerateContentResponse = await aiInstance.models.generateContent({
        model: "gemini-2.5-flash-preview-04-17",
        contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Error in simulateSuccessionScenario:", error);
    throw error;
  }
};

export const recommendTrainingPrograms = async (employee: Employee, competencyGaps: string[]): Promise<string> => {
  const aiInstance = getAIInstance();
  const prompt = `
    Employee ${employee.name} (Role: ${employee.role}) has the following leadership competency gaps: ${competencyGaps.join(', ')}.
    Their career goal is: "${employee.careerGoals}".
    Based on this, recommend 2-3 types of training programs or focus areas that would be most beneficial for their leadership development at ${BRAND_INFO.organizationShortName}.
    Provide a brief justification for each recommendation.
    Format as a short paragraph.
  `;
  try {
    const response: GenerateContentResponse = await aiInstance.models.generateContent({
        model: "gemini-2.5-flash-preview-04-17",
        contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Error in recommendTrainingPrograms:", error);
    throw error;
  }
};

export const forecastWorkforceNeeds = async (
  organizationalGrowth: string,
  marketTrends: string,
  currentForecast?: ForecastData[]
): Promise<{ narrative: string, updatedForecast?: ForecastData[] }> => {
  const aiInstance = getAIInstance();
  let prompt = `
    Analyze workforce needs for ${BRAND_INFO.organizationShortName}.
    Organizational Growth Plans: ${organizationalGrowth}.
    Key Market Trends: ${marketTrends}.
    ${currentForecast ? `Current internal forecast data (demand/supply for upcoming periods): ${JSON.stringify(currentForecast)}` : ''}

    Provide:
    1. A concise narrative (2-3 paragraphs) discussing key roles likely to be in demand, potential skill shortages, and strategic HR considerations.
    2. Optional: If you can refine or project the forecast further, provide a JSON array for 'updatedForecast' with objects containing "period", "demand" (number), "supply" (number). Only provide this if you have high confidence in quantitative adjustments based on the inputs. Otherwise, omit 'updatedForecast'.

    Output the entire response as a single JSON object with keys "narrative" (string) and optionally "updatedForecast" (array of ForecastData).
    Example for narrative: "Based on the planned expansion into AI services and observed market shortages in data science, ${BRAND_INFO.organizationShortName} will likely see increased demand for Machine Learning Engineers and AI Ethicists. HR should focus on upskilling internal talent and targeted external recruitment for these roles..."
    Example for updatedForecast: [{"period": "Q1 2026", "demand": 150, "supply": 130}, ...]
  `;

  try {
    const response: GenerateContentResponse = await aiInstance.models.generateContent({
        model: "gemini-2.5-flash-preview-04-17",
        contents: prompt,
        config: { responseMimeType: "application/json" }
    });
    
    const parsedResult = parseJsonSafe<{ narrative: string, updatedForecast?: ForecastData[] }>(response.text);

    if (parsedResult && parsedResult.narrative) {
        return parsedResult;
    }
    // Fallback if JSON parsing fails or doesn't match expected structure
    console.warn("Could not parse workforce forecast or result is not in expected format:", response.text);
    return { narrative: "AI analysis could not be parsed correctly. Raw AI response: " + response.text };

  } catch (error) {
    console.error("Error in forecastWorkforceNeeds:", error);
    throw error;
  }
};

// Chat service is typically handled in the component for streaming,
// but a utility for one-off non-streaming chat queries could be here.
// For this app, chat is managed within ChatbotModal.tsx.
