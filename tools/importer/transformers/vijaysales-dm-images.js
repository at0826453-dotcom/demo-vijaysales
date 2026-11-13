/* eslint-disable */
/* global WebImporter */

/**
 * Vijay Sales Dynamic Media (Scene7) image transformer.
 *
 * afterTransform only (parsers need the original <img> nodes). Rewrites
 * Scene7 /is/image/ images (s7ap1.scene7.com/is/image/vsproddmfinal/...) into
 * anchors that survive the markdown round-trip; the scripts.js DM auto-block
 * rebuilds <picture> elements from them at render time.
 *
 *  - Unlinked image:  <a href="DM-URL">alt</a>
 *  - Linked image:    <a href="nav-url" title="DM-URL">alt</a>
 *    (anchors holding only images, e.g. desktop + mobile banner pairs, are
 *    split into one anchor per image, all keeping the navigation href)
 *  - Anchors mixing images with real text are skipped with a warning.
 *
 * Empty alt becomes the visible sentinel "Image without alt text", which the
 * auto-block translates back to alt="".
 */

const EMPTY_ALT_SENTINEL = 'Image without alt text';

function detectDynamicMediaUrl(urlStr) {
  if (!urlStr || !/^(https?:\/\/|\/\/)/i.test(urlStr)) return false;
  let u;
  try { u = new URL(urlStr, 'https://x/'); } catch (e) { return false; }
  if (u.pathname.startsWith('/is/image/')) return 'scene7';
  if (/^delivery-p\d+-e\d+\.adobeaemcloud\.com$/.test(u.hostname)
      && u.pathname.startsWith('/adobe/assets/urn:')) {
    return 'dm-openapi';
  }
  return false;
}

function normalize(src) {
  return src.startsWith('//') ? `https:${src}` : src;
}

function altText(img) {
  const alt = (img.getAttribute('alt') || '').trim();
  return alt || EMPTY_ALT_SENTINEL;
}

function hasMeaningfulText(anchor) {
  // Text outside of images (alt text is not part of textContent).
  return anchor.textContent.replace(/\s+/g, '').length > 0;
}

export default function transform(hookName, element, payload) {
  if (hookName !== 'afterTransform') return;
  const doc = element.ownerDocument;

  const processedAnchors = new Set();
  const imgs = [...element.querySelectorAll('img')];

  imgs.forEach((img) => {
    if (!img.isConnected) return;
    const src = img.getAttribute('src') || '';
    if (!detectDynamicMediaUrl(src)) return;

    const anchor = img.closest('a');
    if (!anchor) {
      const a = doc.createElement('a');
      a.setAttribute('href', normalize(src));
      a.textContent = altText(img);
      // Replace the <picture> wrapper too, if present, so no empty shell remains.
      const picture = img.parentElement && img.parentElement.tagName === 'PICTURE'
        ? img.parentElement : null;
      (picture || img).replaceWith(a);
      return;
    }

    if (processedAnchors.has(anchor)) return;
    processedAnchors.add(anchor);

    if (hasMeaningfulText(anchor)) {
      console.warn(`[vijaysales-dm-images] Skipping mixed-content anchor with DM image: ${src}`);
      return;
    }

    const href = anchor.getAttribute('href') || '';
    const anchorImgs = [...anchor.querySelectorAll('img')];
    const replacements = anchorImgs.map((ai) => {
      const aiSrc = ai.getAttribute('src') || '';
      const a = doc.createElement('a');
      if (href) a.setAttribute('href', href);
      if (detectDynamicMediaUrl(aiSrc)) {
        if (!href) a.setAttribute('href', normalize(aiSrc));
        else a.setAttribute('title', normalize(aiSrc));
        a.textContent = altText(ai);
      } else {
        a.append(ai.cloneNode(true));
      }
      return a;
    });

    if (replacements.length === 1) {
      // Sole image: keep the original anchor element, swap its content.
      const r = replacements[0];
      if (r.hasAttribute('title')) anchor.setAttribute('title', r.getAttribute('title'));
      if (!href && r.getAttribute('href')) anchor.setAttribute('href', r.getAttribute('href'));
      anchor.replaceChildren(...r.childNodes);
    } else {
      anchor.replaceWith(...replacements);
    }
  });
}
