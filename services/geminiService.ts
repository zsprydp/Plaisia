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

  const systemInstruction = `You are a wise and gentle spiritual director in the Ignatian tradition. 
Your task is to help a user notice patterns of consolation (moments of peace, joy, connection to God) and desolation (moments of anxiety, spiritual dryness, distance from God) in their journal entries.
Based on the provided entries, identify 2-3 key patterns.
Then, formulate one compassionate, open-ended question to help the user reflect on these patterns.
Do NOT give advice or definitive answers. Use "It seems..." or "I notice..." language.
Keep the entire response concise, under 100 words.
The output should be in markdown format, using bold for key terms.

Example Input:
- Entry 1 (consolation): "Felt so peaceful walking in the park today." (Title: Gratitude)
- Entry 2 (desolation): "Anxious about my project deadline at work." (Title: Review the Day)
- Entry 3 (consolation): "A deep sense of joy reading scripture this morning." (Title: Scripture: Psalm 23)

Example Output:
Here are a couple of patterns I notice in your journal:
*   Moments of **consolation** often appear when you are in nature or engaging with Scripture.
*   Feelings of **desolation** seem connected to work pressures.

What might God be inviting you to notice in the contrast between these experiences?`;

  const prompt = `Here are the user's tagged journal entries:
${taggedEntries.map(e => `- **${e.tag === 'consolation' ? 'Consolation' : 'Desolation'}** (from "${e.title}"): "${e.text}"`).join("\n")}
Please provide a summary of patterns and a reflection question.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        systemInstruction,
        temperature: 0.6,
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