import { GoogleGenAI, Modality } from "@google/genai";
import type { JournalEntries, JournalEntry } from './types';

// Ensure the API key is available in the environment variables
const apiKey = process.env.API_KEY;
if (!apiKey) {
  throw new Error("API_KEY environment variable is not set.");
}

const ai = new GoogleGenAI({ apiKey });

export async function generateReflectionPrompt(journalEntry: string): Promise<string> {
  if (!journalEntry) {
    return "What is on your heart as you come to this time of prayer?";
  }

  const systemInstruction = `You are a gentle spiritual guide in the Ignatian tradition. 
Your role is to help a user reflect more deeply on their day.
Based on the user's journal entry about a specific moment, ask one short, compassionate, and open-ended question to guide their conversation with Jesus.
Do NOT give advice, answers, or theological statements. Do NOT use "I" or "we". 
Do NOT claim to speak for God. The question should be prayerful and reflective.
Keep the question under 20 words.
Example: If user writes "I was so happy when my friend called", a good question is "What did that moment of connection feel like in your heart?".
Example: If user writes "My boss was so unfair today", a good question is "Where was God in that moment of frustration?".`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Here is the user's journal entry: "${journalEntry}". Please generate one reflection question.`,
      config: {
        systemInstruction,
        temperature: 0.7,
        maxOutputTokens: 50,
      }
    });

    const text = response.text.trim().replace(/"/g, ''); // Clean up response
    return text;
  } catch (error) {
    console.error("Error generating reflection prompt:", error);
    throw new Error("Failed to communicate with the AI model.");
  }
}

export async function summarizeDiscernmentPatterns(entries: JournalEntries): Promise<string> {
  // FIX: Explicitly cast Object.values to JournalEntry[] to resolve type inference issue.
  const taggedEntries = (Object.values(entries) as JournalEntry[]).filter(entry => entry.tag && entry.text.trim().length > 10);

  if (taggedEntries.length < 3) {
    return "Keep journaling to see patterns emerge. Try to tag more entries with 'consolation' or 'desolation' to help identify where you feel God's presence or absence.";
  }

  const systemInstruction = `You are a wise and perceptive spiritual director trained in the Spiritual Exercises of St. Ignatius.
Your task is to analyze a user's journal entries to help them discern the movements of the spirits (Consolation and Desolation).

Analyze the provided entries for:
1. **Context & Triggers:** Are there specific people, environments (work vs. home), or times of day associated with specific spiritual states?
2. **Frequency & Intensity:** distinguish between fleeting feelings and deep, recurring spiritual movements.
3. **The "Why":** Look for the underlying desires or fears expressed in the text.

Output Requirements:
- Identify **2-3 distinct, nuanced patterns**. Avoid generic statements like "You are happy sometimes." Be specific (e.g., "Desolation tends to arise when you feel a lack of control at work.").
- Formulate **one deep, searching question** that invites the user to take a specific action or shift their perspective based on these patterns.
- Use Markdown. Use **bold** for key concepts.
- Keep the tone gentle, objective, but insightful. Total length under 150 words.

Example Output Format:
Here are the patterns emerging in your prayer:
*   **Consolation in Vulnerability:** You consistently find peace when you are honest about your weaknesses, rather than when you try to be strong.
*   **The Desolation of Busyness:** Your entries tagged 'desolation' almost always occur on days where you mention "rushing" or "deadlines," suggesting a spiritual disconnect caused by pace, not task.

**Reflection:** If you were to pause for just one minute during your busiest moments tomorrow, what truth might God be trying to speak to you?`;

  const prompt = `Here are the user's tagged journal entries for analysis:
${taggedEntries.map(e => {
    const dateObj = new Date(e.date);
    const dateStr = dateObj.toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' });
    return `- [${dateStr}] [${e.tag?.toUpperCase()}] Title: "${e.title}"\n  Journal: "${e.text}"`;
}).join("\n\n")}

Please provide a discernment summary identifying specific patterns and a reflection question.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        systemInstruction,
        temperature: 0.5, // Slightly lower temperature for more analytical/grounded results
      }
    });
    return response.text;
  } catch (error) {
    console.error("Error summarizing patterns:", error);
    throw new Error("Failed to communicate with the AI model for discernment.");
  }
}

export async function generateScriptureSpeech(text: string): Promise<string | undefined> {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text: text }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName: 'Kore' },
            },
        },
      },
    });
    
    // The API returns raw PCM data in base64
    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    return base64Audio;
  } catch (error) {
    console.error("Error generating speech:", error);
    throw new Error("Failed to generate speech.");
  }
}