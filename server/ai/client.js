import Groq from 'groq-sdk';

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function chatCompletion(messages, model = 'openai/gpt-oss-120b') {
  return groq.chat.completions.create({ messages, model, response_format: { type: 'json_object' } });
}
