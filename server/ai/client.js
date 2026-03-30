import Groq from 'groq-sdk';

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function chatCompletion(messages, model = 'llama-3.3-70b-versatile') {
  return groq.chat.completions.create({ messages, model });
}
