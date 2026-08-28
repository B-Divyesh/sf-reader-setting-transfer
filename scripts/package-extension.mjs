import { execFileSync } from 'node:child_process';
import { mkdirSync, readdirSync, rmSync, statSync, utimesSync } from 'node:fs';
import { relative, resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const extensionDir = resolve(root, '.output/chrome-mv3');
const downloadsDir = resolve(root, 'dist/site/downloads');
const archive = resolve(downloadsDir, 'reader-setting-transfer-chrome.zip');

mkdirSync(downloadsDir, { recursive: true });
rmSync(archive, { force: true });
const archiveEntries = readdirSync(extensionDir, { recursive: true })
  .filter((entry) => statSync(resolve(extensionDir, entry)).isFile())
  .map((entry) => relative(extensionDir, resolve(extensionDir, entry)))
  .sort();

// ZIP stores DOS mtimes. Normalise generated-file mtimes and entry ordering so
// a rebuild of the same extension produces the exact same downloadable artifact.
const archiveTimestamp = new Date('1980-01-01T00:00:00Z');
archiveEntries.forEach((entry) => utimesSync(resolve(extensionDir, entry), archiveTimestamp, archiveTimestamp));
execFileSync('zip', ['-Xq', archive, ...archiveEntries], { cwd: extensionDir });
console.log(`Packaged ${archive}`);
