/* eslint-disable */
/* global WebImporter */

/**
 * Parser for columns-feature-panel (.loyalty-card-wrp three-card band).
 * One row x three cells:
 *  1. Reliable Partners teaser (logo, heading, text, CTA)
 *  2. Loyalty sign-up (logo, text, link to /loyalty) - the OTP form controls
 *     and the hidden "points" state are removed by the cleanup transformer,
 *     so the /loyalty link is rebuilt when it is no longer in the DOM
 *  3. VS+ Extended Warranty teaser (logo, heading, text)
 * Decorative background images (*-bg-desktop.png) are not authored.
 */
export default function parse(element, { document, params }) {
  const clean = (t) => (t || '').replace(/ /g, ' ').replace(/\s+/g, ' ').trim();

  function teaserCell(container) {
    const cell = [];
    if (!container) return cell;
    const teaser = container.querySelector('.cmp-teaser') || container;
    const img = teaser.querySelector('.cmp-teaser__image img');
    const title = teaser.querySelector('.cmp-teaser__title');
    const desc = teaser.querySelector('.cmp-teaser__description');
    const ctas = [...teaser.querySelectorAll('.cmp-teaser__action-link[href]')];

    if (img) cell.push(img);
    if (title && clean(title.textContent)) {
      const h = document.createElement('h3');
      h.textContent = clean(title.textContent);
      cell.push(h);
    }
    if (desc) {
      [...desc.querySelectorAll('p')].forEach((p) => {
        const t = clean(p.textContent);
        if (!t) return;
        const np = document.createElement('p');
        np.textContent = t;
        cell.push(np);
      });
      if (!desc.querySelector('p') && clean(desc.textContent)) {
        const np = document.createElement('p');
        np.textContent = clean(desc.textContent);
        cell.push(np);
      }
    }
    ctas.forEach((cta) => {
      const p = document.createElement('p');
      const a = document.createElement('a');
      a.href = cta.getAttribute('href');
      a.textContent = clean(cta.textContent) || cta.getAttribute('href');
      p.append(a);
      cell.push(p);
    });
    return cell;
  }

  // 1. Reliable partners
  const reliable = element.querySelector('.reliable-wrap');
  const col1 = teaserCell(reliable);

  // 2. Loyalty sign-up (the visible #vs-login panel, not the hidden gokwik copy)
  const col2 = [];
  const unlock = element.querySelector('.unlock-wrp:not(.d-none)') || element.querySelector('.unlock-wrp');
  if (unlock) {
    const logo = unlock.querySelector('.cmp-image img');
    if (logo) col2.push(logo);
    unlock.querySelectorAll('.cmp-text p, .cmp-text h2, .cmp-text h3').forEach((el) => {
      const t = clean(el.textContent);
      if (!t || /otp|resend|available vs points|digit code/i.test(t)) return;
      const p = document.createElement('p');
      p.textContent = t;
      col2.push(p);
    });
    const loyaltyLink = unlock.querySelector('a[href*="loyalty"]');
    const p = document.createElement('p');
    const a = document.createElement('a');
    a.href = loyaltyLink ? loyaltyLink.getAttribute('href') : '/loyalty';
    a.textContent = (loyaltyLink && clean(loyaltyLink.textContent)) || 'Know More';
    p.append(a);
    col2.push(p);
  }

  // 3. VS+ extended warranty
  const warranty = element.querySelector('.delivery-wrp, .loyalty-mobile-bg:not(.reliable-wrap)');
  const col3 = teaserCell(warranty);

  const cells = [[col1, col2, col3]];
  const block = WebImporter.Blocks.createBlock(document, { name: 'columns-feature-panel', cells });
  element.replaceWith(block);
}
