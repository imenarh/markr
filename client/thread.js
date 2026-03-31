import { $ } from './utils.js';
import { normalizeThread } from './state/store.js';
import * as ThreadView from './views/ThreadView/ThreadView.js';

const threadId = window.location.pathname.split('/t/')[1];

async function init() {
  const res = await fetch('/api/threads/' + threadId);
  if (!res.ok) { window.location.href = '/'; return; }
  const data = await res.json();
  const thread = normalizeThread(data);

  await ThreadView.init($('view-thread'), thread, () => {
    window.location.href = '/';
  });
}

init();
