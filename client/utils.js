export const $ = (id) => document.getElementById(id);

export function injectCSS(href) {
  if (document.querySelector(`link[href="${href}"]`)) return;
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = href;
  document.head.appendChild(link);
}

export function logoSVG(size = 22) {
  return `<svg class="logo-mark" width="${size}" height="${size}" viewBox="0 0 48 48" fill="none">
    <rect x="1" y="1" width="46" height="46" rx="10" fill="#191918" stroke="#2e2e2c" stroke-width="1"/>
    <line class="dim" x1="12" y1="17" x2="36" y2="17" stroke-width="1.5" stroke-linecap="round"/>
    <line class="dim" x1="12" y1="24" x2="36" y2="24" stroke-width="1.5" stroke-linecap="round"/>
    <line class="dim" x1="12" y1="31" x2="36" y2="31" stroke-width="1.5" stroke-linecap="round"/>
    <line x1="12" y1="17" x2="36" y2="17" stroke="#efefed" stroke-width="1.5" stroke-linecap="round"/>
    <line x1="12" y1="24" x2="23" y2="24" stroke="#efefed" stroke-width="1.5" stroke-linecap="round"/>
    <line x1="12" y1="31" x2="18" y2="31" stroke="#efefed" stroke-width="1.5" stroke-linecap="round"/>
    <path d="M26 21.5L30 25.5L37 17" class="check" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
  </svg>`;
}
