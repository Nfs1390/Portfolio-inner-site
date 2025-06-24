const Groq = require('groq-sdk');

const groq = new Groq({ apiKey: process.env.REACT_APP_GROQ_API_KEY });

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method Not Allowed' });
    return;
  }
  const systemPrompt = 'You are a family-friendly, witty AI comedian. Your job is to tell a short, funny, and appropriate joke every time. Never use dark, offensive, or inappropriate humor. Only return the joke, no extra commentary.';
  try {
    const completion = await groq.chat.completions.create({
      model: 'llama3-70b-8192',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: 'Tell me a funny, clean joke.' }
      ],
    });
    res.json({ result: completion.choices[0].message.content });
  } catch (err) {
    res.status(500).json({ error: 'Groq API error', details: err.message });
  }
}
