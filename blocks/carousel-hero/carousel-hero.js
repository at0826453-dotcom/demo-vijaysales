import { createOptimizedPicture } from '../../scripts/aem.js';

const AUTOPLAY_MS = 5000;

function optimizeImages(root) {
  root.querySelectorAll('picture > img').forEach((img) => {
    const url = new URL(img.src, window.location.href);
    if (url.origin !== window.location.origin || /\.svg$/i.test(url.pathname)) return;
    img.closest('picture').replaceWith(createOptimizedPicture(img.src, img.alt, false, [{ media: '(min-width: 600px)', width: '2000' }, { width: '750' }]));
  });
}

function updateActiveSlide(block, slideIndex) {
  block.dataset.activeSlide = slideIndex;
  block.querySelectorAll('.carousel-hero-slide').forEach((slide, idx) => {
    const active = idx === slideIndex;
    slide.setAttribute('aria-hidden', !active);
    slide.querySelectorAll('a, button').forEach((el) => {
      if (active) el.removeAttribute('tabindex');
      else el.setAttribute('tabindex', '-1');
    });
  });
  block.querySelectorAll('.carousel-hero-slide-indicator button').forEach((button, idx) => {
    if (idx === slideIndex) {
      button.setAttribute('disabled', true);
      button.setAttribute('aria-current', true);
    } else {
      button.removeAttribute('disabled');
      button.removeAttribute('aria-current');
    }
  });
}

function showSlide(block, slideIndex = 0) {
  const slides = block.querySelectorAll('.carousel-hero-slide');
  if (!slides.length) return;
  let index = slideIndex;
  if (index < 0) index = slides.length - 1;
  if (index >= slides.length) index = 0;
  block.querySelector('.carousel-hero-slides').scrollTo({
    top: 0,
    left: slides[index].offsetLeft,
    behavior: 'smooth',
  });
}

function bindEvents(block) {
  const current = () => parseInt(block.dataset.activeSlide || '0', 10);

  block.querySelectorAll('.carousel-hero-slide-indicator button').forEach((button) => {
    button.addEventListener('click', (e) => {
      showSlide(block, parseInt(e.currentTarget.parentElement.dataset.targetSlide, 10));
    });
  });
  block.querySelector('.slide-prev').addEventListener('click', () => showSlide(block, current() - 1));
  block.querySelector('.slide-next').addEventListener('click', () => showSlide(block, current() + 1));

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        updateActiveSlide(block, parseInt(entry.target.dataset.slideIndex, 10));
      }
    });
  }, { root: block.querySelector('.carousel-hero-slides'), threshold: 0.5 });
  block.querySelectorAll('.carousel-hero-slide').forEach((slide) => observer.observe(slide));

  // autoplay, paused on hover/focus and disabled for reduced motion
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  let timer;
  const stop = () => { clearInterval(timer); timer = null; };
  const start = () => {
    stop();
    timer = setInterval(() => showSlide(block, current() + 1), AUTOPLAY_MS);
  };
  block.addEventListener('mouseenter', stop);
  block.addEventListener('mouseleave', start);
  block.addEventListener('focusin', stop);
  block.addEventListener('focusout', start);
  start();
}

function createSlide(row, slideIndex, carouselId) {
  const slide = document.createElement('li');
  slide.dataset.slideIndex = slideIndex;
  slide.id = `carousel-hero-${carouselId}-slide-${slideIndex}`;
  slide.className = 'carousel-hero-slide';

  optimizeImages(row);
  const cells = [...row.children];
  const pictures = [...row.querySelectorAll('picture')];
  const link = row.querySelector('a[href]');

  const media = document.createElement('div');
  media.className = 'carousel-hero-slide-image';
  pictures.forEach((pic, idx) => {
    // first picture = desktop artwork, second (optional) = mobile artwork
    if (pictures.length > 1) pic.classList.add(idx === 0 ? 'carousel-hero-desktop' : 'carousel-hero-mobile');
    media.append(pic);
  });

  // text content: whatever is left after removing pictures (heading, copy, CTA)
  const content = document.createElement('div');
  content.className = 'carousel-hero-slide-content';
  cells.forEach((cell) => {
    cell.querySelectorAll('p').forEach((p) => { if (!p.textContent.trim() && !p.children.length) p.remove(); });
    content.append(...cell.childNodes);
  });
  const hasText = content.textContent.trim().length > 0;
  const onlyLink = link && content.textContent.trim() === link.textContent.trim();

  if (pictures.length && link && (!hasText || onlyLink)) {
    // banner artwork carries the copy: make the whole image the link
    const a = document.createElement('a');
    a.href = link.href;
    a.className = 'carousel-hero-slide-link';
    const label = link.title || link.textContent.trim();
    const alt = media.querySelector('img')?.alt;
    if (alt || (label && label !== link.href)) a.setAttribute('aria-label', alt || label);
    a.append(...media.childNodes);
    media.append(a);
    slide.append(media);
  } else {
    if (pictures.length) slide.append(media);
    if (hasText) slide.append(content);
  }

  const heading = slide.querySelector('h1, h2, h3, h4, h5, h6');
  if (heading && heading.id) slide.setAttribute('aria-labelledby', heading.id);
  return slide;
}

let carouselId = 0;
export default function decorate(block) {
  carouselId += 1;
  block.id = `carousel-hero-${carouselId}`;
  const rows = [...block.querySelectorAll(':scope > div')];
  const isSingleSlide = rows.length < 2;

  block.setAttribute('role', 'region');
  block.setAttribute('aria-roledescription', 'Carousel');

  const container = document.createElement('div');
  container.className = 'carousel-hero-slides-container';

  const slidesWrapper = document.createElement('ul');
  slidesWrapper.className = 'carousel-hero-slides';

  let indicators;
  if (!isSingleSlide) {
    const nav = document.createElement('nav');
    nav.setAttribute('aria-label', 'Carousel Slide Controls');
    indicators = document.createElement('ol');
    indicators.className = 'carousel-hero-slide-indicators';
    nav.append(indicators);

    const buttons = document.createElement('div');
    buttons.className = 'carousel-hero-navigation-buttons';
    buttons.innerHTML = `
      <button type="button" class="slide-prev" aria-label="Previous Slide"></button>
      <button type="button" class="slide-next" aria-label="Next Slide"></button>
    `;
    container.append(buttons);
    block.append(nav);
  }

  rows.forEach((row, idx) => {
    slidesWrapper.append(createSlide(row, idx, carouselId));
    if (indicators) {
      const indicator = document.createElement('li');
      indicator.className = 'carousel-hero-slide-indicator';
      indicator.dataset.targetSlide = idx;
      indicator.innerHTML = `<button type="button" aria-label="Show Slide ${idx + 1} of ${rows.length}"></button>`;
      indicators.append(indicator);
    }
    row.remove();
  });

  container.append(slidesWrapper);
  block.prepend(container);

  if (!isSingleSlide) {
    updateActiveSlide(block, 0);
    bindEvents(block);
  }
}
