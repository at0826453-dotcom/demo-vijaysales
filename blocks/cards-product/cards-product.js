import { createOptimizedPicture } from '../../scripts/aem.js';

function optimizeImages(root) {
  root.querySelectorAll('picture > img').forEach((img) => {
    const url = new URL(img.src, window.location.href);
    if (url.origin !== window.location.origin || /\.svg$/i.test(url.pathname)) return;
    img.closest('picture').replaceWith(createOptimizedPicture(img.src, img.alt, false, [{ width: '400' }]));
  });
}

/**
 * Makes the card image clickable using the card's first link.
 * The text link stays; the image gets a duplicate link hidden from assistive tech.
 */
function linkCardImage(li) {
  const imageCell = li.querySelector('.cards-product-card-image');
  const link = li.querySelector('.cards-product-card-body a[href], .cards-product-card-image a[href]');
  if (!imageCell || !link || link.closest('.cards-product-card-image')) return;
  const picture = imageCell.querySelector('picture');
  if (!picture) return;
  const a = document.createElement('a');
  a.href = link.href;
  a.className = 'cards-product-card-link';
  const text = link.textContent.trim();
  const body = link.closest('.cards-product-card-body');
  a.tabIndex = -1;
  a.setAttribute('aria-hidden', 'true');
  if (!text) body?.remove();
  picture.replaceWith(a);
  a.append(picture);
}

/**
 * Tags common product-card lines so they can be styled without changing authoring.
 * Short text lines authored before the product name are badges; price, MRP and
 * discount lines after it are grouped into one row.
 */
function tagProductLines(body) {
  const title = body.querySelector('h1, h2, h3, h4, h5, h6, a')?.closest('p, h1, h2, h3, h4, h5, h6');
  title?.classList.add('cards-product-title');
  const lines = [...body.querySelectorAll(':scope > p, :scope > li, :scope > ul > li')];
  const titleIndex = title ? lines.indexOf(title) : -1;
  const badges = [];
  lines.forEach((el, i) => {
    const t = el.textContent.trim();
    if (!t || el === title) return;
    if (i < titleIndex && !el.querySelector('a, picture')) badges.push(el);
    else if (el.querySelector('del, s') || /^mrp/i.test(t)) el.classList.add('cards-product-mrp');
    else if (/^(₹|rs\.?\s|inr)\s*[\d,]+(\.\d+)?$/i.test(t)) el.classList.add('cards-product-price');
    else if (/^\d+(\.\d+)?\s*%\s*off$/i.test(t)) el.classList.add('cards-product-discount');
    else if (/^\(?\d(\.\d)?\)?\s*(★|\/\s*5|\(\d+\))/.test(t) || /^[★☆]+/.test(t)) el.classList.add('cards-product-rating');
    else if (/deals?\s+available|offers?\s+available/i.test(t)) el.classList.add('cards-product-offer');
    else if (/deliver|pickup|shipping/i.test(t)) el.classList.add('cards-product-delivery');
  });

  if (badges.length) {
    const wrap = document.createElement('div');
    wrap.className = 'cards-product-badges';
    badges.forEach((el, i) => {
      el.classList.add('cards-product-badge');
      if (i === 0 && !/bought|seller/i.test(el.textContent)) el.classList.add('cards-product-badge-filled');
      wrap.append(el);
    });
    body.prepend(wrap);
  }

  const priceLines = body.querySelectorAll(':scope > .cards-product-price, :scope > .cards-product-mrp, :scope > .cards-product-discount');
  if (priceLines.length) {
    const pricing = document.createElement('div');
    pricing.className = 'cards-product-pricing';
    priceLines[0].before(pricing);
    pricing.append(...priceLines);
  }
}

function addScrollControls(block, ul) {
  const nav = document.createElement('div');
  nav.className = 'cards-product-nav';
  nav.innerHTML = `
    <button type="button" class="cards-product-prev" aria-label="Previous"></button>
    <button type="button" class="cards-product-next" aria-label="Next"></button>
  `;
  const [prev, next] = nav.querySelectorAll('button');
  const step = () => (ul.firstElementChild?.getBoundingClientRect().width || ul.clientWidth)
    + (parseFloat(getComputedStyle(ul).columnGap) || 0);
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
      div.className = isImage ? 'cards-product-card-image' : 'cards-product-card-body';
    });
    if (!li.children.length) return;
    const body = li.querySelector('.cards-product-card-body');
    if (body) tagProductLines(body);
    ul.append(li);
  });
  optimizeImages(ul);
  ul.querySelectorAll(':scope > li').forEach(linkCardImage);
  block.replaceChildren(ul);
  addScrollControls(block, ul);
}
