import { browser } from 'wxt/browser';
import { mergedProfile, hostnameFromUrl, type ContrastMode, type ReaderProfile } from '../../lib/profile';
import { getArticle, getOverrides, getProfile, saveOverrides, saveProfile } from '../../lib/storage';
import './style.css';

const shell = document.querySelector<HTMLElement>('#reader-shell')!;
const empty = document.querySelector<HTMLElement>('#empty-state')!;
const sheet = document.querySelector<HTMLElement>('#article')!;
const status = document.querySelector<HTMLElement>('#reader-status')!;
let profile: ReaderProfile;
let articleUrl = '';
let hostname = '';

function applyProfile(next: ReaderProfile) {
  profile = next;
  sheet.style.setProperty('--article-size', `${20 * profile.fontScale}px`);
  sheet.style.setProperty('--article-measure', `${profile.measure}ch`);
  sheet.style.setProperty('--article-leading', String(profile.lineHeight));
  sheet.style.setProperty('--article-para', `${profile.paragraphSpace}em`);
  sheet.style.setProperty('--article-spacing', `${profile.letterSpacing}em`);
  sheet.dataset.font = profile.fontChoice;
  sheet.dataset.contrast = profile.contrast;
  sheet.dataset.reduceMotion = String(profile.reduceMotion);
  document.querySelector<HTMLOutputElement>('#size-value')!.value = `${Math.round(profile.fontScale * 100)}%`;
  document.querySelector<HTMLSelectElement>('#reader-contrast')!.value = profile.contrast;
  document.querySelector<HTMLElement>('#profile-name')!.textContent = profile.name;
}

async function persistQuickChange(changes: Partial<ReaderProfile>) {
  const base = await getProfile();
  const updated = { ...base, ...changes };
  await saveProfile(updated);
  applyProfile(updated);
  status.textContent = 'Reading card updated.';
}

async function goBack() {
  if (articleUrl) await browser.tabs.update({ url: articleUrl });
}

async function init() {
  const [article, storedProfile, overrides] = await Promise.all([getArticle(), getProfile(), getOverrides()]);
  if (!article) {
    empty.hidden = false;
    shell.hidden = true;
    return;
  }
  articleUrl = article.url;
  hostname = hostnameFromUrl(article.url);
  document.title = `${article.title} — Reader Setting Transfer`;
  document.querySelector('#article-title')!.textContent = article.title;
  document.querySelector('#article-source')!.textContent = article.source;
  const byline = document.querySelector<HTMLElement>('#article-byline')!;
  byline.textContent = article.byline ? `By ${article.byline}` : '';
  byline.hidden = !article.byline;
  document.querySelector<HTMLElement>('#article-content')!.innerHTML = article.html;
  document.querySelector<HTMLElement>('#site-rule')!.textContent = `Applied on ${hostname}`;
  applyProfile(mergedProfile(storedProfile, overrides[hostname]));
  shell.hidden = false;
  empty.hidden = true;
  sheet.focus({ preventScroll: true });
}

document.querySelector('#size-down')!.addEventListener('click', () => {
  const fontScale = Math.max(.85, Number((profile.fontScale - .05).toFixed(2)));
  void persistQuickChange({ fontScale });
});
document.querySelector('#size-up')!.addEventListener('click', () => {
  const fontScale = Math.min(1.8, Number((profile.fontScale + .05).toFixed(2)));
  void persistQuickChange({ fontScale });
});
document.querySelector<HTMLSelectElement>('#reader-contrast')!.addEventListener('change', (event) => {
  const select = event.currentTarget as HTMLSelectElement;
  void persistQuickChange({ contrast: select.value as ContrastMode });
});
document.querySelector('#disable-button')!.addEventListener('click', async () => {
  const overrides = await getOverrides();
  overrides[hostname] = { ...(overrides[hostname] ?? {}), enabled: false };
  await saveOverrides(overrides);
  await goBack();
});
document.querySelectorAll('#return-button, #end-return-button').forEach((button) => button.addEventListener('click', () => void goBack()));
document.querySelectorAll('#settings-button, #empty-settings-button').forEach((button) => button.addEventListener('click', () => void browser.runtime.openOptionsPage()));

void init().catch(() => {
  shell.hidden = true;
  empty.hidden = false;
  empty.querySelector('p:last-of-type')!.textContent = 'The saved article could not be opened. Return to its page and collect it again.';
});
