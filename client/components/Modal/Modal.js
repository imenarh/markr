import { injectCSS, $ } from '../../utils.js';
import { state, normalizeThread } from '../../state/store.js';
injectCSS('/components/Modal/Modal.css');

let _onCreated = null;

export function init() {
  document.body.insertAdjacentHTML('beforeend', `
    <div class="modal-overlay" id="modal-overlay">
      <div class="modal">
        <div class="modal-header">
          <span class="modal-title">New grading thread</span>
          <button class="modal-close" id="modal-close-btn">✕</button>
        </div>
        <div class="modal-body">
          <div>
            <label class="form-label">Thread name</label>
            <input class="input" id="modal-name" type="text" placeholder="e.g. COMP101 — Week 3 Essays"/>
          </div>
          <div>
            <label class="form-label">Rubric text</label>
            <div class="parse-box">
              <div class="parse-box__note">Paste your rubric below. Markr will extract the criteria. Review before locking.</div>
              <textarea class="textarea" id="rubric-paste" rows="5" placeholder="e.g. Argument Quality (20pts): The essay presents a clear, well-supported argument...&#10;&#10;Evidence (15pts): Sources are credible and cited effectively..."></textarea>
              <div class="parse-box__actions">
                <button class="btn btn-secondary btn-sm" id="parse-btn">Parse rubric →</button>
              </div>
            </div>
          </div>
          <div class="parsed-preview" id="parsed-preview">
            <div class="parsed-preview__label">
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M2 6L5 9L10 3" stroke="#3ecf8e" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              Criteria parsed — review before locking
            </div>
            <div id="parsed-list"></div>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-ghost btn-sm" id="modal-cancel-btn">Cancel</button>
          <button class="btn btn-primary btn-sm" id="confirm-btn" disabled>Confirm & lock thread</button>
        </div>
      </div>
    </div>
  `);

  $('modal-overlay').addEventListener('click', (e) => { if (e.target === $('modal-overlay')) close(); });
  $('modal-close-btn').addEventListener('click', close);
  $('modal-cancel-btn').addEventListener('click', close);
  $('parse-btn').addEventListener('click', parseRubric);
  $('confirm-btn').addEventListener('click', createThread);
}

export function open(onCreated) {
  _onCreated = onCreated;
  $('modal-name').value = '';
  $('rubric-paste').value = '';
  $('parsed-preview').classList.remove('visible');
  $('confirm-btn').disabled = true;
  state.parsed = [];
  $('modal-overlay').classList.add('open');
  setTimeout(() => $('modal-name').focus(), 80);
}

export function close() {
  $('modal-overlay').classList.remove('open');
}

function parseRubric() {
  const txt = $('rubric-paste').value.trim();
  if (!txt) { alert('Please paste rubric text first.'); return; }

  // Placeholder — will be replaced by POST /api/parse
  state.parsed = [
    { name: "Argument Quality", desc: "Clear, well-supported central argument maintained throughout", pts: 20 },
    { name: "Evidence & Sources", desc: "Credible sources cited and used effectively", pts: 20 },
    { name: "Structure & Flow", desc: "Logical organization with clear introduction and conclusion", pts: 15 }
  ];

  $('parsed-list').innerHTML = state.parsed.map(c => `
    <div class="parsed-criterion">
      <div class="parsed-criterion__body">
        <div class="parsed-criterion__name">${c.name}</div>
        <div class="parsed-criterion__desc">${c.desc}</div>
      </div>
      <div class="parsed-criterion__pts">${c.pts} pts</div>
    </div>
  `).join('');

  $('parsed-preview').classList.add('visible');
  $('confirm-btn').disabled = false;
}

async function createThread() {
  const name = $('modal-name').value.trim();
  if (!name) { alert('Please enter a thread name.'); return; }
  if (!state.parsed.length) { alert('Please parse a rubric first.'); return; }

  const maxScore = state.parsed.reduce((sum, c) => sum + c.pts, 0);

  const res = await fetch('/api/threads', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name,
      rubric: {
        criteria: state.parsed.map(c => ({ name: c.name, description: c.desc, max_points: c.pts })),
        max_score: maxScore,
      },
    }),
  });

  const data = await res.json();
  const thread = normalizeThread({ ...data.new_thread, criteria: data.new_rubric.criteria });
  state.threads.unshift(thread);
  close();
  _onCreated?.(thread);
}
