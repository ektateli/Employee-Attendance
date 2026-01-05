
import { GoogleGenAI } from "@google/genai";
import { AttendanceRecord, User, AttendanceStatus } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Uses Gemini AI to analyze raw attendance data and provide professional 
 * management insights and recommendations.
 */
export const getSmartInsights = async (records: AttendanceRecord[], users: User[], stats: any) => {
  if (records.length === 0) return "Awaiting data to generate insights...";

  const prompt = `
    Analyze the following attendance data for an organization:
    - Total Employees: ${stats.totalEmployees}
    - Present Today: ${stats.presentToday}
    - Late Entries Today: ${stats.lateToday}
    - Pending Leaves: ${stats.pendingLeaves}
    - Punctuality Rate: ${Math.round((1 - stats.lateToday / (stats.presentToday || 1)) * 100)}%
    
    Data Sample (Last ${records.length} records):
    ${JSON.stringify(records.slice(0, 10))}

    Please provide a concise (max 3 sentences) professional summary identifying:
    1. Any concerning punctuality trends.
    2. Operational risks (e.g., high leave volume).
    3. A specific recommendation for the HR manager.
    
    Tone: Professional, Data-driven, Senior Executive.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    return response.text || "Unable to generate insights at this time.";
  } catch (error) {
    console.error("Gemini Error:", error);
    // Sophisticated fallback logic
    const lateRate = (stats.lateToday / (stats.presentToday || 1)) * 100;
    if (lateRate > 15) return "High latency detected in morning check-ins. Suggesting a review of the 15-minute grace period policy.";
    return "Operations are running smoothly. Attendance consistency is within acceptable enterprise benchmarks.";
  }
};
