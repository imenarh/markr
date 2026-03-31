import { chatCompletion } from '../ai/client.js';
import { parsePrompt } from '../ai/prompts.js';

export async function handleParseRubric(req) {
  try {
    const { rubric } = req.body;
    if (!rubric) return { status: 400, body: { error: 'rubric text is required' } };

    const response = await chatCompletion([
      { role: 'system', content: parsePrompt },
      { role: 'user', content: rubric },
    ], 'llama-3.1-8b-instant');

    const raw = response.choices[0]?.message?.content ?? '';
    const { criteria } = JSON.parse(raw);
    const normalized = criteria.map(c => ({ ...c, max_points: Number(c.max_points) || 0 }));
    return { status: 200, body: { criteria: normalized } };
  } catch (err) {
    console.error(err);
    return { status: 500, body: { error: 'Failed to parse rubric' } };
  }
}
