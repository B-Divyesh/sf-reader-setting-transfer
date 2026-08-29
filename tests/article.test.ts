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
      <ul><li>A meaningful list item that belongs to the article.</li></ul>
      <blockquote>A quotation that gives the article useful context.</blockquote>
      <pre><code>const readingCard = { textSize: '120%' };</code></pre>
      <table><thead><tr><th>Setting</th><th>Value</th></tr></thead><tbody><tr><td>Text size</td><td>120%</td></tr></tbody></table>
      <p><a href="javascript:alert('bad')">unsafe link</a></p></article>`;
    window.history.replaceState({}, '', '/article');
  });

  it('@claim:article-structure keeps semantic content and removes active or distracting elements', () => {
    const article = extractArticleFromPage();
    expect(article.title).toBe('Readable title');
    expect(article.byline).toBe('Ada Reader');
    expect(article.html).toContain('<h2>Readable title</h2>');
    expect(article.html).toContain('<ul>');
    expect(article.html).toContain('<blockquote>');
    expect(article.html).toContain('<pre><code>const readingCard');
    expect(article.html).toContain('<table>');
    expect(article.html).not.toContain('<script');
    expect(article.html).not.toContain('javascript:');
    expect(article.html).not.toContain('Advertisement');
    expect(article.html).toContain('target="_blank"');
  });

  it('rejects pages without enough article text', () => {
    document.body.innerHTML = '<main><p>Too short.</p></main>';
    expect(() => extractArticleFromPage()).toThrow(/enough article text/);
  });

  it('refuses a visible gated page and does not restyle source web apps', () => {
    document.body.innerHTML = `<main id="app"><h1>Account dashboard</h1>
      <p>${'Private account content stays inside this application. '.repeat(8)}</p></main>
      <div class="paywall-overlay" role="dialog">Subscribe to continue reading</div>`;
    const gatedSource = document.documentElement.outerHTML;

    expect(() => extractArticleFromPage()).toThrow(/restrict access/);
    expect(document.documentElement.outerHTML).toBe(gatedSource);

    document.body.innerHTML = `<main id="app"><h1>Public application help</h1>
      <p>${'This public help article explains the application without changing its interface. '.repeat(8)}</p></main>
      <div class="paywall-notice" hidden>Old subscription notice</div>`;
    const publicSource = document.documentElement.outerHTML;
    expect(extractArticleFromPage().html).toContain('public help article');
    expect(document.documentElement.outerHTML).toBe(publicSource);
  });

  it('@claim:access-boundaries refuses a visible paywall regardless of hidden marker order', () => {
    const publicArticle = `<main><article><h1>Public article</h1>
      <p>${'This page has enough public article text to reproduce the access-boundary check with the same long article shape used by the browser verifier. '.repeat(8)}</p>
    </article></main>`;
    const hiddenMarker = '<div class="paywall-overlay" hidden>Old subscription notice</div>';
    const visibleMarker = '<div class="paywall-overlay">Subscribe to continue reading</div>';

    for (const markers of [
      `${hiddenMarker}${visibleMarker}`,
      `${visibleMarker}${hiddenMarker}`
    ]) {
      document.body.innerHTML = `${publicArticle}${markers}`;
      const sourceBefore = document.documentElement.outerHTML;
      expect(() => extractArticleFromPage()).toThrow(/restrict access/);
      expect(document.documentElement.outerHTML).toBe(sourceBefore);
    }
  });

  it('allows a public article when a paywall remnant or its ancestor is hidden', () => {
    const publicArticle = `<main><article><h1>Public article</h1>
      <p>${'This public article remains available without a subscription and has enough text for a reader to use it. '.repeat(5)}</p>
    </article></main>`;

    for (const hiddenRemnant of [
      '<div class="paywall-overlay" style="display: none">Old subscription notice</div>',
      '<div style="display: none"><div class="paywall-overlay">Old subscription notice</div></div>',
      '<div hidden><div class="paywall-overlay">Old subscription notice</div></div>',
      '<div style="visibility: hidden"><div class="paywall-overlay">Old subscription notice</div></div>'
    ]) {
      document.body.innerHTML = `${publicArticle}${hiddenRemnant}`;
      const sourceBefore = document.documentElement.outerHTML;
      expect(extractArticleFromPage().title).toBe('Public article');
      expect(document.documentElement.outerHTML).toBe(sourceBefore);
    }
  });
});
