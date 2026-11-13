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
 * Image-only card: a link whose text is just the URL (or empty) is folded into the image.
 */
function linkCardImage(li) {
  const imageCell = li.querySelector('.cards-video-reel-card-image');
  const link = li.querySelector('.cards-video-reel-card-body a[href], .cards-video-reel-card-image a[href]');
  if (!imageCell || !link || link.closest('.cards-video-reel-card-image')) return;
  const picture = imageCell.querySelector('picture');
  if (!picture) return;
  const a = document.createElement('a');
  a.href = link.href;
  a.className = 'cards-video-reel-card-link';
  const text = link.textContent.trim();
  const body = link.closest('.cards-video-reel-card-body');
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

function addPlayIcon(li) {
  const target = li.querySelector('.cards-video-reel-card-image');
  if (!target) return;
  const icon = document.createElement('span');
  icon.className = 'cards-video-reel-play';
  icon.setAttribute('aria-hidden', 'true');
  target.append(icon);
}

function addScrollControls(block, ul) {
  const nav = document.createElement('div');
  nav.className = 'cards-video-reel-nav';
  nav.innerHTML = `
    <button type="button" class="cards-video-reel-prev" aria-label="Previous"></button>
    <button type="button" class="cards-video-reel-next" aria-label="Next"></button>
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
      div.className = isImage ? 'cards-video-reel-card-image' : 'cards-video-reel-card-body';
    });
    if (!li.children.length) return;
    ul.append(li);
  });
  optimizeImages(ul);
  ul.querySelectorAll(':scope > li').forEach(linkCardImage);
  ul.querySelectorAll(':scope > li').forEach(addPlayIcon);
  block.replaceChildren(ul);
  addScrollControls(block, ul);
}
