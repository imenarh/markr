const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";

export async function chatCompletion(
	messages,
	model = "llama-3.3-70b-versatile",
) {
	const res = await fetch(GROQ_API_URL, {
		method: "POST",
		headers: {
			Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			messages,
			model,
			response_format: { type: "json_object" },
			temperature: 0,
		}),
	});

	if (!res.ok) {
		const err = await res.text();
		throw new Error(`Groq API error ${res.status}: ${err}`);
	}

	return res.json();
}
