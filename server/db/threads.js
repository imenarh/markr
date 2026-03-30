import { pool } from './index.js';

export async function getThreads() {
  const { rows } = await pool.query(`
    SELECT t.*, r.criteria, r.max_score
    FROM threads t
    LEFT JOIN rubric r ON r.thread_id = t.id
    ORDER BY t.created_at DESC
  `);
  return rows;
}

export async function getThread(id) {
  const { rows } = await pool.query(`
    SELECT t.*, r.criteria, r.max_score
    FROM threads t
    LEFT JOIN rubric r ON r.thread_id = t.id
    WHERE t.id = $1
  `, [id]);
  return rows[0] ?? null;
}

export async function createThread(name) {
  const { rows } = await pool.query(
    'INSERT INTO threads (name) VALUES ($1) RETURNING *',
    [name]
  );
  return rows[0];
}

export async function createRubric(threadId, criteria, maxScore) {
  const { rows } = await pool.query(
    'INSERT INTO rubric (thread_id, criteria, max_score) VALUES ($1, $2, $3) RETURNING *',
    [threadId, JSON.stringify(criteria), maxScore]
  );
  return rows[0];
}

export async function getResults(threadId) {
  const { rows } = await pool.query(
    'SELECT * FROM results WHERE thread_id = $1 ORDER BY created_at DESC',
    [threadId]
  );
  return rows;
}

export async function createResult(threadId, grades, score, overallFeedback) {
  const { rows } = await pool.query(
    'INSERT INTO results (thread_id, grades, score, overall_feedback) VALUES ($1, $2, $3, $4) RETURNING *',
    [threadId, JSON.stringify(grades), score, overallFeedback]
  );
  return rows[0];
}
