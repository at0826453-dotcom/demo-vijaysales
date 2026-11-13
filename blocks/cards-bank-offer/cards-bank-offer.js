import { createOptimizedPicture } from '../../scripts/aem.js';

function optimizeImages(root) {
  root.querySelectorAll('picture > img').forEach((img) => {
    const url = new URL(img.src, window.location.href);
    if (url.origin !== window.location.origin || /\.svg$/i.test(url.pathname)) return;
    img.closest('picture').replaceWith(createOptimizedPicture(img.src, img.alt, false, [{ width: '200' }]));
  });
}

export default function decorate(block) {
  const ul = document.createElement('ul');
  [...block.children].forEach((row) => {
    const li = document.createElement('li');
    while (row.firstElementChild) li.append(row.firstElementChild);
    [...li.children].forEach((div) => {
      const isImage = div.querySelector('picture') && !div.textContent.trim();
      if (!div.textContent.trim() && !div.querySelector('picture, a')) { div.remove(); return; }
      div.className = isImage ? 'cards-bank-offer-card-image' : 'cards-bank-offer-card-body';
    });
    if (!li.children.length) return;
    ul.append(li);
  });
  optimizeImages(ul);
  block.replaceChildren(ul);

  // continuous strip: duplicate the authored items once so the CSS marquee loops seamlessly
  if (ul.children.length > 1 && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    [...ul.children].forEach((li) => {
      const clone = li.cloneNode(true);
      clone.setAttribute('aria-hidden', 'true');
      clone.querySelectorAll('a').forEach((a) => { a.tabIndex = -1; });
      ul.append(clone);
    });
    block.classList.add('cards-bank-offer-animated');
  }
}
