import { injectCSS } from '../../utils.js';
injectCSS('/components/ThreadCard/ThreadCard.css');

export function ThreadCard({ id, name, date, criteria, results }) {
  return `
    <div class="thread-card" data-id="${id}">
      <div class="thread-card__name">${name}</div>
      <div class="thread-card__tags">
        <span class="badge badge-default">${criteria.length} criteria</span>
        <span class="badge badge-default">${results.length} graded</span>
      </div>
      <div class="thread-card__footer">
        <span class="thread-card__date">${date}</span>
        <span class="thread-card__arrow">→</span>
      </div>
    </div>
  `;
}

export function EmptyState() {
  return `
    <div class="empty-state">
      <div class="empty-icon">
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
          <rect x="1" y="1" width="16" height="16" rx="3" stroke="#3a3a38" stroke-width="1"/>
        </svg>
      </div>
      <div class="empty-title">No threads yet</div>
      <div class="empty-desc">Create a grading thread to get started</div>
    </div>
  `;
}
