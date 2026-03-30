import { pool } from './index.js';

export async function getThreads() {
  const { rows } = await pool.query('SELECT * FROM threads ORDER BY created_at DESC');
  return rows;
}

export async function getThread(id) {
  const { rows } = await pool.query('SELECT * FROM threads WHERE id = $1', [id]);
  return rows[0] ?? null;
}

export async function createThread(name, criteria) {
  const { rows } = await pool.query(
    'INSERT INTO threads (name, criteria) VALUES ($1, $2) RETURNING *',
    [name, JSON.stringify(criteria)]
  );
  return rows[0];
}
