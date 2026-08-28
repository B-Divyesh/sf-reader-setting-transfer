import { readFile } from 'node:fs/promises';

const pages = ['site/index.html', 'site/demo/index.html', 'site/privacy/index.html', 'site/terms/index.html', 'site/404.html'];
const requiredHead = ['rel="canonical"', 'rel="apple-touch-icon"', 'property="og:title"', 'name="twitter:card"'];
const errors = [];

for (const path of pages) {
  const html = await readFile(path, 'utf8');
  for (const marker of requiredHead) {
    if (!html.includes(marker)) errors.push(`${path}: missing ${marker}`);
  }
  if ((html.match(/<h1[\s>]/g) ?? []).length !== 1) errors.push(`${path}: expected exactly one h1`);
  if (!html.includes('<main')) errors.push(`${path}: missing main landmark`);
  if (!html.includes('<html lang="en">')) errors.push(`${path}: missing lang=en`);
}

const landingAndReadme = `${await readFile('site/index.html', 'utf8')}\n${await readFile('README.md', 'utf8')}`;
for (const word of ['leverage', 'seamless', 'effortless', 'robust', 'powerful', 'intuitive', 'reimagine', 'supercharge', 'unlock', 'delightful', 'journey', 'ecosystem', 'AI-powered']) {
  if (new RegExp(`\\b${word}\\b`, 'i').test(landingAndReadme)) errors.push(`plain words: banned term “${word}”`);
}

const claims = JSON.parse(await readFile('.factory/claims.json', 'utf8'));
const ids = claims.map((claim) => claim.id);
if (new Set(ids).size !== ids.length) errors.push('.factory/claims.json: duplicate claim id');
const publicClaimReferences = [
  ...landingAndReadme.matchAll(/data-claims?="([^"]+)"/g),
  ...landingAndReadme.matchAll(/<!--\s*claim:([a-z0-9-]+)\s*-->/g)
].flatMap((match) => match[1].split(/\s+/));
for (const id of publicClaimReferences) {
  if (!ids.includes(id)) errors.push(`public claim reference “${id}” is missing from .factory/claims.json`);
}
const testSources = await Promise.all(['e2e/site.spec.ts', 'e2e/extension.spec.ts', 'tests/article.test.ts', 'tests/deployment.test.ts'].map((path) => readFile(path, 'utf8')));
for (const id of ids) {
  const tag = `@claim:${id}`;
  const occurrences = testSources.reduce((count, source) => count + source.split(tag).length - 1, 0);
  if (occurrences !== 1) errors.push(`${tag}: expected one test tag, found ${occurrences}`);
}

if (errors.length) {
  console.error(errors.join('\n'));
  process.exitCode = 1;
} else {
  console.log(`Content lint passed for ${pages.length} routes and ${claims.length} claims.`);
}
