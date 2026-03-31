import { $} from './utils.js';
import { state, normalizeThread } from './state/store.js';
import * as ListView from './views/ListView/ListView.js';
import * as ThreadView from './views/ThreadView/ThreadView.js';
import * as Modal from './components/Modal/Modal.js';

Modal.init();

ListView.init($('view-list'), {
  onNewThread: () => Modal.open((thread) => openThread(thread)),
  onOpenThread: (thread) => openThread(thread),
});

async function openThread(thread) {
  await ThreadView.init($('view-thread'), thread, () => navigate('list'));
  navigate('thread');
}

function navigate(view) {
  document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
  $('view-' + view).classList.add('active');
  if (view === 'list') ListView.render();
}

// Fetch threads from API then render
async function init() {
  const res = await fetch('/api/threads');
  const data = await res.json();
  state.threads = data.map(normalizeThread);
  navigate('list');
}

init();
