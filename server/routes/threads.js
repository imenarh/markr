// TODO: wire up to Neon DB via server/db/threads.js

export async function handleGetThreads() {
  return { status: 200, body: [] };
}

export async function handleCreateThread(req) {
  const { name, criteria } = req.body;
  if (!name || !criteria?.length) {
    return { status: 400, body: { error: 'name and criteria are required' } };
  }
  // TODO: insert into DB
  return { status: 200, body: { id: Date.now(), name, criteria, results: [] } };
}
