import { GoogleGenAI, Type } from "@google/genai";
import { AIAnalysisResult } from "../types";

// Initialize Gemini Client
// IMPORTANT: The API key is injected via process.env.API_KEY automatically.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const analyzeUrlWithGemini = async (url: string): Promise<AIAnalysisResult> => {
  try {
    const prompt = `
      Analyze the following URL structure and likely content: "${url}".
      I need you to infer what this page is about.
      
      Provide the following in JSON format:
      1. A likely title for the page.
      2. A 1-sentence summary of what a user would find there.
      3. 3-4 short keyword tags.
      4. A suggested short, catchy alias (slug) for a URL shortener (max 10 chars, alphanumeric).
      5. A safety score (1-100, where 100 is very safe, 0 is malicious) based on the domain reputation heuristics.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            summary: { type: Type.STRING },
            tags: { type: Type.ARRAY, items: { type: Type.STRING } },
            suggestedAlias: { type: Type.STRING },
            safetyScore: { type: Type.INTEGER }
          },
          required: ["title", "summary", "tags", "suggestedAlias", "safetyScore"]
        }
      }
    });

    if (response.text) {
      return JSON.parse(response.text) as AIAnalysisResult;
    }
    
    throw new Error("No response text from Gemini");
  } catch (error) {
    console.error("Gemini analysis failed:", error);
    // Fallback if AI fails
    return {
      title: "Unknown Link",
      summary: "Could not analyze this link.",
      tags: ["link"],
      suggestedAlias: Math.random().toString(36).substring(2, 8),
      safetyScore: 50
    };
  }
};
