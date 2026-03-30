import { chatCompletion } from '../ai/client.js';
import { systemPrompt } from '../ai/prompts.js';

export async function handleGrade(req) {
  const { submission, criteria } = req.body;

  if (!submission || !criteria?.length) {
    return { status: 400, body: { error: 'submission and criteria are required' } };
  }

  const userMessage = `Grade the following submission against these criteria:

${criteria.map(c => `- ${c.name} (${c.pts} pts): ${c.desc}`).join('\n')}

Submission:
${submission}`;

  const response = await chatCompletion([
    { role: 'system', content: systemPrompt },
    { role: 'user', content: userMessage },
  ]);

  const raw = response.choices[0]?.message?.content ?? '';
  const result = JSON.parse(raw);
  return { status: 200, body: result };
}
