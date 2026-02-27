import { GoogleGenAI } from '@google/genai';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    return res.status(503).json({ error: 'API key not configured.' });
  }

  const { entries } = req.body;

  const taggedEntries = Object.values(entries || {}).filter(
    (entry) => entry.tag && entry.text.trim().length > 10
  );

  if (taggedEntries.length < 3) {
    return res.json({
      summary:
        "Keep journaling to see patterns emerge. Try to tag more entries with 'consolation' or 'desolation' to help identify where you feel God's presence or absence.",
    });
  }

  const ai = new GoogleGenAI({ apiKey });

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
    return `- [${dateStr}] [${e.tag?.toUpperCase()}] Title: "${e.title}"\n  Journal: "${e.text}"`;
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
}
