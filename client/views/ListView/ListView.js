import { injectCSS, $ } from '../../utils.js';
import * as Nav from '../../components/Nav/Nav.js';
import { ThreadCard, EmptyState } from '../../components/ThreadCard/ThreadCard.js';
import { state } from '../../state/store.js';
injectCSS('/views/ListView/ListView.css');

let _container = null;
let _handlers = {};

export function init(container, handlers) {
  _container = container;
  _handlers = handlers;

  container.innerHTML = `
    ${Nav.render()}
    <div class="list-body">
      <div class="list-top">
        <div>
          <div class="list-heading">Grading threads</div>
          <div class="list-sub">Select a thread to grade submissions</div>
        </div>
      </div>
      <div class="thread-grid" id="thread-grid"></div>
    </div>
  `;

  Nav.mount(container, { onNewThread: handlers.onNewThread });
  render();
}

export function render() {
  const grid = $('thread-grid');
  if (!grid) return;

  if (!state.threads.length) {
    grid.innerHTML = EmptyState();
    return;
  }

  grid.innerHTML = state.threads.map(t => ThreadCard(t)).join('');
  grid.querySelectorAll('.thread-card').forEach(card => {
    card.addEventListener('click', () => {
      const thread = state.threads.find(t => t.id === Number(card.dataset.id));
      if (thread) _handlers.onOpenThread(thread);
    });
  });
}
