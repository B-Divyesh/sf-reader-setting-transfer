import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const headers = readFileSync(resolve(import.meta.dirname, '../site/public/_headers'), 'utf8');
const staticWebAppConfig = JSON.parse(readFileSync(resolve(import.meta.dirname, '../site/public/staticwebapp.config.json'), 'utf8'));

describe('static deployment policy', () => {
  it('keeps fingerprinted assets immutable while revalidating the stable extension download and shell', () => {
    expect(headers).toContain('/assets/*\n  Cache-Control: public, max-age=31536000, immutable');
    expect(headers).toContain('/downloads/*\n  Cache-Control: public, max-age=0, must-revalidate');
    expect(headers).toContain('/sw.js\n  Cache-Control: no-cache');
    expect(headers).toContain('/*\n  Content-Security-Policy:');
    expect(headers).toContain('X-Frame-Options: DENY');
    expect(staticWebAppConfig.globalHeaders['Content-Security-Policy']).toContain("default-src 'self'");
    expect(staticWebAppConfig.routes).toContainEqual({
      route: '/assets/*',
      headers: { 'Cache-Control': 'public, max-age=31536000, immutable' }
    });
    expect(staticWebAppConfig.routes).toContainEqual({
      route: '/downloads/*',
      headers: {
        'Cache-Control': 'public, max-age=0, must-revalidate',
        'Content-Disposition': 'attachment'
      }
    });
    expect(staticWebAppConfig.routes).toContainEqual({
      route: '/sw.js',
      headers: { 'Cache-Control': 'no-cache' }
    });
    expect(staticWebAppConfig.navigationFallback).toBeUndefined();
    expect(staticWebAppConfig.responseOverrides['404']).toEqual({ rewrite: '/404.html', statusCode: 404 });
  });

  it('@claim:free-open-source ships without a price gate under the MIT license', () => {
    const license = readFileSync(resolve(import.meta.dirname, '../LICENSE'), 'utf8');
    const manifest = JSON.parse(readFileSync(resolve(import.meta.dirname, '../package.json'), 'utf8'));
    expect(license).toContain('Permission is hereby granted, free of charge');
    expect(manifest.dependencies).not.toHaveProperty('stripe');
    expect(manifest.dependencies).not.toHaveProperty('@dodo-payments/node');
  });
});
