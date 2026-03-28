import Groq from "groq-sdk";
import { system_prompt } from "./prompts.js";
const GROQ_API_KEY = process.env.GROQ_API_KEY;

const groq = new Groq({ apiKey: GROQ_API_KEY });


export async function getGroqChatCompletion() {
  return groq.chat.completions.create({
		messages: [
			{
				role: "system",
				content: system_prompt
    },
      {
        role: "user",
				content: "what is your job?",
      },
    ],
    model: "openai/gpt-oss-20b",
  });
}

export async function main() {
  const chatCompletion = await getGroqChatCompletion();
  console.log(chatCompletion.choices[0]?.message?.content || "");
}

main();