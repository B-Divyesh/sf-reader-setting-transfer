import { browser } from 'wxt/browser';
import { defineBackground } from 'wxt/utils/define-background';
import { saveArticle } from '../lib/storage';
import type { ExtractedArticle } from '../lib/article';

const OPEN_READER_MESSAGE = 'reader-setting-transfer:open-reader';

function isExtractedArticle(value: unknown): value is ExtractedArticle {
  if (!value || typeof value !== 'object') return false;
  const article = value as Record<string, unknown>;
  return ['title', 'byline', 'source', 'url', 'html', 'excerpt'].every((key) => typeof article[key] === 'string') &&
    typeof article.extractedAt === 'number' && Number.isFinite(article.extractedAt);
}

export default defineBackground(() => {
  browser.runtime.onInstalled.addListener(({ reason }) => {
    if (reason === 'install') void browser.runtime.openOptionsPage();
  });

  browser.runtime.onMessage.addListener(async (message: unknown) => {
    if (!message || typeof message !== 'object' || (message as { type?: unknown }).type !== OPEN_READER_MESSAGE) return;
    const article = (message as { article?: unknown }).article;
    if (!isExtractedArticle(article)) throw new Error('The collected article could not be opened. Try Read this article again.');
    await saveArticle(article);
    await browser.tabs.create({ url: browser.runtime.getURL('/reader.html') });
    return { opened: true };
  });
});
