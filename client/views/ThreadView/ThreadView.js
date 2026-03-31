import { injectCSS, $ } from '../../utils.js';
import { normalizeResult } from '../../state/store.js';
import * as RubricPanel from '../../components/RubricPanel/RubricPanel.js';
import * as ResultCard from '../../components/ResultCard/ResultCard.js';
import * as Sidebar from '../../components/Sidebar/Sidebar.js';
injectCSS('/views/ThreadView/ThreadView.css');

let _thread = null;

export async function init(container, thread, onBack) {
  _thread = thread;

  await refreshResults();

  container.innerHTML = `
    <nav class="thread-nav">
      <div class="thread-nav__left">
        <button class="btn btn-ghost btn-sm" id="back-btn">← Back</button>
      </div>
      <div class="thread-nav__center">
        <div class="thread-nav__name">${thread.name}</div>
      </div>
      <div class="thread-nav__right"></div>
    </nav>
    <div class="thread-body">
      <div class="thread-left">
        <textarea class="submission-textarea" id="submission-text" placeholder="Paste the submission here..."></textarea>
        <div class="thread-left__footer">
          <button class="btn btn-primary" id="grade-btn">Grade submission</button>
        </div>
      </div>
      <div class="thread-right">
        <div class="right-tabs">
          <button class="right-tab right-tab--active" id="tab-rubric">Rubric</button>
          <button class="right-tab" id="tab-history">History</button>
        </div>
        <div class="right-pane" id="pane-rubric">
          <div id="result-area"></div>
          <div id="rubric-container"></div>
        </div>
        <div class="right-pane" id="pane-history" style="display:none">
          <div id="sidebar-container"></div>
        </div>
      </div>
    </div>
  `;

  $('back-btn').addEventListener('click', onBack);
  $('grade-btn').addEventListener('click', grade);
  $('tab-rubric').addEventListener('click', () => showTab('rubric'));
  $('tab-history').addEventListener('click', () => showTab('history'));

  RubricPanel.init($('rubric-container'), thread);
  Sidebar.init($('sidebar-container'), thread);
}

function showTab(name) {
  $('pane-rubric').style.display = name === 'rubric' ? '' : 'none';
  $('pane-history').style.display = name === 'history' ? '' : 'none';
  $('tab-rubric').classList.toggle('right-tab--active', name === 'rubric');
  $('tab-history').classList.toggle('right-tab--active', name === 'history');
}

async function refreshResults() {
  const res = await fetch(`/api/threads/${_thread.id}/results`);
  const data = await res.json();
  if (!res.ok) throw new Error(data?.error || 'Failed to load results');
  _thread.results = data.map(normalizeResult);
}

async function grade() {
  const txt = $('submission-text').value.trim();
  if (!txt) { alert('Please paste a submission before grading.'); return; }

  const btn = $('grade-btn');
  btn.disabled = true;
  btn.textContent = 'Grading...';

  showTab('rubric');

  try {
    const res = await fetch('/api/grade', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        thread_id: _thread.id,
        submission: txt,
        criteria: _thread.criteria.map(c => ({ name: c.name, description: c.description, max_points: c.max_points })),
      }),
    });
    const apiData = await res.json();
    if (!res.ok) throw new Error(apiData?.error || 'Grading failed');

    const result = normalizeResult(apiData);
    await refreshResults();
    ResultCard.showResult($('result-area'), result);
    Sidebar.render(_thread);
    $('submission-text').value = '';
  } catch (err) {
    console.error(err);
    alert(err.message || 'Grading failed. Please try again.');
  }

  btn.disabled = false;
  btn.textContent = 'Grade submission';
}
