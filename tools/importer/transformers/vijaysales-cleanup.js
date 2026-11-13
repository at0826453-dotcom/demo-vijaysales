/* eslint-disable */
/* global WebImporter */

/**
 * Vijay Sales cleanup transformer.
 *
 * Removes non-authorable chrome and interactive widgets from the captured
 * www.vijaysales.com DOM. All selectors were taken from
 * migration-work/cleaned.html and migration-work/page-structure.json
 * ("excluded" list).
 */

function removeAll(root, selectors) {
  selectors.forEach((sel) => {
    root.querySelectorAll(sel).forEach((el) => el.remove());
  });
}

function unwrap(el) {
  const parent = el.parentNode;
  if (!parent) return;
  while (el.firstChild) parent.insertBefore(el.firstChild, el);
  el.remove();
}

export default function transform(hookName, element, payload) {
  if (hookName === 'beforeTransform') {
    // 1. Global header / footer experience fragments (migrated separately as nav/footer).
    const header = element.querySelector('#experiencefragment-fad01fb319');
    if (header) (header.closest('header.experiencefragment') || header).remove();
    const footer = element.querySelector('#experiencefragment-f1fe9443b2');
    if (footer) (footer.closest('.experiencefragment') || footer).remove();

    // 2. Bank offer T&C popup fragment that follows the sustainability band.
    const bankPopup = element.querySelector('#bank-offers-popup');
    if (bankPopup) (bankPopup.closest('.experiencefragment') || bankPopup).remove();

    // 3. .offerProducts sections duplicate their content in a mobile and a
    //    desktop container. Keep .desktopBg (targeted by tabs-product parser),
    //    drop the .mobileBg copy. The captured DOM carries no inline
    //    background images on either container, so nothing is lost.
    element.querySelectorAll('.offerProducts').forEach((section) => {
      const desktop = section.querySelector(':scope > .cmp-container.desktopBg');
      const mobile = section.querySelector(':scope > .cmp-container.mobileBg');
      if (desktop && mobile) mobile.remove();
    });

    // 4. Hidden / non-content containers, popups, toasters, loaders.
    removeAll(element, [
      '.vscontainer.d-none', // deal timers, hidden fragments, buy-guide menus
      '.homeDealsTimer',
      '.dealTimer',
      // empty spacers; the .loyalty-mobile-bg one is the VS+ warranty panel
      // consumed by the columns-feature-panel parser
      '.delivery-wrp:not(.loyalty-mobile-bg)',
      '.popupOverlay', // pincode, search, bank offers, notify-me popups
      '.notifypopup__wrapper',
      '.comparepopup',
      '.compare-floating',
      '.toaster-icon-btn',
      '.toastnotification',
      '.loaderWrapper',
      '.headerUrls',
      '.remove-element',
      '[id^="batBeacon"]',
      '.unlock-wrp.d-none', // duplicate (gokwik) loyalty login panel
      '.hide-form', // OTP verification / points states of the loyalty form
      '.d-none', // any remaining hidden items (product-reviews, deal dates)
    ]);

    // 5. Carousel loop clones and navigation chrome.
    removeAll(element, [
      '.swiper-slide-duplicate',
      '.swiper-button-next',
      '.swiper-button-prev',
      '.swiper-pagination',
      '.productcarousel__btn',
      '.quicklinks__btn',
    ]);

    // 6. Product card commerce widgets (wishlist, cart, compare, notify).
    removeAll(element, [
      '.icon--wishlist',
      '.wishlist-toggle',
      '.icon--cart',
      '.product__card-button',
      '.addtocart-mob',
      '.product-compare',
      '.empty-compare-card',
      '.product__price--notify',
      '.cmp-link__screen-reader-only',
    ]);

    // 7. Forms: keep the loyalty panel text, drop the controls.
    removeAll(element, [
      '.cmp-form-text', // "Mobile Number" label + input + error text
      '.error-txt',
      'button.cmp-form-button',
      'input',
      'select',
      'textarea',
      'label.form-check-label',
    ]);
    element.querySelectorAll('form').forEach((form) => unwrap(form));

    // 8. Non-content technical elements.
    removeAll(element, ['script', 'style', 'noscript', 'iframe', 'link', 'meta']);
  }

  if (hookName === 'afterTransform') {
    // Final cleanup of leftovers that parsers did not consume.
    // NOTE: HTML comments are intentionally preserved.
    removeAll(element, [
      'script',
      'style',
      'noscript',
      'iframe',
      'link',
      'header',
      'footer',
      'nav',
      '.swiper-button-next',
      '.swiper-button-prev',
      '.swiper-pagination',
    ]);

    // Strip tracking / behavioural attributes.
    element.querySelectorAll('*').forEach((el) => {
      [...el.attributes].forEach((attr) => {
        const n = attr.name;
        if (n.startsWith('data-') && !n.startsWith('data-excat')) el.removeAttribute(n);
        else if (n.startsWith('on') || n === 'style' || n === 'tabindex' || n.startsWith('aria-')) {
          el.removeAttribute(n);
        }
      });
    });
  }
}
