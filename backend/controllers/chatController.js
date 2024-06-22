const axios = require('axios');
require('dotenv').config({ path: './.env' });
const { Groq } = require('groq-sdk');

const requestToGroqAI = async (content) => {
  const GROQ_API = process.env.GROQ_API_KEY;
  const groq = new Groq({
    apiKey: GROQ_API,
    dangerouslyAllowBrowser: true,
  });

  const reply = await groq.chat.completions.create({
    messages: [
      {
        role: 'user',
        content,
      },
    ],
    model: 'gemma-7b-it',
    temperature: 0.2,
    top_p: 0.2,
  });

  const formattedResponse = formatBulletPoints(reply.choices[0].message.content);
  return formattedResponse;
};

const formatBulletPoints = (text) => {
  const lines = text.split('\n');
  return lines
    .map((line, index) => {
      if (line.match(/^1\.\s+\*\*/) || line.match(/^2\.\s+\*\*/) || line.match(/^3\.\s+\*\*/)) {
        return `<div key=${index}><strong>${line}</strong></div>`;
      } else if (line.startsWith('* ')) {
        return `<li key=${index}>${line.substring(2)}</li>`;
      } else if (line.startsWith('**')) {
        return `<div key=${index}><strong>${line.substring(2, line.length - 2)}</strong></div>`;
      } else {
        return `<div key=${index}>${line}</div>`;
      }
    })
    .join('');
};

const chat = async (req, res) => {
  try {
    const { message } = req.body;
    const response = await requestToGroqAI(message);
    res.json({ reply: response });
  } catch (error) {
    console.error('Error during chat interaction:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = {
  chat,
};
