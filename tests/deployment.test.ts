import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const headers = readFileSync(resolve(import.meta.dirname, '../site/public/_headers'), 'utf8');

describe('static deployment policy', () => {
  it('keeps fingerprinted assets and the signed-off package immutable while revalidating the shell', () => {
    expect(headers).toContain('/assets/*\n  Cache-Control: public, max-age=31536000, immutable');
    expect(headers).toContain('/downloads/*\n  Cache-Control: public, max-age=31536000, immutable');
    expect(headers).toContain('/sw.js\n  Cache-Control: no-cache');
    expect(headers).toContain('/*\n  Content-Security-Policy:');
    expect(headers).toContain('X-Frame-Options: DENY');
  });
});
