import { $ } from './utils.js';
import * as ListView from './views/ListView/ListView.js';
import * as ThreadView from './views/ThreadView/ThreadView.js';
import * as Modal from './components/Modal/Modal.js';

Modal.init();

ListView.init($('view-list'), {
  onNewThread: () => Modal.open((thread) => openThread(thread)),
  onOpenThread: (thread) => openThread(thread),
});

function openThread(thread) {
  ThreadView.init($('view-thread'), thread, () => navigate('list'));
  navigate('thread');
}

function navigate(view) {
  document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
  $('view-' + view).classList.add('active');
  if (view === 'list') ListView.render();
}

navigate('list');
