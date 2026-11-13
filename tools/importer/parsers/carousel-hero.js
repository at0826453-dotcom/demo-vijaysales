/* eslint-disable */
/* global WebImporter */

/**
 * Parser for carousel-hero (home page banner swiper, .home-swipercarousel).
 * One row per slide: cell 1 = desktop image (+ optional mobile image),
 * cell 2 = slide link. Swiper loop clones are skipped.
 */
export default function parse(element, { document, params }) {
  const cells = [];

  const slides = [...element.querySelectorAll('.swiper-slide')]
    .filter((s) => !s.classList.contains('swiper-slide-duplicate'));

  slides.forEach((slide) => {
    const desktop = slide.querySelector('.cmp-teaser__image img, img.cmp-image__image');
    const mobile = slide.querySelector('.cmp-teaser__image--mobile img, img.cmp-image__mobile-image');
    const imageCell = [];
    if (desktop) imageCell.push(desktop);
    if (mobile && mobile !== desktop) imageCell.push(mobile);
    if (!imageCell.length) return;

    const linkEl = slide.querySelector('.cmp-teaser__images a[href], .cmp-teaser__content a[href], a[href]');
    const contentCell = [];
    if (linkEl) {
      const href = linkEl.getAttribute('href');
      const a = document.createElement('a');
      a.href = href;
      // Source alt texts are often copy-pasted ("AC banner" on a laptop slide),
      // so the link text uses the link title when present, else the URL.
      a.textContent = (linkEl.getAttribute('title') || '').trim() || href;
      contentCell.push(a);
    }
    cells.push([imageCell, contentCell]);
  });

  if (!cells.length) return;
  const block = WebImporter.Blocks.createBlock(document, { name: 'carousel-hero', cells });
  element.replaceWith(block);
}
