import { Router } from 'express';
import { GoogleGenAI, Modality } from '@google/genai';

const MAX_TEXT = 5000;
const MAX_ENTRIES = 100;

function validateString(val, name) {
  if (typeof val !== 'string') return `${name} must be a string.`;
  if (val.length > MAX_TEXT) return `${name} exceeds maximum length of ${MAX_TEXT} characters.`;
  return null;
}

export function createGeminiRoutes(apiKey) {
  const router = Router();

  if (!apiKey) {
    router.use((_req, res) => {
      res.status(503).json({ error: 'API key not configured on the server.' });
    });
    return router;
  }

  const ai = new GoogleGenAI({ apiKey });

  router.post('/reflection', async (req, res) => {
    const { journalEntry } = req.body;

    if (!journalEntry) {
      return res.json({ prompt: 'What is on your heart as you come to this time of prayer?' });
    }

    const err = validateString(journalEntry, 'journalEntry');
    if (err) return res.status(400).json({ error: err });

    const cleanEntry = journalEntry.slice(0, MAX_TEXT).trim();

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
        model: 'gemini-2.5-flash',
        contents: `Here is the user's journal entry: "${cleanEntry}". Please generate one reflection question.`,
        config: {
          systemInstruction,
          temperature: 0.7,
          maxOutputTokens: 1024,
        },
      });

      const text = (response.text ?? '').trim().replace(/"/g, '');
      res.json({ prompt: text });
    } catch (error) {
      console.error('Error generating reflection prompt:', error);
      res.status(500).json({ error: 'Failed to generate reflection prompt.' });
    }
  });

  router.post('/discernment', async (req, res) => {
    const { entries } = req.body;

    if (!entries || typeof entries !== 'object') {
      return res.status(400).json({ error: 'entries must be an object.' });
    }
    if (Object.keys(entries).length > MAX_ENTRIES) {
      return res.status(400).json({ error: `Too many entries (max ${MAX_ENTRIES}).` });
    }

    const taggedEntries = Object.values(entries).filter(
      (entry) => entry.tag && entry.text?.trim().length > 10
    );

    if (taggedEntries.length < 3) {
      return res.json({
        summary:
          "Keep journaling to see patterns emerge. Try to tag more entries with 'consolation' or 'desolation' to help identify where you feel God's presence or absence.",
      });
    }

    const systemInstruction = `You are a wise and perceptive spiritual director trained in the Spiritual Exercises of St. Ignatius.
Your task is to analyze a user's journal entries to help them discern the movements of the spirits (Consolation and Desolation).

Analyze the provided entries for:
1. **Context & Triggers:** Are there specific people, environments (work vs. home), or times of day associated with specific spiritual states?
2. **Frequency & Intensity:** distinguish between fleeting feelings and deep, recurring spiritual movements.
3. **The "Why":** Look for the underlying desires or fears expressed in the text.

Output Requirements:
- Identify **2-3 distinct, nuanced patterns**. Avoid generic statements like "You are happy sometimes." Be specific.
- Formulate **one deep, searching question** that invites the user to take a specific action or shift their perspective based on these patterns.
- Use Markdown. Use **bold** for key concepts.
- Keep the tone gentle, objective, but insightful. Total length under 150 words.`;

    const prompt = `Here are the user's tagged journal entries for analysis:
${taggedEntries
  .map((e) => {
    const dateObj = new Date(e.date);
    const dateStr = dateObj.toLocaleDateString(undefined, {
      weekday: 'long',
      month: 'short',
      day: 'numeric',
    });
    const safeText = (e.text || '').slice(0, MAX_TEXT);
    const safeTitle = (e.title || '').slice(0, 200);
    return `- [${dateStr}] [${e.tag?.toUpperCase()}] Title: "${safeTitle}"\n  Journal: "${safeText}"`;
  })
  .join('\n\n')}

Please provide a discernment summary identifying specific patterns and a reflection question.`;

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: { systemInstruction, temperature: 0.5 },
      });
      res.json({ summary: response.text ?? '' });
    } catch (error) {
      console.error('Error summarizing patterns:', error);
      res.status(500).json({ error: 'Failed to generate discernment summary.' });
    }
  });

  router.post('/speech', async (req, res) => {
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({ error: 'Text is required.' });
    }
    if (typeof text !== 'string' || text.length > MAX_TEXT) {
      return res.status(400).json({ error: 'Text exceeds maximum length.' });
    }

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-preview-tts',
        contents: [{ parts: [{ text: text.slice(0, MAX_TEXT) }] }],
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName: 'Kore' },
            },
          },
        },
      });

      const base64Audio =
        response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
      res.json({ audio: base64Audio });
    } catch (error) {
      console.error('Error generating speech:', error);
      res.status(500).json({ error: 'Failed to generate speech.' });
    }
  });

  return router;
}
