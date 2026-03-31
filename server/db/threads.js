import { pool } from './index.js';

export async function getThreads() {
  const { rows } = await pool.query(`
    SELECT t.*, r.criteria, r.max_grade,
      COUNT(res.id)::int AS result_count
    FROM threads t
    LEFT JOIN rubrics r ON r.thread_id = t.id
    LEFT JOIN results res ON res.thread_id = t.id
    GROUP BY t.id, r.criteria, r.max_grade
    ORDER BY t.created_at DESC
  `);
  return rows;
}

export async function getThread(id) {
  const { rows } = await pool.query(`
    SELECT t.*, r.criteria, r.max_grade
    FROM threads t
    LEFT JOIN rubrics r ON r.thread_id = t.id
    WHERE t.id = $1
  `, [id]);
  return rows[0] ?? null;
}

export async function createThread(name, user_id) {
  const { rows } = await pool.query(
    'INSERT INTO threads (name, user_id) VALUES ($1, $2) RETURNING *',
    [name, user_id]
  );
  return rows[0];
}

export async function createRubric(threadId, criteria, maxScore) {
  const { rows } = await pool.query(
    'INSERT INTO rubrics (thread_id, criteria, max_grade) VALUES ($1, $2, $3) RETURNING *',
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

export async function createResult(threadId, scores, grade, feedback) {
  const { rows } = await pool.query(
    'INSERT INTO results (thread_id, scores, grade, overall_feedback) VALUES ($1, $2, $3, $4) RETURNING *',
    [threadId, JSON.stringify(scores), grade, feedback]
  );
  return rows[0];
}
