import { createOptimizedPicture, toClassName } from '../../scripts/aem.js';

let blockCount = 0;

function optimizeImages(root) {
  root.querySelectorAll('picture > img').forEach((img) => {
    const url = new URL(img.src, window.location.href);
    if (url.origin !== window.location.origin || /\.svg$/i.test(url.pathname)) return;
    img.closest('picture').replaceWith(createOptimizedPicture(img.src, img.alt, false, [{ width: '400' }]));
  });
}

const isPictureOnly = (cell) => cell
  && cell.querySelector('picture')
  && !cell.textContent.trim();

const isLinkOnly = (cell) => {
  const links = cell ? cell.querySelectorAll('a[href]') : [];
  return links.length === 1 && cell.textContent.trim() === links[0].textContent.trim();
};

/** Tags common product-card lines so they can be styled without changing authoring. */
function tagProductLines(card) {
  card.querySelectorAll('p').forEach((el) => {
    const t = el.textContent.trim();
    if (!t) return;
    if (el.querySelector('del, s') || /^(₹|rs\.?|inr)/i.test(t)) el.classList.add('tabs-product-price');
    else if (/%\s*off/i.test(t)) el.classList.add('tabs-product-discount');
  });
}

/** Turns the panel's product list into scrollable product cards. */
function decorateProducts(panel) {
  panel.querySelectorAll(':scope > div > ul, :scope > ul').forEach((ul) => {
    ul.classList.add('tabs-product-cards');
    [...ul.children].forEach((li) => {
      li.classList.add('tabs-product-card');
      const pic = li.querySelector('picture');
      if (pic) {
        const media = document.createElement('div');
        media.className = 'tabs-product-card-image';
        const link = li.querySelector('a[href]');
        if (link && !link.contains(pic)) {
          const a = document.createElement('a');
          a.href = link.href;
          a.tabIndex = -1;
          a.setAttribute('aria-hidden', 'true');
          a.append(pic);
          media.append(a);
        } else {
          media.append(pic.closest('a') || pic);
        }
        li.prepend(media);
      }
      // wrap loose text/inline nodes so each line is a paragraph
      const body = document.createElement('div');
      body.className = 'tabs-product-card-body';
      // group inline content into one paragraph per line (lines split by <br> or block elements)
      let line = null;
      [...li.childNodes].forEach((node) => {
        if (node === li.querySelector('.tabs-product-card-image')) return;
        const isElement = node.nodeType === Node.ELEMENT_NODE;
        if (isElement && node.tagName === 'BR') { node.remove(); line = null; return; }
        if (isElement && /^(P|DIV|H\d|UL|OL)$/.test(node.tagName)) {
          body.append(node);
          line = null;
          return;
        }
        if (!line) {
          if (node.nodeType === Node.TEXT_NODE && !node.textContent.trim()) {
            node.remove();
            return;
          }
          line = document.createElement('p');
          body.append(line);
        }
        line.append(node);
      });
      body.querySelectorAll('p').forEach((p) => {
        if (!p.textContent.trim() && !p.querySelector('img, picture')) p.remove();
      });
      li.append(body);
      tagProductLines(body);
    });
  });
}

function activate(block, tablist, button, panel) {
  block.querySelectorAll(':scope > .tabs-product-panel').forEach((p) => p.setAttribute('aria-hidden', true));
  tablist.querySelectorAll('button').forEach((btn) => {
    btn.setAttribute('aria-selected', false);
    btn.tabIndex = -1;
  });
  panel.setAttribute('aria-hidden', false);
  button.setAttribute('aria-selected', true);
  button.removeAttribute('tabindex');
}

export default function decorate(block) {
  blockCount += 1;
  const prefix = `tabs-product-${blockCount}`;
  optimizeImages(block);

  const tablist = document.createElement('div');
  tablist.className = 'tabs-product-list';
  tablist.setAttribute('role', 'tablist');

  const header = document.createElement('div');
  header.className = 'tabs-product-header';

  const rows = [...block.children];
  const tabRows = [];
  rows.forEach((row) => {
    const cells = [...row.children];
    // background row: picture(s) only (desktop + optional mobile)
    if (cells.length === 1 && isPictureOnly(cells[0])) {
      const bg = document.createElement('div');
      bg.className = 'tabs-product-background';
      const pics = [...cells[0].querySelectorAll('picture')];
      pics.forEach((pic, idx) => {
        if (pics.length > 1) pic.classList.add(idx === 0 ? 'tabs-product-desktop' : 'tabs-product-mobile');
        bg.append(pic);
      });
      block.classList.add('tabs-product-has-background');
      block.prepend(bg);
      row.remove();
      return;
    }
    // action row: a single link (e.g. View All)
    if (cells.length === 1 && isLinkOnly(cells[0])) {
      const action = document.createElement('div');
      action.className = 'tabs-product-action';
      action.append(cells[0].querySelector('a'));
      header.append(action);
      row.remove();
      return;
    }
    if (!cells.length || !cells[0].textContent.trim()) {
      row.remove();
      return;
    }
    tabRows.push(row);
  });

  tabRows.forEach((row, i) => {
    const [label, ...content] = [...row.children];
    const id = `${prefix}-${toClassName(label.textContent) || i}`;

    row.className = 'tabs-product-panel';
    row.id = `tabpanel-${id}`;
    row.setAttribute('aria-hidden', !!i);
    row.setAttribute('aria-labelledby', `tab-${id}`);
    row.setAttribute('role', 'tabpanel');
    content.forEach((c) => c.classList.add('tabs-product-panel-content'));

    const button = document.createElement('button');
    button.className = 'tabs-product-tab';
    button.id = `tab-${id}`;
    button.innerHTML = label.querySelector('p') ? label.querySelector('p').innerHTML : label.innerHTML;
    button.setAttribute('aria-controls', `tabpanel-${id}`);
    button.setAttribute('aria-selected', !i);
    button.setAttribute('role', 'tab');
    button.setAttribute('type', 'button');
    if (i) button.tabIndex = -1;
    button.addEventListener('click', () => activate(block, tablist, button, row));
    tablist.append(button);
    label.remove();

    decorateProducts(row);
  });

  // keyboard navigation between tabs
  tablist.addEventListener('keydown', (e) => {
    if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(e.key)) return;
    const buttons = [...tablist.querySelectorAll('button')];
    const idx = buttons.indexOf(document.activeElement);
    if (idx < 0) return;
    let next = idx;
    if (e.key === 'ArrowLeft') next = (idx - 1 + buttons.length) % buttons.length;
    if (e.key === 'ArrowRight') next = (idx + 1) % buttons.length;
    if (e.key === 'Home') next = 0;
    if (e.key === 'End') next = buttons.length - 1;
    e.preventDefault();
    buttons[next].focus();
    buttons[next].click();
  });

  header.prepend(tablist);
  const bg = block.querySelector(':scope > .tabs-product-background');
  if (bg) bg.after(header);
  else block.prepend(header);

  optimizeImages(block);
}
