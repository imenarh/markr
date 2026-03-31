import { injectCSS } from '../../utils.js';
injectCSS('/components/ResultCard/ResultCard.css');

export function showProgress(container, criteria, onDone) {
  container.innerHTML = `
    <div class="progress-card">
      <div class="progress-card__title">Grading in progress</div>
      ${criteria.map(c => `
        <div class="progress-row">
          <span class="progress-name">${c.name}</span>
          <span class="progress-status s-pending" id="ps-${c.id}">Pending</span>
        </div>
      `).join('')}
    </div>
  `;

  let i = 0;
  function step() {
    if (i > 0) {
      const p = document.getElementById(`ps-${criteria[i - 1].id}`);
      p.textContent = 'Done';
      p.className = 'progress-status s-done';
    }
    if (i < criteria.length) {
      const p = document.getElementById(`ps-${criteria[i].id}`);
      p.textContent = 'Grading...';
      p.className = 'progress-status s-active';
      i++;
      setTimeout(step, 820);
    } else {
      onDone();
    }
  }
  setTimeout(step, 280);
}

export function showResult(container, result) {
  container.innerHTML = `
    <div class="result-card">
      <div class="result-header">
        <div>
          <span class="result-score">${result.grade}</span>
          <span class="result-score-max"> / ${result.max_grade} pts</span>
        </div>
        <span class="result-date">Just now</span>
      </div>
      ${result.scores.map(s => `
        <div class="result-row">
          <div class="result-row-head">
            <span class="result-row-name">${s.name}</span>
            <span class="result-row-pts">${s.points} / ${s.max_points}</span>
          </div>
          <div class="result-row-fb">${s.feedback}</div>
          <div class="score-bar"><div class="score-bar-fill" style="width:${Math.round(s.points / s.max_points * 100)}%"></div></div>
        </div>
      `).join('')}
    </div>
  `;
}
