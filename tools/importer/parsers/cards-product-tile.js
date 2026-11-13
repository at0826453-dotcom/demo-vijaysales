/* eslint-disable */
/* global WebImporter */

/**
 * Parser for cards-product-tile (large grey product tiles beside an intro:
 * .latestProductsWrap-rightContent / .superOffersWrap-rightContent
 * .customproductcarousel).
 *
 * One row per product: cell 1 = product image; cell 2 = product name link,
 * rating, price, MRP (struck with del), discount, then badges as paragraphs.
 *
 * Only representative content is authored: the cards visible on load
 * (first MAX_CARDS per list), not every lazily scrolled item.
 */
const MAX_CARDS = 8;

export default function parse(element, { document, params }) {
  const clean = (t) => (t || '').replace(/ /g, ' ').replace(/\s+/g, ' ').trim();
  const price = (t) => clean(t).replace(/₹\s+/g, '₹');
  const para = (content) => {
    const p = document.createElement('p');
    if (typeof content === 'string') p.textContent = content;
    else p.append(...content);
    return p;
  };

  // Product images are lazy-loaded (lozad): unloaded ones carry a blank.png
  // placeholder in src and the real URL in a data attribute. Resolve the real
  // URL, fall back to an already-loaded copy of the same product image
  // elsewhere on the page, and drop placeholders that cannot be resolved.
  const isPlaceholder = (src) => !src || /\/blank\.(png|gif)|^data:/i.test(src);
  const resolveImage = (img) => {
    if (!img) return null;
    const lazy = ['data-src', 'data-lazy', 'data-original', 'data-lazy-src']
      .map((a) => img.getAttribute(a)).find((v) => v && !isPlaceholder(v));
    if (lazy) img.setAttribute('src', lazy);
    if (!isPlaceholder(img.getAttribute('src'))) return img;
    const alt = (img.getAttribute('alt') || '').trim();
    const twin = alt && [...document.querySelectorAll('img.product__image')]
      .find((i) => i !== img && (i.getAttribute('alt') || '').trim() === alt
        && !isPlaceholder(i.getAttribute('src')));
    if (twin) {
      img.setAttribute('src', twin.getAttribute('src'));
      return img;
    }
    return null;
  };

  // cards in document order (scoped per .product__card), de-duplicated by product URL
  const cards = [...element.querySelectorAll('.product__card')];
  const seen = new Set();
  const cells = [];

  cards.forEach((card) => {
    if (cells.length >= MAX_CARDS) return;

    const rawImg = card.querySelector('.product__card__image img, img.product__image');
    const img = resolveImage(rawImg);
    const titleLink = card.querySelector('.product__card-title a[href]');
    const wrapLink = card.querySelector('a.product__card-content[href]');
    const href = (titleLink || wrapLink)?.getAttribute('href') || '';
    const nameEl = card.querySelector('.product__card-title a span, .product__card-title .product-name, .product-name');
    const name = clean(nameEl?.textContent)
      || clean(titleLink?.textContent)
      || clean(wrapLink?.getAttribute('title'))
      || clean(rawImg?.getAttribute('alt'));
    if (!name && !img) return;
    const key = href || name;
    if (seen.has(key)) return;
    seen.add(key);

    const body = [];

    if (name) {
      if (href) {
        const a = document.createElement('a');
        a.href = href;
        a.textContent = name;
        body.push(para([a]));
      } else {
        body.push(para(name));
      }
    }

    const rating = clean(card.querySelector('.product-reviews')?.textContent);
    if (rating && /\d/.test(rating)) body.push(para(rating));

    const finalPrice = price(card.querySelector('.discountedPrice')?.textContent);
    if (finalPrice) body.push(para(finalPrice));
    const mrp = price(card.querySelector('.originalPrice .price')?.textContent);
    if (mrp) {
      const del = document.createElement('del');
      del.textContent = mrp;
      body.push(para([document.createTextNode('MRP '), del]));
    }
    const discount = clean(card.querySelector('.discountPercentage')?.textContent);
    if (discount) body.push(para(discount));

    card.querySelectorAll('.product-tag__inner').forEach((tag) => {
      const t = clean(tag.textContent);
      if (t) body.push(para(t));
    });

    cells.push([img ? [img] : '', body]);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-product-tile', cells });
  element.replaceWith(block);
}
