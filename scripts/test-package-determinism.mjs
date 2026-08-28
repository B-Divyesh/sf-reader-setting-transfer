import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const archive = resolve(root, 'dist/site/downloads/reader-setting-transfer-chrome.zip');
const run = (command, args) => execFileSync(command, args, { cwd: root, stdio: 'inherit' });
const digest = () => createHash('sha256').update(readFileSync(archive)).digest('hex');

run('npm', ['run', 'build:extension']);
run('node', ['scripts/package-extension.mjs']);
const first = digest();
run('unzip', ['-t', archive]);

run('npm', ['run', 'build:extension']);
run('node', ['scripts/package-extension.mjs']);
const second = digest();

if (first !== second) throw new Error(`Extension package is not deterministic: ${first} !== ${second}`);
console.log(`Deterministic extension package: ${first}`);
