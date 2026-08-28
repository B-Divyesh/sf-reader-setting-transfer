import { DEFAULT_PROFILE, validateProfile, type ReaderProfile } from '../../lib/profile';
import '../main';

const DEMO_STORAGE_KEY = 'demo:reader-profile';
const SAMPLE_PROFILE: ReaderProfile = {
  ...DEFAULT_PROFILE,
  name: 'Quiet evening',
  fontScale: 1.2,
  measure: 62,
  lineHeight: 1.75,
  paragraphSpace: 1.2,
  letterSpacing: .02,
  contrast: 'paper',
  fontChoice: 'hyperlegible',
  reduceMotion: true
};

const controls = document.querySelector<HTMLFormElement>('#demo-controls')!;
const article = document.querySelector<HTMLElement>('#demo-article')!;
const status = document.querySelector<HTMLElement>('#demo-status')!;
const fields = {
  fontScale: document.querySelector<HTMLInputElement>('#demo-size')!,
  lineHeight: document.querySelector<HTMLInputElement>('#demo-leading')!,
  contrast: document.querySelector<HTMLSelectElement>('#demo-contrast')!,
  fontChoice: document.querySelector<HTMLSelectElement>('#demo-font')!,
  reduceMotion: document.querySelector<HTMLInputElement>('#demo-motion')!
};

function readProfile(): ReaderProfile {
  return {
    ...SAMPLE_PROFILE,
    fontScale: Number(fields.fontScale.value),
    lineHeight: Number(fields.lineHeight.value),
    contrast: fields.contrast.value as ReaderProfile['contrast'],
    fontChoice: fields.fontChoice.value as ReaderProfile['fontChoice'],
    reduceMotion: fields.reduceMotion.checked
  };
}

function render(profile: ReaderProfile, persist = true) {
  fields.fontScale.value = String(profile.fontScale);
  fields.lineHeight.value = String(profile.lineHeight);
  fields.contrast.value = profile.contrast;
  fields.fontChoice.value = profile.fontChoice;
  fields.reduceMotion.checked = profile.reduceMotion;
  article.style.setProperty('--demo-size', `${20 * profile.fontScale}px`);
  article.style.setProperty('--demo-leading', String(profile.lineHeight));
  article.style.setProperty('--demo-para', `${profile.paragraphSpace}em`);
  article.style.setProperty('--demo-spacing', `${profile.letterSpacing}em`);
  article.dataset.contrast = profile.contrast;
  article.dataset.font = profile.fontChoice;
  article.dataset.reduceMotion = String(profile.reduceMotion);
  document.querySelector<HTMLOutputElement>('#demo-size-value')!.value = `${Math.round(profile.fontScale * 100)}%`;
  document.querySelector<HTMLOutputElement>('#demo-leading-value')!.value = `${profile.lineHeight.toFixed(2)}×`;
  if (persist) sessionStorage.setItem(DEMO_STORAGE_KEY, JSON.stringify(profile));
}

function resetDemo() {
  sessionStorage.removeItem(DEMO_STORAGE_KEY);
  render(SAMPLE_PROFILE);
  status.removeAttribute('data-error');
  status.textContent = 'Demo reset to the sample reading card.';
  article.focus({ preventScroll: true });
}

controls.addEventListener('input', () => {
  render(readProfile());
  status.removeAttribute('data-error');
  status.textContent = 'Sample settings updated.';
});

document.querySelector('#reset-demo')!.addEventListener('click', resetDemo);
document.querySelector('#start-real')!.addEventListener('click', () => sessionStorage.removeItem(DEMO_STORAGE_KEY));

document.querySelector('#demo-export')!.addEventListener('click', () => {
  const profile = readProfile();
  const url = URL.createObjectURL(new Blob([`${JSON.stringify(profile, null, 2)}\n`], { type: 'application/json' }));
  const link = document.createElement('a');
  link.href = url;
  link.download = 'sample-reading-card.json';
  link.click();
  window.setTimeout(() => URL.revokeObjectURL(url), 0);
  status.removeAttribute('data-error');
  status.textContent = 'Sample reading card exported.';
});

document.querySelector<HTMLInputElement>('#demo-import')!.addEventListener('change', async (event) => {
  const input = event.currentTarget as HTMLInputElement;
  const file = input.files?.[0];
  if (!file) return;
  try {
    if (file.size > 20_000) throw new Error('That file is too large to be a reading card.');
    const profile = validateProfile(JSON.parse(await file.text()));
    render(profile);
    status.removeAttribute('data-error');
    status.textContent = `Imported “${profile.name}” into the demo.`;
  } catch (error) {
    status.dataset.error = '';
    status.textContent = error instanceof Error ? error.message : 'That reading card could not be imported.';
  } finally {
    input.value = '';
  }
});

try {
  const stored = sessionStorage.getItem(DEMO_STORAGE_KEY);
  render(stored ? validateProfile(JSON.parse(stored)) : SAMPLE_PROFILE, false);
} catch {
  resetDemo();
}
