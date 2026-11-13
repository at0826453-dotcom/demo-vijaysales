import { createOptimizedPicture } from '../../scripts/aem.js';

function optimizeImages(root) {
  root.querySelectorAll('picture > img').forEach((img) => {
    const url = new URL(img.src, window.location.href);
    if (url.origin !== window.location.origin || /\.svg$/i.test(url.pathname)) return;
    img.closest('picture').replaceWith(createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]));
  });
}

/**
 * Intro | image | numbered steps.
 * The picture-only cell becomes the image card; a cell holding an ordered list
 * (or several headings) becomes the steps panel, each step tagged with its number.
 */
export default function decorate(block) {
  optimizeImages(block);
  const firstRow = block.firstElementChild;
  const cols = firstRow ? [...firstRow.children] : [];
  block.classList.add(`columns-eco-steps-${cols.length}-cols`);

  [...block.children].forEach((row) => {
    row.classList.add('columns-eco-steps-row');
    [...row.children].forEach((col) => {
      if (!col.textContent.trim() && !col.querySelector('picture')) {
        col.remove();
        return;
      }
      if (col.querySelector('picture') && !col.textContent.trim()) {
        col.classList.add('columns-eco-steps-img-col');
        return;
      }
      const list = col.querySelector(':scope > ol, :scope > ul');
      const headings = col.querySelectorAll(':scope > h2, :scope > h3, :scope > h4, :scope > h5, :scope > h6');
      if (list) {
        col.classList.add('columns-eco-steps-steps-col');
        list.classList.add('columns-eco-steps-steps');
        [...list.children].forEach((li, i) => {
          li.classList.add('columns-eco-steps-step');
          li.dataset.step = String(i + 1).padStart(2, '0');
        });
      } else if (headings.length > 1) {
        col.classList.add('columns-eco-steps-steps-col');
        headings.forEach((h, i) => {
          h.classList.add('columns-eco-steps-step-title');
          h.dataset.step = String(i + 1).padStart(2, '0');
        });
      } else {
        col.classList.add('columns-eco-steps-intro-col');
      }
    });
  });
}
