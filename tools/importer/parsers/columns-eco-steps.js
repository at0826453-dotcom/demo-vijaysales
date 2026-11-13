/* eslint-disable */
/* global WebImporter */

/**
 * Parser for columns-eco-steps (.sustanability-wrap e-waste band).
 * One row x three cells: (1) heading + Know More link, (2) image,
 * (3) numbered list of steps (bold step title + text). The source step
 * numbers (.cmp-teaser__pretitle) are dropped; the <ol> numbers the steps.
 */
export default function parse(element, { document, params }) {
  const clean = (t) => (t || '').replace(/ /g, ' ').replace(/\s+/g, ' ').trim();

  // 1. Intro
  const col1 = [];
  const intro = element.querySelector('.green-left .cmp-teaser');
  if (intro) {
    const title = intro.querySelector('.cmp-teaser__title');
    if (title && clean(title.textContent)) {
      const h = document.createElement('h2');
      h.textContent = clean(title.textContent);
      col1.push(h);
    }
    const desc = intro.querySelector('.cmp-teaser__description');
    if (desc && clean(desc.textContent)) {
      const p = document.createElement('p');
      p.textContent = clean(desc.textContent);
      col1.push(p);
    }
    intro.querySelectorAll('.cmp-teaser__action-link[href]').forEach((cta) => {
      const p = document.createElement('p');
      const a = document.createElement('a');
      a.href = cta.getAttribute('href');
      a.textContent = clean(cta.textContent) || 'Know More';
      p.append(a);
      col1.push(p);
    });
  }

  // 2. Image (direct image component of the band, not inside the step teasers)
  const col2 = [];
  const img = element.querySelector('.image .cmp-image img')
    || [...element.querySelectorAll('img')].find((i) => !i.closest('.cmp-teaser'));
  if (img) col2.push(img);

  // 3. Steps
  const col3 = [];
  const steps = [...element.querySelectorAll('.yellow-right .cmp-teaser')];
  if (steps.length) {
    const ol = document.createElement('ol');
    steps.forEach((step) => {
      const title = clean(step.querySelector('.cmp-teaser__title')?.textContent);
      const desc = step.querySelector('.cmp-teaser__description');
      const text = desc ? [...desc.querySelectorAll('p')].map((p) => clean(p.textContent)).filter(Boolean).join(' ')
        || clean(desc.textContent) : '';
      if (!title && !text) return;
      const li = document.createElement('li');
      if (title) {
        const strong = document.createElement('strong');
        strong.textContent = title;
        li.append(strong);
      }
      if (title && text) li.append(document.createElement('br'));
      if (text) li.append(document.createTextNode(text));
      ol.append(li);
    });
    if (ol.children.length) col3.push(ol);
  }

  const cells = [[col1, col2, col3]];
  const block = WebImporter.Blocks.createBlock(document, { name: 'columns-eco-steps', cells });
  element.replaceWith(block);
}
