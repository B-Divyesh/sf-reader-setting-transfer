// @vitest-environment jsdom
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { extractArticleFromPage } from '../lib/article';

describe('article extraction', () => {
  beforeEach(() => {
    vi.spyOn(Date, 'now').mockReturnValue(1234);
    document.head.innerHTML = '<title>A test story</title><meta name="author" content="Ada Reader">';
    document.body.innerHTML = `<nav>Site links</nav><article><h1>Readable title</h1>
      <p>This is the first substantial paragraph of an article. It contains enough useful text to establish a readable source and explains the subject with clear details for a person opening reader mode.</p>
      <script>alert('bad')</script><aside>Advertisement</aside>
      <h2>Second idea</h2><p>The next paragraph continues the article with more than enough information for extraction. It includes a <a href="/next">related link</a> while preserving useful semantic structure for navigation.</p>
      <ul><li>A meaningful list item that belongs to the article.</li></ul></article>`;
    window.history.replaceState({}, '', '/article');
  });

  it('keeps semantic content and removes active or distracting elements', () => {
    const article = extractArticleFromPage();
    expect(article.title).toBe('Readable title');
    expect(article.byline).toBe('Ada Reader');
    expect(article.html).toContain('<h2>Readable title</h2>');
    expect(article.html).toContain('<ul>');
    expect(article.html).not.toContain('<script');
    expect(article.html).not.toContain('Advertisement');
    expect(article.html).toContain('target="_blank"');
  });

  it('rejects pages without enough article text', () => {
    document.body.innerHTML = '<main><p>Too short.</p></main>';
    expect(() => extractArticleFromPage()).toThrow(/enough article text/);
  });
});
