import { createOptimizedPicture } from '../../scripts/aem.js';

function optimizeImages(root) {
  root.querySelectorAll('picture > img').forEach((img) => {
    const url = new URL(img.src, window.location.href);
    if (url.origin !== window.location.origin || /\.svg$/i.test(url.pathname)) return;
    img.closest('picture').replaceWith(createOptimizedPicture(img.src, img.alt, false, [{ width: '200' }]));
  });
}

/**
 * Makes the card image clickable using the card's first link.
 * Image-only card: a link whose text is just the URL (or empty) is folded into the image.
 */
function linkCardImage(li) {
  const imageCell = li.querySelector('.cards-brand-logo-card-image');
  const link = li.querySelector('.cards-brand-logo-card-body a[href], .cards-brand-logo-card-image a[href]');
  if (!imageCell || !link || link.closest('.cards-brand-logo-card-image')) return;
  const picture = imageCell.querySelector('picture');
  if (!picture) return;
  const a = document.createElement('a');
  a.href = link.href;
  a.className = 'cards-brand-logo-card-link';
  const text = link.textContent.trim();
  const body = link.closest('.cards-brand-logo-card-body');
  const linkOnly = body && body.textContent.trim() === text;
  const isUrlText = !text || text === link.getAttribute('href') || /^(https?:\/\/|\/)/.test(text);
  if (linkOnly && isUrlText) {
    // the link carries no visible label: fold it into the image
    const alt = picture.querySelector('img')?.alt;
    if (alt) a.setAttribute('aria-label', alt);
    body.remove();
  } else {
    a.tabIndex = -1;
    a.setAttribute('aria-hidden', 'true');
  }
  picture.replaceWith(a);
  a.append(picture);
}

export default function decorate(block) {
  const ul = document.createElement('ul');
  [...block.children].forEach((row) => {
    const li = document.createElement('li');
    while (row.firstElementChild) li.append(row.firstElementChild);
    [...li.children].forEach((div) => {
      const isImage = div.querySelector('picture') && !div.textContent.trim();
      if (!div.textContent.trim() && !div.querySelector('picture, a')) { div.remove(); return; }
      div.className = isImage ? 'cards-brand-logo-card-image' : 'cards-brand-logo-card-body';
    });
    if (!li.children.length) return;
    ul.append(li);
  });
  optimizeImages(ul);
  ul.querySelectorAll(':scope > li').forEach(linkCardImage);
  block.replaceChildren(ul);
}
