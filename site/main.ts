import '@fontsource/atkinson-hyperlegible/400.css';
import '@fontsource/atkinson-hyperlegible/700.css';
import './style.css';

const offlineBanner = document.querySelector<HTMLElement>('#offline-banner');
const syncOnlineState = () => {
  if (offlineBanner) offlineBanner.hidden = navigator.onLine;
};
window.addEventListener('online', syncOnlineState);
window.addEventListener('offline', syncOnlineState);
syncOnlineState();

if ('serviceWorker' in navigator && (location.protocol === 'https:' || location.hostname === 'localhost')) {
  window.addEventListener('load', () => navigator.serviceWorker.register('/sw.js').catch(() => undefined));
}
