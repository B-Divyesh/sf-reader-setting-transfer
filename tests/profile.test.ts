import { describe, expect, it } from 'vitest';
import { DEFAULT_PROFILE, hostnameFromUrl, mergedProfile, validateProfile } from '../lib/profile';

describe('reading profiles', () => {
  it('accepts a complete, supported profile', () => {
    expect(validateProfile({ ...DEFAULT_PROFILE, name: 'Large print' })).toMatchObject({ name: 'Large print', version: 1 });
  });

  it('rejects out-of-range and incomplete imports', () => {
    expect(() => validateProfile({ ...DEFAULT_PROFILE, fontScale: 4 })).toThrow(/Text size/);
    expect(() => validateProfile({ name: 'Unknown' })).toThrow(/version/);
  });

  it('merges visible per-site preferences without changing the original', () => {
    const merged = mergedProfile(DEFAULT_PROFILE, { enabled: true, profile: { contrast: 'dark', measure: 55 } });
    expect(merged).toMatchObject({ contrast: 'dark', measure: 55 });
    expect(DEFAULT_PROFILE.contrast).toBe('paper');
  });

  it('normalises site names', () => {
    expect(hostnameFromUrl('https://www.example.com/story')).toBe('example.com');
    expect(hostnameFromUrl('not a url')).toBe('');
  });
});
