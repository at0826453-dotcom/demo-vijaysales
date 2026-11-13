import { createOptimizedPicture } from '../../scripts/aem.js';

function optimizeImages(root) {
  root.querySelectorAll('picture > img').forEach((img) => {
    const url = new URL(img.src, window.location.href);
    if (url.origin !== window.location.origin || /\.svg$/i.test(url.pathname)) return;
    img.closest('picture').replaceWith(createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]));
  });
}

/**
 * One row of differently designed panels side by side.
 * Each cell becomes a panel; pictures that sit alone in a paragraph are tagged as panel media,
 * and a trailing link-only paragraph is tagged as the panel CTA.
 */
export default function decorate(block) {
  optimizeImages(block);
  const firstRow = block.firstElementChild;
  const cols = firstRow ? [...firstRow.children] : [];
  block.classList.add(`columns-feature-panel-${cols.length}-cols`);

  [...block.children].forEach((row) => {
    row.classList.add('columns-feature-panel-row');
    [...row.children].forEach((col, idx) => {
      if (!col.textContent.trim() && !col.querySelector('picture')) {
        col.remove();
        return;
      }
      col.classList.add('columns-feature-panel-panel', `columns-feature-panel-panel-${idx + 1}`);
      if (col.querySelector('picture') && !col.textContent.trim()) {
        col.classList.add('columns-feature-panel-img-col');
        return;
      }
      col.querySelectorAll('picture').forEach((pic) => {
        const p = pic.closest('p');
        if (p && !p.textContent.trim()) p.classList.add('columns-feature-panel-media');
      });
      const paras = [...col.querySelectorAll(':scope > p')];
      paras.forEach((p) => {
        const links = p.querySelectorAll('a[href]');
        if (links.length && p.textContent.trim() === [...links].map((a) => a.textContent).join('').trim()) {
          p.classList.add('columns-feature-panel-cta');
        }
      });
    });
  });
}
