const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();
const apiKey = process.env.GROQ_API_KEY;
if (!apiKey) { console.error('Missing GROQ_API_KEY in .env'); process.exit(1); }

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

app.post('/api/chat', async (req, res) => {
  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          { role: 'system', content: 'Answer clearly and directly.' },
          { role: 'user', content: req.body?.message || '' }
        ]
      })
    });
    const data = await response.json();
    const reply = data?.choices?.[0]?.message?.content || 'No reply.';
    res.json({ reply });
  } catch (error) {
    res.status(500).json({ reply: error.message });
  }
});

app.listen(3000, () => console.log('Open http://localhost:3000/quiz-500-generated.html'));
