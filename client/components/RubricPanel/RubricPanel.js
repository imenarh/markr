import { injectCSS } from '../../utils.js';
injectCSS('/components/RubricPanel/RubricPanel.css');

export function init(container, thread) {
  const total = thread.criteria.reduce((s, c) => s + c.max_points, 0);

  container.innerHTML = `
    <div class="rubric-panel">
      <div class="rubric-panel__header">
        <span class="rubric-panel__title">Rubric</span>
        <span class="rubric-total"><strong>${total}</strong> pts</span>
      </div>
      <div class="rubric-panel__body">
        ${thread.criteria.map(c => {
          return `
          <div class="criterion-item">
            <div class="criterion-item__body">
              <div class="criterion-item__name">${c.name}</div>
              <div class="criterion-item__desc">${c.description}</div>
            </div>
            <div class="criterion-item__pts">${c.max_points} pts</div>
          </div>
        `}).join('')}
      </div>
    </div>
  `;
}
