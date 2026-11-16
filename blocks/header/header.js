// Header: reads all copy, links and images from the nav fragment (nav.plain.html)
// and builds the layout, search form and megamenu behaviour around it.

const DESKTOP = window.matchMedia('(width >= 900px)');
const SECTION_NAMES = ['brand', 'location', 'search', 'tools', 'sections'];

/**
 * Fetches the nav fragment. Metadata-independent: /content first (local preview),
 * then the site root (Document Authoring / Edge Delivery).
 * @returns {Promise<{html: string, base: string}|null>}
 */
async function fetchNav() {
  const paths = ['/content/nav.plain.html', '/nav.plain.html'];
  // eslint-disable-next-line no-restricted-syntax
  for (const path of paths) {
    // eslint-disable-next-line no-await-in-loop
    const resp = await fetch(path);
    if (resp.ok) {
      // eslint-disable-next-line no-await-in-loop
      const base = new URL(resp.url || path, window.location.href).href;
      // eslint-disable-next-line no-await-in-loop
      return { html: await resp.text(), base };
    }
  }
  return null;
}

/**
 * Document Authoring / Edge Delivery return the fragment with images wrapped in
 * <picture> and list-item labels wrapped in <p>. Flatten both so the same markup
 * is processed locally and in production.
 * @param {Element} root fragment container
 */
function normalizeFragment(root) {
  root.querySelectorAll('picture').forEach((pic) => {
    const img = pic.querySelector('img');
    if (img) pic.replaceWith(img);
  });
  root.querySelectorAll('li > p:first-child').forEach((p) => p.replaceWith(...p.childNodes));
}

/**
 * Makes relative image paths absolute against the fragment URL so they work on any page.
 * @param {Element} root container
 * @param {string} base fragment URL
 */
function resolveImages(root, base) {
  root.querySelectorAll('img').forEach((img) => {
    const src = img.getAttribute('src');
    if (src && !/^(https?:|data:|\/)/.test(src)) img.src = new URL(src, base).href;
    img.loading = 'lazy';
  });
}

/** @returns {HTMLButtonElement} */
function button(className, label, html = '') {
  const btn = document.createElement('button');
  btn.type = 'button';
  btn.className = className;
  btn.setAttribute('aria-label', label);
  btn.innerHTML = html;
  return btn;
}

/**
 * Turns the search paragraph (icon + placeholder text) into a search form.
 * @param {Element} section search section
 */
function buildSearch(section) {
  const p = section.querySelector('p');
  if (!p) return;
  const icon = p.querySelector('img');
  const placeholder = p.textContent.trim();
  const form = document.createElement('form');
  form.className = 'nav-search-form';
  form.action = '/search';
  form.method = 'get';
  form.setAttribute('role', 'search');
  const submit = button('nav-search-submit', 'Search');
  submit.type = 'submit';
  if (icon) submit.append(icon);
  const input = document.createElement('input');
  input.type = 'search';
  input.name = 'q';
  input.placeholder = placeholder;
  input.setAttribute('aria-label', placeholder || 'Search');
  input.autocomplete = 'off';
  form.append(submit, input);
  section.replaceChildren(form);
}

/**
 * Location: first paragraph is icon + current location, second the change link.
 * @param {Element} section location section
 */
function buildLocation(section) {
  const [current, change] = section.querySelectorAll('p');
  if (!current) return;
  const icon = current.querySelector('img');
  const text = document.createElement('div');
  text.className = 'nav-location-text';
  const label = document.createElement('span');
  label.textContent = current.textContent.trim();
  text.append(label);
  if (change) text.append(...change.childNodes);
  section.replaceChildren(...(icon ? [icon] : []), text);
}

function setOverlay(header, open) {
  header.classList.toggle('nav-panel-open', open);
}

function closeAll(navSections, header) {
  navSections.querySelectorAll(':scope > li[aria-expanded="true"]').forEach((li) => li.setAttribute('aria-expanded', 'false'));
  if (header) setOverlay(header, false);
}

/**
 * Activates one sub-category inside a panel and shows its filter groups.
 * @param {Element} panel panel element
 * @param {Element|null} sub sub-category li (null clears)
 */
function activateSub(panel, sub) {
  panel.querySelectorAll('.nav-panel-subs > li').forEach((li) => li.classList.toggle('active', li === sub));
  panel.querySelectorAll('.nav-filter-set').forEach((set) => {
    set.hidden = !sub || set.dataset.for !== sub.dataset.key;
  });
}

/**
 * Builds a megamenu panel from a top-level item: its nested list becomes the
 * sub-category column, nested lists of each sub become filter accordions,
 * paragraphs with images become promo cards.
 * @param {Element} li top-level nav item
 * @param {number} index item index
 */
function buildPanel(li, index) {
  const subList = li.querySelector(':scope > ul');
  const promos = [...li.querySelectorAll(':scope > p')];
  if (!subList) return;
  const panel = document.createElement('div');
  panel.className = 'nav-panel';
  const subsCol = document.createElement('div');
  subsCol.className = 'nav-panel-left';
  subList.classList.add('nav-panel-subs');
  subsCol.append(subList);
  const right = document.createElement('div');
  right.className = 'nav-panel-right';
  const filters = document.createElement('div');
  filters.className = 'nav-panel-filters';
  const promoWrap = document.createElement('div');
  promoWrap.className = 'nav-panel-promos';
  promos.forEach((p) => {
    p.classList.add('nav-promo');
    promoWrap.append(p);
  });
  if (promos.length === 1) promoWrap.classList.add('single');
  // wide banners (landscape, > 2.5:1) stack vertically instead of sitting side by side
  const firstImg = promoWrap.querySelector('img');
  const checkWide = () => {
    if (firstImg && firstImg.naturalWidth / (firstImg.naturalHeight || 1) > 2.5) promoWrap.classList.add('wide');
  };
  if (firstImg) {
    if (firstImg.complete) checkWide();
    else firstImg.addEventListener('load', checkWide, { once: true });
  }

  [...subList.children].forEach((sub, i) => {
    const key = `${index}-${i}`;
    sub.dataset.key = key;
    const groups = sub.querySelector(':scope > ul');
    if (groups) {
      sub.classList.add('has-filters');
      const set = document.createElement('div');
      set.className = 'nav-filter-set';
      set.dataset.for = key;
      set.hidden = true;
      [...groups.children].forEach((g) => {
        const title = g.querySelector(':scope > strong');
        const list = g.querySelector(':scope > ul');
        if (title && list) {
          const toggle = button('nav-filter-toggle', title.textContent.trim(), `<span>${title.textContent.trim()}</span>`);
          toggle.setAttribute('aria-expanded', 'false');
          toggle.addEventListener('click', () => {
            toggle.setAttribute('aria-expanded', toggle.getAttribute('aria-expanded') === 'true' ? 'false' : 'true');
          });
          title.replaceWith(toggle);
          g.classList.add('nav-filter-group');
        } else {
          g.classList.add('nav-filter-link');
        }
      });
      groups.classList.add('nav-filter-groups');
      set.append(groups);
      filters.append(set);
    }
    sub.addEventListener('mouseenter', () => { if (DESKTOP.matches) activateSub(panel, sub); });
  });

  right.append(filters, promoWrap);
  panel.append(subsCol, right);
  li.append(panel);
  li.classList.add('nav-drop');
}

/**
 * Builds the category bar and wires desktop hover + mobile tap behaviour.
 * @param {Element} section nav sections container
 * @param {Element} header header element
 */
function buildSections(section, header) {
  const list = section;
  [...list.children].forEach((li, i) => {
    li.classList.add('nav-item');
    const icon = li.querySelector(':scope > img');
    if (icon) icon.classList.add('nav-item-icon');
    buildPanel(li, i);
    if (!li.classList.contains('nav-drop')) return;
    li.setAttribute('aria-expanded', 'false');
    const panel = li.querySelector('.nav-panel');
    li.addEventListener('mouseenter', () => {
      if (!DESKTOP.matches) return;
      closeAll(section);
      li.setAttribute('aria-expanded', 'true');
      activateSub(panel, null);
      setOverlay(header, true);
    });
    li.addEventListener('mouseleave', () => {
      if (!DESKTOP.matches) return;
      li.setAttribute('aria-expanded', 'false');
      setOverlay(header, false);
    });
    const link = li.querySelector(':scope > a');
    const expander = button('nav-item-expand', `Show ${link ? link.textContent.trim() : 'menu'}`);
    expander.addEventListener('click', () => {
      const open = li.getAttribute('aria-expanded') === 'true';
      closeAll(section);
      li.setAttribute('aria-expanded', open ? 'false' : 'true');
    });
    if (link) link.after(expander);
    panel.querySelectorAll('.nav-panel-subs > li.has-filters').forEach((sub) => {
      const subLink = sub.querySelector(':scope > a');
      const subExpand = button('nav-sub-expand', `Show ${subLink ? subLink.textContent.trim() : 'filters'}`);
      subExpand.addEventListener('click', () => {
        const isActive = sub.classList.contains('active');
        activateSub(panel, isActive ? null : sub);
      });
      if (subLink) subLink.after(subExpand);
    });
  });
}

/**
 * loads and decorates the header
 * @param {Element} block The header block element
 */
export default async function decorate(block) {
  const fragment = await fetchNav();
  block.textContent = '';
  if (!fragment) return;
  const holder = document.createElement('div');
  holder.innerHTML = fragment.html;
  normalizeFragment(holder);
  resolveImages(holder, fragment.base);

  const nav = document.createElement('nav');
  nav.id = 'nav';
  nav.setAttribute('aria-label', 'Main navigation');
  const top = document.createElement('div');
  top.className = 'nav-top';
  const sections = {};
  [...holder.children].forEach((div, i) => {
    const name = SECTION_NAMES[i] || `extra-${i}`;
    div.className = `nav-${name}`;
    sections[name] = div;
  });
  if (sections.location) buildLocation(sections.location);
  if (sections.search) buildSearch(sections.search);
  const hamburger = button('nav-hamburger', 'Open navigation', '<span class="nav-hamburger-icon"></span>');
  hamburger.setAttribute('aria-controls', 'nav-sections');
  hamburger.setAttribute('aria-expanded', 'false');
  const left = document.createElement('div');
  left.className = 'nav-top-left';
  left.append(...['brand', 'location'].map((n) => sections[n]).filter(Boolean));
  if (sections.tools) {
    // labelled tools (icon + text): icon sits beside the link, the link holds the label
    sections.tools.querySelectorAll('li > a').forEach((a) => {
      const icon = a.querySelector('img');
      if (icon && a.textContent.trim()) {
        a.before(icon);
        a.parentElement.classList.add('nav-tool-labelled');
      }
    });
  }
  top.append(hamburger, left, ...['search', 'tools'].map((n) => sections[n]).filter(Boolean));
  nav.append(top);

  const header = block.closest('header') || block;
  if (sections.sections) {
    // the category list itself becomes the nav's section element (nav > ul > li)
    const list = sections.sections.querySelector(':scope > ul');
    if (list) {
      list.className = 'nav-sections';
      list.id = 'nav-sections';
      sections.sections = list;
      buildSections(list, header);
      nav.append(list);
    }
  }
  const overlay = document.createElement('div');
  overlay.className = 'nav-overlay';
  overlay.addEventListener('click', () => sections.sections && closeAll(sections.sections, header));

  hamburger.addEventListener('click', () => {
    const open = nav.getAttribute('aria-expanded') !== 'true';
    nav.setAttribute('aria-expanded', open ? 'true' : 'false');
    hamburger.setAttribute('aria-expanded', open ? 'true' : 'false');
    hamburger.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
    document.body.style.overflowY = open && !DESKTOP.matches ? 'hidden' : '';
  });
  nav.setAttribute('aria-expanded', 'false');

  document.addEventListener('keydown', (e) => {
    if (e.code === 'Escape' && sections.sections) closeAll(sections.sections, header);
  });

  // reset state when crossing the desktop/mobile breakpoint
  DESKTOP.addEventListener('change', () => {
    nav.setAttribute('aria-expanded', 'false');
    hamburger.setAttribute('aria-expanded', 'false');
    hamburger.setAttribute('aria-label', 'Open navigation');
    document.body.style.overflowY = '';
    if (sections.sections) {
      closeAll(sections.sections, header);
      sections.sections.querySelectorAll('.nav-panel').forEach((p) => activateSub(p, null));
    }
  });

  const wrapper = document.createElement('div');
  wrapper.className = 'nav-wrapper';
  wrapper.append(nav, overlay);
  block.append(wrapper);
}
