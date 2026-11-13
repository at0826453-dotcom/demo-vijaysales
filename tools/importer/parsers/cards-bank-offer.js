/* eslint-disable */
/* global WebImporter */

/**
 * Parser for cards-bank-offer (.home-bank-container swiper of bank offers).
 * One row per unique offer: cell 1 = bank logo, cell 2 = offer text + T&C note.
 * Swiper loop clones are skipped (the block loops itself); offers are also
 * de-duplicated by text in case clones lost their duplicate class.
 */
export default function parse(element, { document, params }) {
  const cells = [];
  const seen = new Set();

  const slides = [...element.querySelectorAll('.swiper-slide')]
    .filter((s) => !s.classList.contains('swiper-slide-duplicate'));
  const items = slides.length ? slides : [...element.querySelectorAll('.cmp-teaser')];

  items.forEach((item) => {
    const img = item.querySelector('.cmp-teaser__image img, img');
    const offerEl = item.querySelector('.cmp-teaser__pretitle');
    const noteEl = item.querySelector('.cmp-teaser__title');
    const descEl = item.querySelector('.cmp-teaser__description');

    const offer = offerEl ? offerEl.textContent.replace(/\s+/g, ' ').trim() : '';
    const note = noteEl ? noteEl.textContent.replace(/\s+/g, ' ').trim() : '';
    const key = `${offer}|${img ? img.getAttribute('src') : ''}`;
    if (!offer && !img) return;
    if (seen.has(key)) return;
    seen.add(key);

    const textCell = [];
    if (offer) {
      const p = document.createElement('p');
      p.textContent = offer;
      textCell.push(p);
    }
    if (descEl && descEl.textContent.trim()) {
      const p = document.createElement('p');
      p.textContent = descEl.textContent.replace(/\s+/g, ' ').trim();
      textCell.push(p);
    }
    if (note) {
      // keep the T&C note out of headings
      const p = document.createElement('p');
      p.textContent = note;
      textCell.push(p);
    }
    const link = item.querySelector('a[href]');
    const href = link ? link.getAttribute('href') : '';
    if (href && href !== '#' && !href.startsWith('javascript')) {
      const p = document.createElement('p');
      const a = document.createElement('a');
      a.href = href;
      a.textContent = href;
      p.append(a);
      textCell.push(p);
    }

    cells.push([img ? [img] : '', textCell]);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-bank-offer', cells });
  element.replaceWith(block);
}
