import { DEFAULT_PROFILE, parseProfileJson, validateProfile, type ReaderProfile } from '../../lib/profile';
import { getOverrides, getProfile, saveOverrides, saveProfile } from '../../lib/storage';
import './style.css';

const form = document.querySelector<HTMLFormElement>('#profile-form')!;
const preview = document.querySelector<HTMLElement>('#preview')!;
const saveStatus = document.querySelector<HTMLElement>('#save-status')!;
const importStatus = document.querySelector<HTMLElement>('#import-status')!;
const fields = {
  name: document.querySelector<HTMLInputElement>('#profile-name')!,
  fontScale: document.querySelector<HTMLInputElement>('#font-scale')!,
  measure: document.querySelector<HTMLInputElement>('#measure')!,
  lineHeight: document.querySelector<HTMLInputElement>('#line-height')!,
  paragraphSpace: document.querySelector<HTMLInputElement>('#paragraph-space')!,
  letterSpacing: document.querySelector<HTMLInputElement>('#letter-spacing')!,
  contrast: document.querySelector<HTMLSelectElement>('#contrast')!,
  fontChoice: document.querySelector<HTMLSelectElement>('#font-choice')!,
  reduceMotion: document.querySelector<HTMLInputElement>('#reduce-motion')!
};

function readForm(): ReaderProfile {
  return {
    version: 1,
    name: fields.name.value.trim() || DEFAULT_PROFILE.name,
    fontScale: Number(fields.fontScale.value),
    measure: Number(fields.measure.value),
    lineHeight: Number(fields.lineHeight.value),
    paragraphSpace: Number(fields.paragraphSpace.value),
    letterSpacing: Number(fields.letterSpacing.value),
    contrast: fields.contrast.value as ReaderProfile['contrast'],
    fontChoice: fields.fontChoice.value as ReaderProfile['fontChoice'],
    reduceMotion: fields.reduceMotion.checked
  };
}

function fillForm(profile: ReaderProfile) {
  fields.name.value = profile.name;
  fields.fontScale.value = String(profile.fontScale);
  fields.measure.value = String(profile.measure);
  fields.lineHeight.value = String(profile.lineHeight);
  fields.paragraphSpace.value = String(profile.paragraphSpace);
  fields.letterSpacing.value = String(profile.letterSpacing);
  fields.contrast.value = profile.contrast;
  fields.fontChoice.value = profile.fontChoice;
  fields.reduceMotion.checked = profile.reduceMotion;
  updatePreview();
}

function updatePreview() {
  const profile = readForm();
  preview.style.setProperty('--preview-size', `${20 * profile.fontScale}px`);
  preview.style.setProperty('--preview-measure', `${profile.measure}ch`);
  preview.style.setProperty('--preview-leading', String(profile.lineHeight));
  preview.style.setProperty('--preview-para', `${profile.paragraphSpace}em`);
  preview.style.setProperty('--preview-spacing', `${profile.letterSpacing}em`);
  preview.dataset.font = profile.fontChoice;
  preview.dataset.contrast = profile.contrast;
  document.querySelector<HTMLOutputElement>('#font-scale-value')!.value = `${Math.round(profile.fontScale * 100)}%`;
  document.querySelector<HTMLOutputElement>('#measure-value')!.value = `${profile.measure} characters`;
  document.querySelector<HTMLOutputElement>('#line-height-value')!.value = `${profile.lineHeight.toFixed(2)}×`;
  document.querySelector<HTMLOutputElement>('#paragraph-space-value')!.value = `${profile.paragraphSpace.toFixed(1)} lines`;
  document.querySelector<HTMLOutputElement>('#letter-spacing-value')!.value = profile.letterSpacing ? `${Math.round(profile.letterSpacing * 100)}%` : 'Default';
}

async function renderOverrides() {
  const overrides = await getOverrides();
  const list = document.querySelector<HTMLUListElement>('#overrides-list')!;
  const entries = Object.entries(overrides).filter(([, value]) => value.enabled === false);
  list.replaceChildren();
  document.querySelector<HTMLElement>('#overrides-empty')!.hidden = entries.length > 0;
  entries.forEach(([site]) => {
    const item = document.createElement('li');
    const label = document.createElement('span');
    label.textContent = site;
    const button = document.createElement('button');
    button.className = 'button button--quiet';
    button.type = 'button';
    button.textContent = 'Use reader again';
    button.addEventListener('click', async () => {
      const current = await getOverrides();
      delete current[site];
      await saveOverrides(current);
      await renderOverrides();
    });
    item.append(label, button);
    list.append(item);
  });
}

form.addEventListener('input', updatePreview);
form.addEventListener('submit', async (event) => {
  event.preventDefault();
  const profile = validateProfile(readForm());
  await saveProfile(profile);
  saveStatus.textContent = 'Saved on this device.';
  window.setTimeout(() => { saveStatus.textContent = ''; }, 2500);
});

document.querySelector('#export-button')!.addEventListener('click', () => {
  const profile = readForm();
  const blob = new Blob([`${JSON.stringify(profile, null, 2)}\n`], { type: 'application/json' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'my-reading-card.json';
  link.click();
  URL.revokeObjectURL(link.href);
  importStatus.removeAttribute('data-error');
  importStatus.textContent = 'Your reading card was exported.';
});

document.querySelector<HTMLInputElement>('#import-file')!.addEventListener('change', async (event) => {
  const input = event.currentTarget as HTMLInputElement;
  const file = input.files?.[0];
  if (!file) return;
  try {
    if (file.size > 20_000) throw new Error('That file is too large to be a reading card.');
    const profile = parseProfileJson(await file.text());
    await saveProfile(profile);
    fillForm(profile);
    importStatus.removeAttribute('data-error');
    importStatus.textContent = `Imported “${profile.name}”.`;
  } catch (error) {
    importStatus.dataset.error = '';
    importStatus.textContent = error instanceof Error ? error.message : 'That file could not be imported.';
  } finally {
    input.value = '';
  }
});

Promise.all([getProfile(), renderOverrides()])
  .then(([profile]) => fillForm(profile))
  .catch(() => {
    fillForm(DEFAULT_PROFILE);
    saveStatus.textContent = 'Stored settings could not be read. Showing safe defaults.';
  });
