// Footer: reads all copy, links and images from the footer fragment (footer.plain.html)
// and builds the layout, newsletter form and back-to-top control around it.

/**
 * Fetches the footer fragment. Metadata-independent: /content first (local preview),
 * then the site root (Document Authoring / Edge Delivery).
 * @returns {Promise<{html: string, base: string}|null>}
 */
async function fetchFooter() {
  let resp = await fetch('/content/footer.plain.html');
  if (!resp.ok) resp = await fetch('/footer.plain.html');
  if (!resp.ok) return null;
  const base = new URL(resp.url || '/footer.plain.html', window.location.href).href;
  return { html: await resp.text(), base };
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

/** External links open in a new tab, as on the source. */
function decorateLinks(root) {
  root.querySelectorAll('a[href]').forEach((a) => {
    try {
      const url = new URL(a.href);
      if (url.origin !== window.location.origin) {
        a.target = '_blank';
        a.rel = 'noopener';
      }
    } catch (e) { /* ignore */ }
  });
}

/**
 * A section whose last paragraph is a lone <strong> is a sign-up form:
 * first paragraph = input placeholder, paragraphs in between = consent text,
 * the <strong> = submit label.
 * @param {Element} section footer section
 * @returns {boolean} true when the section was turned into a form
 */
function buildForm(section) {
  const paras = [...section.querySelectorAll(':scope > p')];
  const last = paras[paras.length - 1];
  if (!last || !last.querySelector(':scope > strong') || last.textContent.trim() !== last.querySelector('strong').textContent.trim()) return false;
  const [placeholderP, ...rest] = paras;
  const consentPs = rest.slice(0, -1);
  const form = document.createElement('form');
  form.className = 'footer-form';
  form.method = 'post';
  form.noValidate = false;

  const input = document.createElement('input');
  input.type = 'email';
  input.name = 'email';
  input.required = true;
  input.placeholder = placeholderP.textContent.trim();
  input.setAttribute('aria-label', input.placeholder);
  input.className = 'footer-form-email';
  form.append(input);

  consentPs.forEach((p, i) => {
    const label = document.createElement('label');
    label.className = 'footer-form-consent';
    const box = document.createElement('input');
    box.type = 'checkbox';
    box.name = `consent-${i}`;
    box.checked = true;
    box.required = true;
    const text = document.createElement('span');
    text.append(...p.childNodes);
    label.append(box, text);
    form.append(label);
  });

  const submit = document.createElement('button');
  submit.type = 'submit';
  submit.className = 'footer-form-submit';
  submit.textContent = last.textContent.trim();
  form.append(submit);

  form.addEventListener('submit', (e) => {
    // no newsletter endpoint on Edge Delivery yet: validate in place, do not post
    e.preventDefault();
    form.reportValidity();
  });

  [placeholderP, ...rest].forEach((p) => p.remove());
  section.append(form);
  section.classList.add('footer-newsletter');
  return true;
}

/**
 * Groups each heading with the list that follows it (or each bare list) into a column.
 * @param {Element} section footer section
 */
function buildColumns(section) {
  const cols = [];
  let current = null;
  [...section.children].forEach((el) => {
    if (/^H[1-6]$/.test(el.tagName)) {
      current = document.createElement('div');
      current.className = 'footer-column';
      cols.push(current);
      current.append(el);
    } else if (el.tagName === 'UL') {
      if (!current || current.querySelector('ul')) {
        current = document.createElement('div');
        current.className = 'footer-column';
        cols.push(current);
      }
      if (el.querySelector('strong')) current.classList.add('footer-column-strong');
      current.append(el);
      current = null;
    }
  });
  if (cols.length) {
    section.replaceChildren(...cols);
    section.classList.add('footer-links');
  }
}

/**
 * A section holding only an image link to "#" becomes a back-to-top button.
 * @param {Element} section footer section
 * @returns {boolean} true when converted
 */
function buildBackToTop(section) {
  const links = section.querySelectorAll('a');
  if (links.length !== 1 || links[0].getAttribute('href') !== '#' || !links[0].querySelector('img')) return false;
  const btn = document.createElement('button');
  btn.type = 'button';
  btn.className = 'footer-back-to-top';
  const img = links[0].querySelector('img');
  btn.setAttribute('aria-label', img.alt || 'Back to top');
  img.alt = '';
  btn.append(img);
  btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  const toggle = () => btn.classList.toggle('visible', window.scrollY > 300);
  window.addEventListener('scroll', toggle, { passive: true });
  toggle();
  section.replaceWith(btn);
  return true;
}

/**
 * loads and decorates the footer
 * @param {Element} block The footer block element
 */
export default async function decorate(block) {
  const fragment = await fetchFooter();
  block.textContent = '';
  if (!fragment) return;
  const holder = document.createElement('div');
  holder.innerHTML = fragment.html;
  normalizeFragment(holder);
  resolveImages(holder, fragment.base);
  decorateLinks(holder);

  const main = document.createElement('div');
  main.className = 'footer-main';
  const linkArea = document.createElement('div');
  linkArea.className = 'footer-link-area';
  const bottom = document.createElement('div');
  bottom.className = 'footer-bottom';
  let backToTop = null;

  [...holder.children].forEach((section, i) => {
    section.classList.add('footer-section', `footer-section-${i + 1}`);
    if (buildForm(section)) {
      main.append(section);
    } else if (section.querySelector(':scope > h1, :scope > h2, :scope > h3, :scope > h4, :scope > h5, :scope > h6, :scope > ul') && !section.querySelector('img')) {
      buildColumns(section);
      linkArea.append(section);
    } else if (buildBackToTop(section)) {
      backToTop = holder.querySelector('.footer-back-to-top');
    } else {
      section.classList.add('footer-bottom-group');
      bottom.append(section);
    }
  });
  if (linkArea.children.length) main.append(linkArea);

  const wrapper = document.createElement('div');
  wrapper.className = 'footer-inner';
  wrapper.append(main);
  if (bottom.children.length) wrapper.append(bottom);
  block.append(wrapper);
  if (backToTop) block.append(backToTop);
}
