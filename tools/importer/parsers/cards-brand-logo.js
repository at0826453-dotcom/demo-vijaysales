/* eslint-disable */
/* global WebImporter */

/**
 * Parser for cards-brand-logo (.brands-imgs brand logo grid).
 * One row per brand: cell 1 = logo image, cell 2 = link to the brand page
 * (URL-text links are folded into the logo by the block).
 */
export default function parse(element, { document, params }) {
  const cells = [];

  let items = [...element.querySelectorAll('.image .cmp-image')];
  if (!items.length) items = [...element.querySelectorAll('.cmp-image')];

  items.forEach((item) => {
    const img = item.querySelector('img');
    if (!img || !img.getAttribute('src')) return;
    const linkEl = item.querySelector('a[href]');
    const linkCell = [];
    if (linkEl) {
      const a = document.createElement('a');
      a.href = linkEl.getAttribute('href');
      a.textContent = linkEl.getAttribute('href');
      linkCell.push(a);
    }
    cells.push([[img], linkCell]);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-brand-logo', cells });
  element.replaceWith(block);
}
