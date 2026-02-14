/**
 * Gemini AI Service for Advanced Reasoning
 * Optional service for AI-powered explanations
 */

import { config } from '../config';

const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent";

/**
 * Get API key from config or parameter
 */
function getGeminiApiKey(apiKey) {
  return apiKey || config.API_KEYS.GEMINI_API_KEY || localStorage.getItem('geminiApiKey') || '';
}

/**
 * Get Gemini explanation for land use recommendation
 */
export async function getGeminiExplanation(poiCounts, recommendedUse, apiKey = null) {
  const key = getGeminiApiKey(apiKey);
  
  if (!key) {
    console.warn("Gemini API key not provided");
    return null;
  }

  try {
    const poiSummary = Object.entries(poiCounts)
      .filter(([_, count]) => count > 0)
      .map(([category, count]) => `${category}: ${count}`)
      .join(", ");

    const prompt = `Based on nearby Points of Interest analysis:
${poiSummary}

The recommended land use is: ${recommendedUse}

Provide a concise (2-3 sentences) explanation of why this is the best recommendation for this location. Focus on practical development benefits and infrastructure synergies.`;

    const response = await fetch(`${GEMINI_API_URL}?key=${key}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: prompt,
              },
            ],
          },
        ],
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error("Gemini API error:", error);
      return null;
    }

    const data = await response.json();

    if (
      data.candidates &&
      data.candidates[0] &&
      data.candidates[0].content &&
      data.candidates[0].content.parts &&
      data.candidates[0].content.parts[0]
    ) {
      return data.candidates[0].content.parts[0].text;
    }

    return null;
  } catch (error) {
    console.error("Error getting Gemini explanation:", error);
    return null;
  }
}

/**
 * Get Gemini risk mitigation strategies
 */
export async function getGeminiRiskMitigation(poiCounts, riskLevel, apiKey = null) {
  const key = getGeminiApiKey(apiKey);
  
  if (!key) {
    return null;
  }

  try {
    const poiSummary = Object.entries(poiCounts)
      .filter(([_, count]) => count > 0)
      .map(([category, count]) => `${category}: ${count}`)
      .join(", ");

    const prompt = `A land development project identified risk level: ${riskLevel}

Surrounding infrastructure:
${poiSummary}

Provide 2-3 specific, actionable mitigation strategies appropriate for this location and risk profile.`;

    const response = await fetch(`${GEMINI_API_URL}?key=${key}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: prompt,
              },
            ],
          },
        ],
      }),
    });

    if (!response.ok) {
      console.error("Gemini API error");
      return null;
    }

    const data = await response.json();

    if (
      data.candidates &&
      data.candidates[0] &&
      data.candidates[0].content &&
      data.candidates[0].content.parts &&
      data.candidates[0].content.parts[0]
    ) {
      return data.candidates[0].content.parts[0].text;
    }

    return null;
  } catch (error) {
    console.error("Error getting Gemini risk mitigation:", error);
    return null;
  }
}

/**
 * Get Gemini development timeline
 */
export async function getGeminiTimeline(recommendedUse, poiCounts, apiKey = null) {
  const key = getGeminiApiKey(apiKey);
  
  if (!key) {
    return null;
  }

  try {
    const prompt = `For a land development project:
Recommended Use: ${recommendedUse}
Nearby: ${Object.entries(poiCounts)
  .filter(([_, count]) => count > 0)
  .map(([category, count]) => `${count} ${category}`)
  .join(", ")}

Provide a realistic phased development timeline (3-4 phases) for this project.`;

    const response = await fetch(`${GEMINI_API_URL}?key=${key}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: prompt,
              },
            ],
          },
        ],
      }),
    });

    if (!response.ok) {
      return null;
    }

    const data = await response.json();

    if (
      data.candidates &&
      data.candidates[0] &&
      data.candidates[0].content &&
      data.candidates[0].content.parts &&
      data.candidates[0].content.parts[0]
    ) {
      return data.candidates[0].content.parts[0].text;
    }

    return null;
  } catch (error) {
    console.error("Error getting Gemini timeline:", error);
    return null;
  }
}
