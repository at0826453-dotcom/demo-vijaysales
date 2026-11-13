/* eslint-disable */
/* global WebImporter */

/**
 * Parser for tabs-product (category tabs with product carousels).
 * Instances: .offerProducts .desktopBg .seasonProductTabs and
 * .exclusiveDealsTabs:has(.cmp-tabs).
 *
 * Rows:
 *  - optional festive band background: one cell with picture(s) only
 *    (desktop, then mobile) - taken from the .desktopBg / .mobileBg band
 *    background when it can be resolved
 *  - one row per tab: label | bulleted list of products (image, linked
 *    name, price lines separated by <br>). Every visible tab label is kept,
 *    even when its panel is empty.
 *  - optional View All row: one cell with only the link
 *
 * Only representative content is authored: the first MAX_CARDS cards per
 * tab, not every lazily scrolled item. Capped at 5 so the homepage stays
 * under the 300-images-per-page upload limit (36 tabs x 5 cards).
 */
const MAX_CARDS = 5;

export default function parse(element, { document, params }) {
  const clean = (t) => (t || '').replace(/ /g, ' ').replace(/\s+/g, ' ').trim();
  const price = (t) => clean(t).replace(/₹\s+/g, '₹');

  // Lazy-loaded (lozad) product images: real URL in data-src, blank.png in src.
  const isPlaceholder = (src) => !src || /\/blank\.(png|gif)|^data:/i.test(src);
  const resolveImage = (img) => {
    if (!img) return null;
    const lazy = ['data-src', 'data-lazy', 'data-original', 'data-lazy-src']
      .map((a) => img.getAttribute(a)).find((v) => v && !isPlaceholder(v));
    if (lazy) img.setAttribute('src', lazy);
    if (!isPlaceholder(img.getAttribute('src'))) return img;
    const alt = (img.getAttribute('alt') || '').trim();
    const twin = alt && [...document.querySelectorAll('img.product__image')]
      .find((i) => i !== img && (i.getAttribute('alt') || '').trim() === alt
        && !isPlaceholder(i.getAttribute('src')));
    if (twin) {
      img.setAttribute('src', twin.getAttribute('src'));
      return img;
    }
    return null;
  };

  const cells = [];

  // 1. festive band background (desktop, then mobile) - optional
  // extract the url(...) value of a CSS background, undoing CSS escapes
  // (the band path contains an apostrophe: .../oct'2026/desktop-background.jpeg,
  // which serialized styles return as "\2f content\2f dam ... oct\27 2026")
  const cssUrl = (value) => {
    const m = (value || '').match(/url\(\s*(["']?)(.*?)\1\s*\)/i);
    if (!m || !m[2]) return '';
    const raw = m[2]
      .replace(/\\([0-9a-f]{1,6})\s?/gi, (s, hex) => String.fromCodePoint(parseInt(hex, 16)))
      .replace(/\\(.)/g, '$1')
      .trim();
    if (!raw || /^data:/i.test(raw)) return '';
    try {
      return new URL(raw, 'https://www.vijaysales.com/').href.replace(/'/g, '%27');
    } catch (e) {
      return '';
    }
  };
  const bgUrl = (el) => {
    if (!el) return '';
    const inline = (el.getAttribute('style') || '').match(/background(?:-image)?\s*:[^;]*url\([^)]*\)/i);
    let bg = inline ? cssUrl(inline[0]) : '';
    if (!bg) {
      try {
        const view = document.defaultView;
        const cs = view && view.getComputedStyle ? view.getComputedStyle(el).backgroundImage : '';
        bg = cssUrl(cs);
      } catch (e) { /* computed styles unavailable */ }
    }
    return bg;
  };
  const band = element.closest('.offerProducts');
  const bgPics = [];
  if (band) {
    const desktopBg = band.querySelector(':scope > .desktopBg') || element.closest('.desktopBg');
    const mobileBg = band.querySelector(':scope > .mobileBg');
    [bgUrl(desktopBg), bgUrl(mobileBg)].forEach((url, idx) => {
      if (!url || bgPics.some((p) => p.getAttribute('src') === url)) return;
      const img = document.createElement('img');
      img.src = url;
      img.alt = idx === 0 ? 'Festive band background' : 'Festive band background (mobile)';
      bgPics.push(img);
    });
  }
  // mobile background image rendered inside the tabs container, if any
  element.querySelectorAll('img.mobBackImg').forEach((img) => {
    const src = img.getAttribute('src');
    if (src && !isPlaceholder(src) && !bgPics.some((p) => p.getAttribute('src') === src)) bgPics.push(img);
  });
  if (bgPics.length) cells.push([bgPics]);

  // 2. one row per tab
  const tabs = [...element.querySelectorAll('.cmp-tabs__tablist .cmp-tabs__tab, .cmp-tabs__tab')]
    .filter((t, i, arr) => arr.indexOf(t) === i);
  const panels = [...element.querySelectorAll('.cmp-tabs__tabpanel')];

  tabs.forEach((tab, idx) => {
    const label = clean(tab.textContent);
    if (!label) return;
    // pair tab and panel by id (<id>-tab / <id>-tabpanel), else by order
    const id = tab.getAttribute('id') || '';
    let panel = null;
    if (id && id.endsWith('-tab')) {
      const panelId = `${id}panel`;
      panel = panels.find((p) => p.getAttribute('id') === panelId) || null;
    }
    if (!panel) panel = panels[idx] || null;

    const ul = document.createElement('ul');
    if (panel) {
      const seen = new Set();
      [...panel.querySelectorAll('.product__card')].forEach((card) => {
        if (ul.children.length >= MAX_CARDS) return;
        const rawImg = card.querySelector('.product__card__image img, img.product__image');
        const img = resolveImage(rawImg);
        const titleLink = card.querySelector('.product__card-title a[href]');
        const wrapLink = card.querySelector('a.product__card-content[href]');
        const href = (titleLink || wrapLink)?.getAttribute('href') || '';
        const nameEl = card.querySelector('.product__card-title a span, .product__card-title .product-name, .product-name');
        const name = clean(nameEl?.textContent)
          || clean(titleLink?.textContent)
          || clean(wrapLink?.getAttribute('title'))
          || clean(rawImg?.getAttribute('alt'));
        if (!name && !img) return;
        const key = href || name;
        if (seen.has(key)) return;
        seen.add(key);

        const li = document.createElement('li');
        if (img) li.append(img);
        if (name) {
          if (href) {
            const a = document.createElement('a');
            a.href = href;
            a.textContent = name;
            li.append(a);
          } else {
            li.append(document.createTextNode(name));
          }
        }
        const lines = [];
        const finalPrice = price(card.querySelector('.discountedPrice')?.textContent);
        if (finalPrice) lines.push([document.createTextNode(finalPrice)]);
        const mrp = price(card.querySelector('.originalPrice .price')?.textContent);
        if (mrp) {
          const del = document.createElement('del');
          del.textContent = mrp;
          lines.push([document.createTextNode('MRP '), del]);
        }
        const discount = clean(card.querySelector('.discountPercentage')?.textContent);
        if (discount) lines.push([document.createTextNode(discount)]);
        lines.forEach((nodes) => {
          li.append(document.createElement('br'));
          li.append(...nodes);
        });
        ul.append(li);
      });
    }
    cells.push([label, ul.children.length ? [ul] : '']);
  });

  // 3. View All action (outside the tab panels)
  const viewAll = [...element.querySelectorAll('a.cmp-button[href], .button a[href]')]
    .find((a) => !a.closest('.cmp-tabs__tabpanel'));
  if (viewAll) {
    const a = document.createElement('a');
    a.href = viewAll.getAttribute('href');
    a.textContent = clean(viewAll.textContent) || 'View All';
    cells.push([[a]]);
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'tabs-product', cells });
  element.replaceWith(block);
}
