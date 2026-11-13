/* eslint-disable */
/* global WebImporter */

/**
 * Parser for cards-promo-tile (.productCardWrp > .cmp-container promo tiles).
 * One row per tile: cell 1 = promo image, cell 2 = destination link when the
 * captured DOM carries one (the live .containerLink wrappers are wired by JS,
 * so most captured tiles are image-only and get an empty second cell).
 */
export default function parse(element, { document, params }) {
  const cells = [];

  let tiles = [...element.querySelectorAll('.imageVariation')];
  if (!tiles.length) tiles = [...element.querySelectorAll('.teaser')];

  tiles.forEach((tile) => {
    const img = tile.querySelector('.cmp-teaser__image img, img.cmp-image__image');
    if (!img || !img.getAttribute('src')) return;

    const linkCell = [];
    const linkEl = tile.querySelector('a[href]');
    const href = linkEl ? linkEl.getAttribute('href') : '';
    if (href && href !== '#') {
      const a = document.createElement('a');
      a.href = href;
      a.textContent = href;
      linkCell.push(a);
    }
    cells.push([[img], linkCell]);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-promo-tile', cells });
  element.replaceWith(block);
}
