import { createOptimizedPicture } from '../../scripts/aem.js';

function optimizeImages(root) {
  root.querySelectorAll('picture > img').forEach((img) => {
    const url = new URL(img.src, window.location.href);
    if (url.origin !== window.location.origin || /\.svg$/i.test(url.pathname)) return;
    img.closest('picture').replaceWith(createOptimizedPicture(img.src, img.alt, false, [{ width: '500' }]));
  });
}

/**
 * Makes the card image clickable using the card's first link.
 * The text link stays; the image gets a duplicate link hidden from assistive tech.
 */
function linkCardImage(li) {
  const imageCell = li.querySelector('.cards-product-tile-card-image');
  const link = li.querySelector('.cards-product-tile-card-body a[href], .cards-product-tile-card-image a[href]');
  if (!imageCell || !link || link.closest('.cards-product-tile-card-image')) return;
  const picture = imageCell.querySelector('picture');
  if (!picture) return;
  const a = document.createElement('a');
  a.href = link.href;
  a.className = 'cards-product-tile-card-link';
  const text = link.textContent.trim();
  const body = link.closest('.cards-product-tile-card-body');
  a.tabIndex = -1;
  a.setAttribute('aria-hidden', 'true');
  if (!text) body?.remove();
  picture.replaceWith(a);
  a.append(picture);
}

/** Tags common product-card lines so they can be styled without changing authoring. */
function tagProductLines(body) {
  body.querySelectorAll('p, li').forEach((el) => {
    const t = el.textContent.trim();
    if (!t) return;
    if (el.querySelector('del, s')) el.classList.add('cards-product-tile-price');
    else if (/^(₹|rs\.?|inr)/i.test(t)) el.classList.add('cards-product-tile-price');
    else if (/%\s*off/i.test(t)) el.classList.add('cards-product-tile-discount');
    else if (/^(mrp)/i.test(t)) el.classList.add('cards-product-tile-mrp');
    else if (/^\(?\d(\.\d)?\)?\s*(★|\/\s*5|\(\d+\))/.test(t) || /^[★☆]+/.test(t)) el.classList.add('cards-product-tile-rating');
  });
  const title = body.querySelector('h1, h2, h3, h4, h5, h6, a');
  title?.closest('p, h1, h2, h3, h4, h5, h6')?.classList.add('cards-product-tile-title');
}

function addScrollControls(block, ul) {
  const nav = document.createElement('div');
  nav.className = 'cards-product-tile-nav';
  nav.innerHTML = `
    <button type="button" class="cards-product-tile-prev" aria-label="Previous"></button>
    <button type="button" class="cards-product-tile-next" aria-label="Next"></button>
  `;
  const [prev, next] = nav.querySelectorAll('button');
  const step = () => (ul.firstElementChild?.getBoundingClientRect().width || ul.clientWidth) + 16;
  const update = () => {
    prev.disabled = ul.scrollLeft <= 1;
    next.disabled = ul.scrollLeft + ul.clientWidth >= ul.scrollWidth - 1;
    nav.hidden = ul.scrollWidth <= ul.clientWidth + 1;
  };
  prev.addEventListener('click', () => ul.scrollBy({ left: -step(), behavior: 'smooth' }));
  next.addEventListener('click', () => ul.scrollBy({ left: step(), behavior: 'smooth' }));
  ul.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', update);
  block.append(nav);
  requestAnimationFrame(update);
}

export default function decorate(block) {
  const ul = document.createElement('ul');
  [...block.children].forEach((row) => {
    const li = document.createElement('li');
    while (row.firstElementChild) li.append(row.firstElementChild);
    [...li.children].forEach((div) => {
      const isImage = div.querySelector('picture') && !div.textContent.trim();
      if (!div.textContent.trim() && !div.querySelector('picture, a')) { div.remove(); return; }
      div.className = isImage ? 'cards-product-tile-card-image' : 'cards-product-tile-card-body';
    });
    if (!li.children.length) return;
    const body = li.querySelector('.cards-product-tile-card-body');
    if (body) tagProductLines(body);
    ul.append(li);
  });
  optimizeImages(ul);
  ul.querySelectorAll(':scope > li').forEach(linkCardImage);
  block.replaceChildren(ul);
  addScrollControls(block, ul);
}
