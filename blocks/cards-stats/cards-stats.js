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
      if (!div.textContent.trim() && !div.querySelector('picture')) { div.remove(); return; }
      div.className = isImage ? 'cards-stats-card-image' : 'cards-stats-card-body';
    });
    if (!li.children.length) return;
    // first line of the stat is the value, the rest is its caption
    const body = li.querySelector('.cards-stats-card-body');
    if (body) {
      const lines = [...body.children].filter((el) => el.textContent.trim());
      if (lines.length) lines[0].classList.add('cards-stats-value');
      lines.slice(1).forEach((el) => el.classList.add('cards-stats-caption'));
      if (lines.length === 1) {
        // "175+ Stores" in one paragraph: split a leading number/strong from the caption
        const strong = lines[0].querySelector('strong, b');
        if (strong && strong.textContent.trim() !== lines[0].textContent.trim()) {
          const value = document.createElement('p');
          value.className = 'cards-stats-value';
          value.append(strong);
          lines[0].className = 'cards-stats-caption';
          lines[0].before(value);
        }
      }
    }
    ul.append(li);
  });
  optimizeImages(ul);
  block.replaceChildren(ul);
}
