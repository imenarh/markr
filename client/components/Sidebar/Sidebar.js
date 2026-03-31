import { injectCSS, $ } from '../../utils.js';
injectCSS('/components/Sidebar/Sidebar.css');

let _open = false;

export function init(container, thread) {
  _open = false;
  container.innerHTML = `
    <div class="sidebar" id="sidebar">
      <div class="sidebar-body" id="sidebar-body"></div>
    </div>
  `;
  render(thread);
}

export function render(thread) {
  const body = $('sidebar-body');
  if (!body) return;

  if (!thread.results.length) {
    body.innerHTML = '<div class="sidebar-empty">No gradings yet.<br>Submit something to get started.</div>';
    return;
  }

  body.innerHTML = thread.results.map(r => `
    <div class="sb-item">
      <div class="sb-item-head" data-rid="${r.id}">
        <div class="sb-item-score">${r.grade} / ${r.max_grade} pts</div>
        <div class="sb-item-right">
          <span class="sb-item-date">${r.date} · ${r.time}</span>
          <span class="sb-item-pct">${Math.round(r.grade / r.max_grade * 100)}%</span>
        </div>
      </div>
      <div class="sb-detail" id="sbd-${r.id}">
        ${r.scores.map(s => `
          <div class="sb-crit">
            <div class="sb-crit-top">
              <span class="sb-crit-name">${s.name}</span>
              <span class="sb-crit-pts">${s.points}/${s.max_points}</span>
            </div>
            <div class="sb-crit-fb">${s.feedback}</div>
          </div>
        `).join('')}
      </div>
    </div>
  `).join('');

  body.querySelectorAll('.sb-item-head').forEach(head => {
    head.addEventListener('click', () => {
      const rid = head.dataset.rid;
      body.querySelectorAll('.sb-detail').forEach(d => {
        if (d.id !== `sbd-${rid}`) d.classList.remove('open');
      });
      document.getElementById(`sbd-${rid}`)?.classList.toggle('open');
    });
  });
}

export function open() {
  _open = true;
  $('sidebar')?.classList.add('open');
}

export function close() {
  _open = false;
  $('sidebar')?.classList.remove('open');
}

export function toggle() {
  _open ? close() : open();
}
