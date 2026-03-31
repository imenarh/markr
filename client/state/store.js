const _listeners = {};

export const state = {
  threads: [],
  thread: null,
  parsed: [],
};

export function on(event, fn) {
  (_listeners[event] ??= []).push(fn);
}

export function emit(event, data) {
  (_listeners[event] ?? []).forEach(fn => fn(data));
}

// Converts a thread row from the API into the shape components expect
export function normalizeThread(t) {
  return {
    id: t.id,
    name: t.name,
    date: new Date(t.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    criteria: (t.criteria ?? []).map((c, i) => ({ id: i + 1, name: c.name, description: c.description, max_points: c.max_points })),
    results: Array(t.result_count ?? 0).fill(null),
  };
}

function parseScores(rawScores) {
  if (Array.isArray(rawScores)) return rawScores;
  if (typeof rawScores !== 'string') return [];

  try {
    const parsed = JSON.parse(rawScores);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function normalizeScore(score) {
  return {
    name: score?.name ?? '',
    points: Number(score?.points ?? score?.score ?? score?.grade ?? 0),
    max_points: Number(score?.max_points ?? score?.maxScore ?? score?.max ?? 0),
    feedback: score?.feedback ?? '',
  };
}

// Converts a result row from the API into the shape components expect
export function normalizeResult(r) {
  const now = new Date(r.created_at);
  const scores = parseScores(r.scores).map(normalizeScore);
  const grade = Number(r.grade ?? scores.reduce((sum, s) => sum + s.points, 0));

  return {
    id: r.id,
    date: now.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    time: now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
    grade,
    max_grade: scores.reduce((sum, s) => sum + s.max_points, 0),
    feedback: r.overall_feedback,
    scores,
  };
}
