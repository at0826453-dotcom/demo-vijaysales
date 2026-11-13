/* eslint-disable */
/* global WebImporter */

/**
 * Parser for cards-category (.quicklinks-wrp category quick links).
 * One row per category: cell 1 = category image, cell 2 = label linked to
 * the listing page.
 */
export default function parse(element, { document, params }) {
  const cells = [];

  let items = [...element.querySelectorAll('.teaser .cmp-teaser')];
  if (!items.length) items = [...element.querySelectorAll('.cmp-teaser')];

  items.forEach((item) => {
    const img = item.querySelector('.cmp-teaser__image img, img.cmp-image__image');
    const titleEl = item.querySelector('.cmp-teaser__title');
    const linkEl = item.querySelector('a.cmp-teaser__link[href], a[href]');
    const label = titleEl ? titleEl.textContent.replace(/\s+/g, ' ').trim() : '';
    if (!img && !label) return;

    const textCell = [];
    if (label || linkEl) {
      const p = document.createElement('p');
      if (linkEl) {
        const a = document.createElement('a');
        a.href = linkEl.getAttribute('href');
        a.textContent = label || (img && img.getAttribute('alt')) || linkEl.getAttribute('href');
        p.append(a);
      } else {
        p.textContent = label;
      }
      textCell.push(p);
    }

    cells.push([img ? [img] : '', textCell]);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-category', cells });
  element.replaceWith(block);
}
