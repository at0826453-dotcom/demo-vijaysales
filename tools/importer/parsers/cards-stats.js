/* eslint-disable */
/* global WebImporter */

/**
 * Parser for cards-stats (.counter-wrap counters).
 * One row per stat, one cell: bold value paragraph, then the caption
 * paragraph (line breaks preserved). Values are kept out of headings.
 */
export default function parse(element, { document, params }) {
  const cells = [];
  const clean = (t) => (t || '').replace(/ /g, ' ').replace(/\s+/g, ' ').trim();

  let items = [...element.querySelectorAll('.teaser .cmp-teaser')];
  if (!items.length) items = [...element.querySelectorAll('.cmp-teaser')];

  items.forEach((item) => {
    const titleEl = item.querySelector('.cmp-teaser__title');
    const descEl = item.querySelector('.cmp-teaser__description');
    const value = titleEl ? clean(titleEl.textContent) : '';
    const content = [];

    if (value) {
      const p = document.createElement('p');
      const strong = document.createElement('strong');
      strong.textContent = value;
      p.append(strong);
      content.push(p);
    }

    if (descEl) {
      const paras = [...descEl.querySelectorAll('p')];
      (paras.length ? paras : [descEl]).forEach((src) => {
        if (!clean(src.textContent)) return;
        // split on <br> and rebuild the caption lines without stray whitespace
        const lines = [''];
        src.childNodes.forEach((n) => {
          if (n.nodeType === 1 && n.tagName === 'BR') lines.push('');
          else lines[lines.length - 1] += n.textContent;
        });
        const p = document.createElement('p');
        lines.map(clean).filter(Boolean).forEach((line, i) => {
          if (i) p.append(document.createElement('br'));
          p.append(document.createTextNode(line));
        });
        content.push(p);
      });
    }

    if (content.length) cells.push([content]);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-stats', cells });
  element.replaceWith(block);
}
