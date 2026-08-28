import { execFileSync } from 'node:child_process';
import { mkdirSync, rmSync } from 'node:fs';
import { resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const extensionDir = resolve(root, '.output/chrome-mv3');
const downloadsDir = resolve(root, 'dist/site/downloads');
const archive = resolve(downloadsDir, 'reader-setting-transfer-chrome.zip');

mkdirSync(downloadsDir, { recursive: true });
rmSync(archive, { force: true });
execFileSync('zip', ['-qr', archive, '.'], { cwd: extensionDir });
console.log(`Packaged ${archive}`);
