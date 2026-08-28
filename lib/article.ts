export interface ExtractedArticle {
  title: string;
  byline: string;
  source: string;
  url: string;
  html: string;
  excerpt: string;
  extractedAt: number;
}

/** Runs in the active page. Keep this function self-contained for scripting.executeScript. */
export function extractArticleFromPage(): ExtractedArticle {
  const safeText = (value: string | null | undefined) => (value ?? '').replace(/\s+/g, ' ').trim();
  const title = safeText(
    document.querySelector<HTMLMetaElement>('meta[property="og:title"]')?.content ||
      document.querySelector('h1')?.textContent ||
      document.title
  );
  const byline = safeText(
    document.querySelector<HTMLMetaElement>('meta[name="author"]')?.content ||
      document.querySelector('[rel="author"], .byline, [class*="author"]')?.textContent
  );
  const candidates = Array.from(document.querySelectorAll<HTMLElement>('article, main, [role="main"], .post-content, .article-content'));
  const score = (node: HTMLElement) => {
    const text = safeText(node.innerText || node.textContent);
    return text.length + node.querySelectorAll('p').length * 180 - node.querySelectorAll('nav, aside, form').length * 500;
  };
  const source = candidates.sort((a, b) => score(b) - score(a))[0] ?? document.body;
  const clone = source.cloneNode(true) as HTMLElement;
  clone.querySelectorAll('script, style, iframe, canvas, svg, form, button, input, select, textarea, nav, aside, footer, [role="navigation"], [aria-hidden="true"], .advertisement, .ads, [class*="social"], [class*="share"], [class*="cookie"], [class*="newsletter"]').forEach((node) => node.remove());

  const allowed = new Set(['P', 'H2', 'H3', 'H4', 'H5', 'H6', 'UL', 'OL', 'LI', 'BLOCKQUOTE', 'PRE', 'CODE', 'EM', 'STRONG', 'B', 'I', 'A', 'FIGURE', 'FIGCAPTION', 'HR', 'BR', 'DL', 'DT', 'DD', 'TABLE', 'THEAD', 'TBODY', 'TR', 'TH', 'TD']);
  Array.from(clone.querySelectorAll('*')).forEach((element) => {
    if (element.tagName === 'H1') {
      const heading = document.createElement('h2');
      heading.innerHTML = element.innerHTML;
      element.replaceWith(heading);
      return;
    }
    if (!allowed.has(element.tagName)) {
      element.replaceWith(...Array.from(element.childNodes));
      return;
    }
    const originalHref = element.tagName === 'A' ? element.getAttribute('href') : null;
    Array.from(element.attributes).forEach((attribute) => element.removeAttribute(attribute.name));
    if (element.tagName === 'A' && originalHref) {
      const link = element as HTMLAnchorElement;
      try {
        const original = new URL(originalHref, location.href);
        if (original.protocol === 'http:' || original.protocol === 'https:') {
          link.href = original.href;
          link.target = '_blank';
          link.rel = 'noopener noreferrer';
        }
      } catch {
        link.removeAttribute('href');
      }
    }
  });
  clone.querySelectorAll('p, li, blockquote').forEach((node) => {
    if (!safeText(node.textContent)) node.remove();
  });
  const text = safeText(clone.textContent);
  if (text.length < 280) throw new Error('This page does not contain enough article text to open in the reader.');
  return {
    title: title || 'Untitled article',
    byline,
    source: location.hostname.replace(/^www\./, ''),
    url: location.href,
    html: clone.innerHTML,
    excerpt: `${text.slice(0, 180)}${text.length > 180 ? '…' : ''}`,
    extractedAt: Date.now()
  };
}
