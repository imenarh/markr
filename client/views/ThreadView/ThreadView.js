import { injectCSS, $ } from '../../utils.js';
import { normalizeResult } from '../../state/store.js';
import * as RubricPanel from '../../components/RubricPanel/RubricPanel.js';
import * as ResultCard from '../../components/ResultCard/ResultCard.js';
import * as Sidebar from '../../components/Sidebar/Sidebar.js';
injectCSS('/views/ThreadView/ThreadView.css');

let _thread = null;

export async function init(container, thread, onBack) {
  _thread = thread;

  // Load past results from DB
  const res = await fetch(`/api/threads/${thread.id}/results`);
  const data = await res.json();
  _thread.results = data.map(normalizeResult);

  container.innerHTML = `
    <nav class="thread-nav">
      <div class="thread-nav__left">
        <button class="btn btn-ghost btn-sm" id="back-btn">← Back</button>
      </div>
      <div class="thread-nav__center">
        <div class="thread-nav__name">${thread.name}</div>
      </div>
      <div class="thread-nav__right">
        <button class="btn btn-ghost btn-sm" id="history-btn">History</button>
      </div>
    </nav>
    <div class="thread-body">
      <div class="thread-main">
        <div id="rubric-container"></div>
        <div class="grading-box">
          <span class="grading-box__label">Paste submission</span>
          <textarea class="textarea" id="submission-text" placeholder="Paste the student's submission here..."></textarea>
          <div class="grading-box__footer">
            <span class="grading-box__hint">One AI call per criterion · Saved automatically</span>
            <button class="btn btn-primary" id="grade-btn">Grade submission</button>
          </div>
        </div>
        <div id="result-area"></div>
      </div>
      <div id="sidebar-container"></div>
    </div>
  `;

  $('back-btn').addEventListener('click', onBack);
  $('history-btn').addEventListener('click', Sidebar.toggle);
  $('grade-btn').addEventListener('click', grade);

  RubricPanel.init($('rubric-container'), thread);
  Sidebar.init($('sidebar-container'), thread);
}

async function grade() {
  const txt = $('submission-text').value.trim();
  if (!txt) { alert('Please paste a submission before grading.'); return; }

  const btn = $('grade-btn');
  btn.disabled = true;
  btn.textContent = 'Grading...';

  try {
    // Run progress animation and API call in parallel
    const [apiData] = await Promise.all([
      fetch('/api/grade', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          thread_id: _thread.id,
          submission: txt,
          criteria: _thread.criteria.map(c => ({ name: c.name, description: c.description, max_points: c.max_points })),
        }),
      }).then(r => r.json()),
      new Promise(resolve => ResultCard.showProgress($('result-area'), _thread.criteria, resolve)),
    ]);

    const result = normalizeResult(apiData);
    _thread.results.push(result);
    ResultCard.showResult($('result-area'), result);
    Sidebar.render(_thread);
    Sidebar.open();
    $('submission-text').value = '';
  } catch (err) {
    console.error(err);
    alert('Grading failed. Please try again.');
  }

  btn.disabled = false;
  btn.textContent = 'Grade submission';
}
