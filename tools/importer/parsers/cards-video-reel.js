/* eslint-disable */
/* global WebImporter */

/**
 * Parser for cards-video-reel (.reels shoppable video shorts).
 * The reels are injected client-side by a third-party widget, so the captured
 * .reels element is usually an empty mount point. When thumbnails/links are
 * present, one row per video: cell 1 = thumbnail, cell 2 = video link and an
 * optional caption / view count. When nothing is authorable, no block is
 * created and the empty mount point is removed.
 */
export default function parse(element, { document, params }) {
  const cells = [];
  const seen = new Set();

  // candidate reel items: anything holding a thumbnail image or a video poster
  const thumbs = [...element.querySelectorAll('img[src], video[poster]')];

  thumbs.forEach((thumb) => {
    const item = thumb.closest('li, a[href], [class*="item"], [class*="card"], [class*="reel"]:not(.reels)')
      || thumb.parentElement;
    if (!item || seen.has(item)) return;
    seen.add(item);

    let img = thumb;
    if (thumb.tagName === 'VIDEO') {
      img = document.createElement('img');
      img.src = thumb.getAttribute('poster');
    }

    const linkEl = item.matches('a[href]') ? item : item.querySelector('a[href]');
    const videoEl = item.querySelector('video source[src], video[src]');
    const href = linkEl ? linkEl.getAttribute('href')
      : (videoEl ? videoEl.getAttribute('src') : '');

    const textCell = [];
    if (href) {
      const p = document.createElement('p');
      const a = document.createElement('a');
      a.href = href;
      a.textContent = (linkEl && (linkEl.getAttribute('title') || linkEl.textContent.trim())) || href;
      p.append(a);
      textCell.push(p);
    }
    const caption = [...item.querySelectorAll('p, span, h3, h4, [class*="title"], [class*="view"]')]
      .map((el) => el.textContent.replace(/\s+/g, ' ').trim())
      .filter((t, i, arr) => t && arr.indexOf(t) === i)
      .filter((t) => !linkEl || t !== linkEl.textContent.trim());
    caption.slice(0, 2).forEach((t) => {
      const p = document.createElement('p');
      p.textContent = t;
      textCell.push(p);
    });

    cells.push([[img], textCell]);
  });

  if (!cells.length) {
    // nothing to author (widget not rendered in the capture)
    element.remove();
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-video-reel', cells });
  element.replaceWith(block);
}
