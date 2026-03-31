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
    criteria: (t.criteria ?? []).map((c, i) => ({ id: i + 1, name: c.name, desc: c.description, pts: c.max_points })),
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
    total: r.score,
    max: r.grades.reduce((sum, g) => sum + g.max_points, 0),
    scores: r.grades.map(g => ({ n: g.name, s: g.score, m: g.max_points, fb: g.feedback })),
  };
}
