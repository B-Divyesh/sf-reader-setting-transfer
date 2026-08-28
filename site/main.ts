import '@fontsource/atkinson-hyperlegible/400.css';
import '@fontsource/atkinson-hyperlegible/700.css';
import './style.css';

const offlineBanner = document.querySelector<HTMLElement>('#offline-banner');
const promiseStrip = document.querySelector<HTMLElement>('.promise-strip');
const syncOnlineState = () => {
  if (offlineBanner) offlineBanner.hidden = navigator.onLine;
};
window.addEventListener('online', syncOnlineState);
window.addEventListener('offline', syncOnlineState);
syncOnlineState();

promiseStrip?.addEventListener('keydown', (event) => {
  const distance = Math.max(80, Math.round(promiseStrip.clientWidth * .8));
  if (event.key === 'ArrowRight') {
    event.preventDefault();
    promiseStrip.scrollBy({ left: distance, behavior: 'smooth' });
  } else if (event.key === 'ArrowLeft') {
    event.preventDefault();
    promiseStrip.scrollBy({ left: -distance, behavior: 'smooth' });
  } else if (event.key === 'Home') {
    event.preventDefault();
    promiseStrip.scrollTo({ left: 0, behavior: 'smooth' });
  } else if (event.key === 'End') {
    event.preventDefault();
    promiseStrip.scrollTo({ left: promiseStrip.scrollWidth, behavior: 'smooth' });
  }
});

if ('serviceWorker' in navigator && (location.protocol === 'https:' || location.hostname === 'localhost')) {
  window.addEventListener('load', () => navigator.serviceWorker.register('/sw.js').catch(() => undefined));
}
