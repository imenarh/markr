import { injectCSS, $ } from '../../utils.js';
injectCSS('/components/RubricPanel/RubricPanel.css');

let _open = false;

export function init(container, thread) {
  _open = false;
  const total = thread.criteria.reduce((s, c) => s + c.max_points, 0);

  container.innerHTML = `
    <div class="rubric-panel">
      <div class="rubric-panel__header" id="rubric-header">
        <div class="rubric-panel__left">
          <span class="rubric-panel__title">Rubric</span>
          <span class="badge badge-locked">locked</span>
        </div>
        <button class="btn btn-ghost btn-sm" id="rubric-toggle-btn" style="pointer-events:none">Show</button>
      </div>
      <div id="rubric-body" style="display:none">
        <div class="rubric-panel__body">
          <div>
            ${thread.criteria.map(c => `
              <div class="criterion-item">
                <div class="criterion-item__body">
                  <div class="criterion-item__name">${c.name}</div>
                  <div class="criterion-item__desc">${c.description}</div>
                </div>
                <div class="criterion-item__pts">${c.max_points} pts</div>
              </div>
            `).join('')}
          </div>
          <div class="rubric-footer">
            <span class="rubric-total">Total: <strong>${total} pts</strong></span>
          </div>
        </div>
      </div>
    </div>
  `;

  $('rubric-header').addEventListener('click', toggle);
}

export function toggle() {
  _open = !_open;
  $('rubric-body').style.display = _open ? 'block' : 'none';
  $('rubric-toggle-btn').textContent = _open ? 'Hide' : 'Show';
}
