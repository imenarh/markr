import { injectCSS, logoSVG } from '../../utils.js';
injectCSS('/components/Nav/Nav.css');

export function render() {
  return `
    <nav class="nav">
      <div class="logo">
        ${logoSVG(22)}
        <span class="logo-word">markr</span>
      </div>
      <div class="nav-right">
        <button class="btn btn-primary btn-sm" id="nav-new-btn">+ New thread</button>
      </div>
    </nav>
  `;
}

export function mount(container, { onNewThread }) {
  container.querySelector('#nav-new-btn').addEventListener('click', onNewThread);
}
