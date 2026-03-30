import { chatCompletion } from '../ai/client.js';
import { systemPrompt } from '../ai/prompts.js';
import { createResult } from '../db/threads.js';

export async function handleGrade(req) {
  try {
    const { thread_id, submission, criteria } = req.body;

    if (!submission || !criteria?.length) {
      return { status: 400, body: { error: 'submission and criteria are required' } };
    }

    // Build the message sent to Groq
    const userMessage = `Grade the following submission against these criteria:

${criteria.map(c => `- ${c.name} (${c.max_points} pts): ${c.description}`).join('\n')}

Submission:
${submission}`;

    // Call Groq
    const response = await chatCompletion([
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userMessage },
    ]);

    // Parse the JSON response from Groq
    const raw = response.choices[0]?.message?.content ?? '';
    const gradeResult = JSON.parse(raw);

    // Calculate total score from all criteria scores
    const totalScore = gradeResult.criteria.reduce((sum, c) => sum + c.score, 0);

    // Save to DB
    const saved = await createResult(
      thread_id,
      gradeResult.criteria,
      totalScore,
      gradeResult.overall
    );

    return { status: 200, body: saved };
  } catch (err) {
    console.error(err);
    return { status: 500, body: { error: 'Grading failed' } };
  }
}
