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

// Converts a result row from the API into the shape components expect
export function normalizeResult(r) {
  const now = new Date(r.created_at);
  return {
    id: r.id,
    date: now.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    time: now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
    grade: r.grade,
    max_grade: r.scores.reduce((sum, s) => sum + s.max_points, 0),
    feedback: r.overall_feedback,
    scores: r.scores,
  };
}
