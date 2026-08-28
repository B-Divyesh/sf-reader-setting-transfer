export const PROFILE_VERSION = 1 as const;

export type ContrastMode = 'paper' | 'high' | 'dark';
export type FontChoice = 'serif' | 'hyperlegible' | 'dyslexia';

export interface ReaderProfile {
  version: typeof PROFILE_VERSION;
  name: string;
  fontScale: number;
  measure: number;
  lineHeight: number;
  paragraphSpace: number;
  letterSpacing: number;
  contrast: ContrastMode;
  fontChoice: FontChoice;
  reduceMotion: boolean;
}

export interface SiteOverride {
  enabled: boolean;
  profile?: Partial<Omit<ReaderProfile, 'version' | 'name'>>;
}

export const DEFAULT_PROFILE: ReaderProfile = {
  version: PROFILE_VERSION,
  name: 'My reading card',
  fontScale: 1,
  measure: 66,
  lineHeight: 1.65,
  paragraphSpace: 1,
  letterSpacing: 0,
  contrast: 'paper',
  fontChoice: 'serif',
  reduceMotion: true
};

const inRange = (value: unknown, min: number, max: number): value is number =>
  typeof value === 'number' && Number.isFinite(value) && value >= min && value <= max;

export function validateProfile(value: unknown): ReaderProfile {
  if (!value || typeof value !== 'object') throw new Error('The file does not contain a reading profile.');
  const profile = value as Record<string, unknown>;
  if (profile.version !== PROFILE_VERSION) throw new Error('This profile version is not supported.');
  if (typeof profile.name !== 'string' || profile.name.trim().length < 1 || profile.name.length > 60) {
    throw new Error('The profile needs a name between 1 and 60 characters.');
  }
  if (!inRange(profile.fontScale, 0.85, 1.8)) throw new Error('Text size is outside the supported range.');
  if (!inRange(profile.measure, 40, 85)) throw new Error('Line length is outside the supported range.');
  if (!inRange(profile.lineHeight, 1.2, 2.2)) throw new Error('Line spacing is outside the supported range.');
  if (!inRange(profile.paragraphSpace, 0.5, 2.5)) throw new Error('Paragraph spacing is outside the supported range.');
  if (!inRange(profile.letterSpacing, 0, 0.08)) throw new Error('Letter spacing is outside the supported range.');
  if (!['paper', 'high', 'dark'].includes(String(profile.contrast))) throw new Error('Contrast setting is not recognised.');
  if (!['serif', 'hyperlegible', 'dyslexia'].includes(String(profile.fontChoice))) throw new Error('Font setting is not recognised.');
  if (typeof profile.reduceMotion !== 'boolean') throw new Error('Reduce motion must be on or off.');
  return {
    version: PROFILE_VERSION,
    name: profile.name.trim(),
    fontScale: profile.fontScale,
    measure: profile.measure,
    lineHeight: profile.lineHeight,
    paragraphSpace: profile.paragraphSpace,
    letterSpacing: profile.letterSpacing,
    contrast: profile.contrast as ContrastMode,
    fontChoice: profile.fontChoice as FontChoice,
    reduceMotion: profile.reduceMotion
  };
}

export function mergedProfile(profile: ReaderProfile, override?: SiteOverride): ReaderProfile {
  return override?.profile ? { ...profile, ...override.profile } : profile;
}

export function hostnameFromUrl(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, '');
  } catch {
    return '';
  }
}
