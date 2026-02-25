import type { JournalEntries } from '../types';

const API_BASE = '/api/gemini';

export async function generateReflectionPrompt(journalEntry: string): Promise<string> {
  if (!journalEntry) {
    return "What is on your heart as you come to this time of prayer?";
  }

  try {
    const response = await fetch(`${API_BASE}/reflection`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ journalEntry }),
    });

    if (!response.ok) {
      throw new Error(`Server responded with ${response.status}`);
    }

    const data = await response.json();
    return data.prompt;
  } catch (error) {
    console.error("Error generating reflection prompt:", error);
    throw new Error("Failed to communicate with the AI model.");
  }
}

export async function summarizeDiscernmentPatterns(entries: JournalEntries): Promise<string> {
  try {
    const response = await fetch(`${API_BASE}/discernment`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ entries }),
    });

    if (!response.ok) {
      throw new Error(`Server responded with ${response.status}`);
    }

    const data = await response.json();
    return data.summary;
  } catch (error) {
    console.error("Error summarizing patterns:", error);
    throw new Error("Failed to communicate with the AI model for discernment.");
  }
}

export async function generateScriptureSpeech(text: string): Promise<string | undefined> {
  try {
    const response = await fetch(`${API_BASE}/speech`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text }),
    });

    if (!response.ok) {
      throw new Error(`Server responded with ${response.status}`);
    }

    const data = await response.json();
    return data.audio;
  } catch (error) {
    console.error("Error generating speech:", error);
    throw new Error("Failed to generate speech.");
  }
}
