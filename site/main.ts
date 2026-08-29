import '@fontsource/atkinson-hyperlegible/400.css';
import '@fontsource/atkinson-hyperlegible/700.css';
import './style.css';

if (new URLSearchParams(location.search).get('demo') === '1') {
  // Preserve the route-focus intent across the canonical demo redirect. This
  // keeps the documented /?demo=1 entry point while giving keyboard and
  // screen-reader users a clear destination after the full-page navigation.
  try {
    sessionStorage.setItem('reader-setting-transfer:route-focus', '/demo/');
  } catch {
    // The demo remains usable when session storage is unavailable.
  }
  location.replace('/demo/');
}

const ROUTE_FOCUS_KEY = 'reader-setting-transfer:route-focus';
const routeName = () => `${location.pathname}${location.search}`;
const focusPageHeading = () => {
  const heading = document.querySelector<HTMLHeadingElement>('main h1');
  if (!heading) return;
  heading.tabIndex = -1;
  heading.focus({ preventScroll: true });
};

document.addEventListener('click', (event) => {
  const link = event.target instanceof Element ? event.target.closest<HTMLAnchorElement>('a[href]') : null;
  if (!link || link.target || link.hasAttribute('download')) return;
  const destination = new URL(link.href, location.href);
  if (destination.origin !== location.origin) return;
  if (destination.pathname === location.pathname && destination.search === location.search) return;
  try {
    sessionStorage.setItem(ROUTE_FOCUS_KEY, `${destination.pathname}${destination.search}`);
  } catch {
    // Focus still follows the browser's normal navigation when storage is unavailable.
  }
});

try {
  if (sessionStorage.getItem(ROUTE_FOCUS_KEY) === routeName()) {
    sessionStorage.removeItem(ROUTE_FOCUS_KEY);
    focusPageHeading();
  }
} catch {
  // A direct load should retain the browser's default focus position.
}

window.addEventListener('pageshow', (event) => {
  const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming | undefined;
  if (event.persisted || navigation?.type === 'back_forward') focusPageHeading();
});

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
