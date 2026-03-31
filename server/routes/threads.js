import { getThreads, getThread, createThread, createRubric, getResults } from '../db/threads.js';

export async function handleGetThreads() {
	try {
	let thread = await getThreads();
  return { status: 200, body: thread };
	}
	catch {
		return { status: 500, body: "CAN'T READ THREADS"}
	}
}


export async function handleGetThread(req) {
  try {
    const thread = await getThread(req.params.id);
    if (!thread) return { status: 404, body: { error: 'Not found' } };
    return { status: 200, body: thread };
  } catch (err) {
    console.error(err);
    return { status: 500, body: { error: 'Failed to get thread' } };
  }
}

export async function handleGetResults(req) {
  try {
    const results = await getResults(req.params.id);
    return { status: 200, body: results };
  } catch (err) {
    console.error(err);
    return { status: 500, body: { error: 'Failed to get results' } };
  }
}

export async function handleCreateThread(req) {
	try {
	const { user_id, name, rubric } = req.body;
	const new_thread = await createThread(name, user_id);
	const new_rubric = await createRubric(new_thread.id, rubric.criteria, rubric.max_grade);
  return { status: 200, body: { new_rubric, new_thread } };
	}
	catch (err) {
		console.error(err);
		return { status: 500, body: "FAILED TO CREATE THREAD"}
	}
}
