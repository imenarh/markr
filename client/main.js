import { $ } from './utils.js';
import { state, normalizeThread } from './state/store.js';
import * as ListView from './views/ListView/ListView.js';
import * as Modal from './components/Modal/Modal.js';

Modal.init();

ListView.init($('view-list'), {
  onNewThread: () => Modal.open((thread) => { window.location.href = '/t/' + thread.id; }),
  onOpenThread: (thread) => { window.location.href = '/t/' + thread.id; },
});

async function init() {
  const res = await fetch('/api/threads');
  const data = await res.json();
  state.threads = data.map(normalizeThread);
  ListView.render();
}

init();
