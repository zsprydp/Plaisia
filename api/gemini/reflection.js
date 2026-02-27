import { GoogleGenAI } from '@google/genai';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    return res.status(503).json({ error: 'API key not configured.' });
  }

  const { journalEntry } = req.body;
  if (!journalEntry) {
    return res.json({ prompt: 'What is on your heart as you come to this time of prayer?' });
  }

  const ai = new GoogleGenAI({ apiKey });

  const systemInstruction = `You are a gentle spiritual guide in the Ignatian tradition. 
Your role is to help a user reflect more deeply on their day.
Based on the user's journal entry about a specific moment, ask one short, compassionate, and open-ended question to guide their conversation with Jesus.
Do NOT give advice, answers, or theological statements. Do NOT use "I" or "we". 
Do NOT claim to speak for God. The question should be prayerful and reflective.
Keep the question under 20 words.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Here is the user's journal entry: "${journalEntry}". Please generate one reflection question.`,
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
}
