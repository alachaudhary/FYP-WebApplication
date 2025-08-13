import axios from 'axios';

const OPENROUTER_API_KEY = import.meta.env.VITE_OPENROUTER_KEY;

const ai = axios.create({
  baseURL: 'https://openrouter.ai/api/v1',
  headers: {
    'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
    'Content-Type': 'application/json',
  },
});

export const chatWithAI = async (messages: { role: string; content: string }[]) => {
  try {
    const response = await ai.post('/chat/completions', {
  model: 'meta-llama/llama-3.3-70b-instruct', // try without ":free"
  messages,
  stream: false,
});

    return response.data;
  } catch (error: any) {
    console.error("❌ OpenRouter API Error:", error.response?.data || error.message);
    throw new Error("Something went wrong. Please try again later.");
  }
};
