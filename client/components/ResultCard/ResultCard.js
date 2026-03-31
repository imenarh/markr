import { injectCSS } from '../../utils.js';
injectCSS('/components/ResultCard/ResultCard.css');

export function showResult(container, result) {
  const pct = Math.round(result.grade / result.max_grade * 100);

  container.innerHTML = `
    <div class="result-card">
      <div class="result-header">
        <div class="result-header-left">
          <span class="result-score">${result.grade}</span>
          <span class="result-score-max">/ ${result.max_grade} pts</span>
        </div>
        <span class="result-pct">${pct}%</span>
      </div>
      ${result.scores.map(s => {
        const sp = Math.round(s.points / s.max_points * 100);
        return `
        <div class="result-row">
          <div class="result-row-head">
            <span class="result-row-name">${s.name}</span>
            <span class="result-row-pts">${s.points} / ${s.max_points}</span>
          </div>
          <div class="result-row-fb">${s.feedback}</div>
          <div class="score-bar">
            <div class="score-bar-fill" style="width:${sp}%"></div>
          </div>
        </div>
      `}).join('')}
    </div>
  `;
}
