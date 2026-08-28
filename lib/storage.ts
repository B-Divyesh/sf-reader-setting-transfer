import { browser } from 'wxt/browser';
import { DEFAULT_PROFILE, type ReaderProfile, type SiteOverride } from './profile';
import type { ExtractedArticle } from './article';

export const STORAGE_KEYS = {
  profile: 'readerProfile',
  overrides: 'siteOverrides',
  article: 'currentArticle'
} as const;

export async function getProfile(): Promise<ReaderProfile> {
  const data = await browser.storage.local.get(STORAGE_KEYS.profile);
  return (data[STORAGE_KEYS.profile] as ReaderProfile | undefined) ?? DEFAULT_PROFILE;
}

export async function saveProfile(profile: ReaderProfile): Promise<void> {
  await browser.storage.local.set({ [STORAGE_KEYS.profile]: profile });
}

export async function getOverrides(): Promise<Record<string, SiteOverride>> {
  const data = await browser.storage.local.get(STORAGE_KEYS.overrides);
  return (data[STORAGE_KEYS.overrides] as Record<string, SiteOverride> | undefined) ?? {};
}

export async function saveOverrides(overrides: Record<string, SiteOverride>): Promise<void> {
  await browser.storage.local.set({ [STORAGE_KEYS.overrides]: overrides });
}

export async function getArticle(): Promise<ExtractedArticle | null> {
  const data = await browser.storage.local.get(STORAGE_KEYS.article);
  return (data[STORAGE_KEYS.article] as ExtractedArticle | undefined) ?? null;
}

export async function saveArticle(article: ExtractedArticle): Promise<void> {
  await browser.storage.local.set({ [STORAGE_KEYS.article]: article });
}
