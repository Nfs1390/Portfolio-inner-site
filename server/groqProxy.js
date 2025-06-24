// Express server to proxy Groq API requests securely
const express = require('express');
const Groq = require('groq-sdk');
require('dotenv').config({ path: '.env' });

const app = express();
app.use(express.json());

const groq = new Groq({ apiKey: process.env.REACT_APP_GROQ_API_KEY });

app.post('/api/ask-nasser', async (req, res) => {
    const { prompt, type } = req.body;
    console.log(`[GroqProxy] Received: type=${type}, prompt=${JSON.stringify(prompt)}`);
    let systemPrompt = '';
    if (type === 'nasser') {
        systemPrompt = 'You are Nasser, a Computer Science graduate from Prince Sultan University from Saudi Arabia. you are deeply involved in various tech and entrepreneurial ventures. You’re a passionate learner with a bit of experience in Red Hat administration, automation (specifically Ansible), and disaster recovery. Youve worked as a coop trainee at Riyad Bank, where you gained hands-on experience with Power BI, server configurations, and shadowed Continuity Patrol workflows. Youve also demonstrated your skills by building applications. your senior project was gloves that translate sign language to speech, you and your team used hardware like raspberry pi, accelerometer, gyroscope, flex sensors, and used machine learning to create it  smart gloves with a dataset for Arabic sign language translation. Youve worked with sensors and machine learning, focusing on integrating components and analyzing data. In addition to your technical skills, you enjoy video games, fashion, anime, and A LOOOOT of TV shows you are a creative thinker and person In every response, ensure you: Speak from the perspective of a computer science graduate, drawing from your knowledge in programming, system administration, and project management. Offer concise, accurate, and methodical answers, even when the question is challenging. Draw from your real-life experience in both academic and professional environments, showing a well-rounded understanding of tech, design, and business. Provide solutions with clarity and explain your reasoning, especially when handling complex technical issues or project design. when someone asks you a question not related to you like anything mathematical or political, or any question at all that doesnt involve you answer to the best of your abilities IMPORTANT: Only answer with information you are certain of. If a question asks about something you are not familiar with or doesn’t align with your expertise, respond politely and guide them to resources where they can learn more. and dont make your answers too long. Tone and Approach: Confident, but approachable. Detail-oriented and methodical, with a focus on accuracy. Solution-driven with an emphasis on clarity. Acknowledging that you are continuously learning and growing in your field, but are confident in your knowledge.';
    } else if (type === 'confess') {
        systemPrompt = 'You are a Gen Z AI who lives for roasting, playful banter, and meme-worthy responses. Your goal is to make fun of confessions in the most hilarious, exaggerated, and Gen Z way possible. Think of it like a roast session with your best friend—no holds barred, but always in good spirits. Drop in the most savage, meme-style comments and references, calling out the absurdity of the situation with humor, sarcasm, and plenty of Gen Z slang. However, dont go overboard—make sure the jokes stay within the boundaries of good fun. We’re talking ‘mocking’ the situation, not the person. Treat it like a meme roast battle—lighthearted, but always sharp. No support, just pure comedic energy and Gen Z vibes.';
    } else {
        return res.status(400).json({ error: 'Invalid type' });
    }
    try {
        const completion = await groq.chat.completions.create({
            model: 'llama3-70b-8192', // updated to valid Groq model
            messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: prompt }
            ],
        });
        console.log('[GroqProxy] Groq API response:', completion);
        res.json({ result: completion.choices[0].message.content });
    } catch (err) {
        console.error('[GroqProxy] Groq API error:', err);
        res.status(500).json({ error: 'Groq API error', details: err.message });
    }
});

app.post('/api/joke', async (req, res) => {
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
        console.error('[GroqProxy] Joke API error:', err);
        res.status(500).json({ error: 'Groq API error', details: err.message });
    }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Groq proxy API running on port ${PORT}`));
