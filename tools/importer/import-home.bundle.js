/* eslint-disable */
var CustomImportScript = (() => {
  var __defProp = Object.defineProperty;
  var __defProps = Object.defineProperties;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getOwnPropSymbols = Object.getOwnPropertySymbols;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __propIsEnum = Object.prototype.propertyIsEnumerable;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __spreadValues = (a, b) => {
    for (var prop in b || (b = {}))
      if (__hasOwnProp.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    if (__getOwnPropSymbols)
      for (var prop of __getOwnPropSymbols(b)) {
        if (__propIsEnum.call(b, prop))
          __defNormalProp(a, prop, b[prop]);
      }
    return a;
  };
  var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // tools/importer/import-home.js
  var import_home_exports = {};
  __export(import_home_exports, {
    default: () => import_home_default
  });

  // tools/importer/parsers/carousel-hero.js
  function parse(element, { document, params }) {
    const cells = [];
    const slides = [...element.querySelectorAll(".swiper-slide")].filter((s) => !s.classList.contains("swiper-slide-duplicate"));
    slides.forEach((slide) => {
      const desktop = slide.querySelector(".cmp-teaser__image img, img.cmp-image__image");
      const mobile = slide.querySelector(".cmp-teaser__image--mobile img, img.cmp-image__mobile-image");
      const imageCell = [];
      if (desktop) imageCell.push(desktop);
      if (mobile && mobile !== desktop) imageCell.push(mobile);
      if (!imageCell.length) return;
      const linkEl = slide.querySelector(".cmp-teaser__images a[href], .cmp-teaser__content a[href], a[href]");
      const contentCell = [];
      if (linkEl) {
        const href = linkEl.getAttribute("href");
        const a = document.createElement("a");
        a.href = href;
        a.textContent = (linkEl.getAttribute("title") || "").trim() || href;
        contentCell.push(a);
      }
      cells.push([imageCell, contentCell]);
    });
    if (!cells.length) return;
    const block = WebImporter.Blocks.createBlock(document, { name: "carousel-hero", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-bank-offer.js
  function parse2(element, { document, params }) {
    const cells = [];
    const seen = /* @__PURE__ */ new Set();
    const slides = [...element.querySelectorAll(".swiper-slide")].filter((s) => !s.classList.contains("swiper-slide-duplicate"));
    const items = slides.length ? slides : [...element.querySelectorAll(".cmp-teaser")];
    items.forEach((item) => {
      const img = item.querySelector(".cmp-teaser__image img, img");
      const offerEl = item.querySelector(".cmp-teaser__pretitle");
      const noteEl = item.querySelector(".cmp-teaser__title");
      const descEl = item.querySelector(".cmp-teaser__description");
      const offer = offerEl ? offerEl.textContent.replace(/\s+/g, " ").trim() : "";
      const note = noteEl ? noteEl.textContent.replace(/\s+/g, " ").trim() : "";
      const key = `${offer}|${img ? img.getAttribute("src") : ""}`;
      if (!offer && !img) return;
      if (seen.has(key)) return;
      seen.add(key);
      const textCell = [];
      if (offer) {
        const p = document.createElement("p");
        p.textContent = offer;
        textCell.push(p);
      }
      if (descEl && descEl.textContent.trim()) {
        const p = document.createElement("p");
        p.textContent = descEl.textContent.replace(/\s+/g, " ").trim();
        textCell.push(p);
      }
      if (note) {
        const p = document.createElement("p");
        p.textContent = note;
        textCell.push(p);
      }
      const link = item.querySelector("a[href]");
      const href = link ? link.getAttribute("href") : "";
      if (href && href !== "#" && !href.startsWith("javascript")) {
        const p = document.createElement("p");
        const a = document.createElement("a");
        a.href = href;
        a.textContent = href;
        p.append(a);
        textCell.push(p);
      }
      cells.push([img ? [img] : "", textCell]);
    });
    const block = WebImporter.Blocks.createBlock(document, { name: "cards-bank-offer", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-category.js
  function parse3(element, { document, params }) {
    const cells = [];
    let items = [...element.querySelectorAll(".teaser .cmp-teaser")];
    if (!items.length) items = [...element.querySelectorAll(".cmp-teaser")];
    items.forEach((item) => {
      const img = item.querySelector(".cmp-teaser__image img, img.cmp-image__image");
      const titleEl = item.querySelector(".cmp-teaser__title");
      const linkEl = item.querySelector("a.cmp-teaser__link[href], a[href]");
      const label = titleEl ? titleEl.textContent.replace(/\s+/g, " ").trim() : "";
      if (!img && !label) return;
      const textCell = [];
      if (label || linkEl) {
        const p = document.createElement("p");
        if (linkEl) {
          const a = document.createElement("a");
          a.href = linkEl.getAttribute("href");
          a.textContent = label || img && img.getAttribute("alt") || linkEl.getAttribute("href");
          p.append(a);
        } else {
          p.textContent = label;
        }
        textCell.push(p);
      }
      cells.push([img ? [img] : "", textCell]);
    });
    const block = WebImporter.Blocks.createBlock(document, { name: "cards-category", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-product-tile.js
  var MAX_CARDS = 8;
  function parse4(element, { document, params }) {
    const clean = (t) => (t || "").replace(/ /g, " ").replace(/\s+/g, " ").trim();
    const price = (t) => clean(t).replace(/₹\s+/g, "\u20B9");
    const para = (content) => {
      const p = document.createElement("p");
      if (typeof content === "string") p.textContent = content;
      else p.append(...content);
      return p;
    };
    const isPlaceholder = (src) => !src || /\/blank\.(png|gif)|^data:/i.test(src);
    const resolveImage = (img) => {
      if (!img) return null;
      const lazy = ["data-src", "data-lazy", "data-original", "data-lazy-src"].map((a) => img.getAttribute(a)).find((v) => v && !isPlaceholder(v));
      if (lazy) img.setAttribute("src", lazy);
      if (!isPlaceholder(img.getAttribute("src"))) return img;
      const alt = (img.getAttribute("alt") || "").trim();
      const twin = alt && [...document.querySelectorAll("img.product__image")].find((i) => i !== img && (i.getAttribute("alt") || "").trim() === alt && !isPlaceholder(i.getAttribute("src")));
      if (twin) {
        img.setAttribute("src", twin.getAttribute("src"));
        return img;
      }
      return null;
    };
    const cards = [...element.querySelectorAll(".product__card")];
    const seen = /* @__PURE__ */ new Set();
    const cells = [];
    cards.forEach((card) => {
      var _a, _b, _c, _d, _e;
      if (cells.length >= MAX_CARDS) return;
      const rawImg = card.querySelector(".product__card__image img, img.product__image");
      const img = resolveImage(rawImg);
      const titleLink = card.querySelector(".product__card-title a[href]");
      const wrapLink = card.querySelector("a.product__card-content[href]");
      const href = ((_a = titleLink || wrapLink) == null ? void 0 : _a.getAttribute("href")) || "";
      const nameEl = card.querySelector(".product__card-title a span, .product__card-title .product-name, .product-name");
      const name = clean(nameEl == null ? void 0 : nameEl.textContent) || clean(titleLink == null ? void 0 : titleLink.textContent) || clean(wrapLink == null ? void 0 : wrapLink.getAttribute("title")) || clean(rawImg == null ? void 0 : rawImg.getAttribute("alt"));
      if (!name && !img) return;
      const key = href || name;
      if (seen.has(key)) return;
      seen.add(key);
      const body = [];
      if (name) {
        if (href) {
          const a = document.createElement("a");
          a.href = href;
          a.textContent = name;
          body.push(para([a]));
        } else {
          body.push(para(name));
        }
      }
      const rating = clean((_b = card.querySelector(".product-reviews")) == null ? void 0 : _b.textContent);
      if (rating && /\d/.test(rating)) body.push(para(rating));
      const finalPrice = price((_c = card.querySelector(".discountedPrice")) == null ? void 0 : _c.textContent);
      if (finalPrice) body.push(para(finalPrice));
      const mrp = price((_d = card.querySelector(".originalPrice .price")) == null ? void 0 : _d.textContent);
      if (mrp) {
        const del = document.createElement("del");
        del.textContent = mrp;
        body.push(para([document.createTextNode("MRP "), del]));
      }
      const discount = clean((_e = card.querySelector(".discountPercentage")) == null ? void 0 : _e.textContent);
      if (discount) body.push(para(discount));
      card.querySelectorAll(".product-tag__inner").forEach((tag) => {
        const t = clean(tag.textContent);
        if (t) body.push(para(t));
      });
      cells.push([img ? [img] : "", body]);
    });
    const block = WebImporter.Blocks.createBlock(document, { name: "cards-product-tile", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/tabs-product.js
  var MAX_CARDS2 = 5;
  function parse5(element, { document, params }) {
    const clean = (t) => (t || "").replace(/ /g, " ").replace(/\s+/g, " ").trim();
    const price = (t) => clean(t).replace(/₹\s+/g, "\u20B9");
    const isPlaceholder = (src) => !src || /\/blank\.(png|gif)|^data:/i.test(src);
    const resolveImage = (img) => {
      if (!img) return null;
      const lazy = ["data-src", "data-lazy", "data-original", "data-lazy-src"].map((a) => img.getAttribute(a)).find((v) => v && !isPlaceholder(v));
      if (lazy) img.setAttribute("src", lazy);
      if (!isPlaceholder(img.getAttribute("src"))) return img;
      const alt = (img.getAttribute("alt") || "").trim();
      const twin = alt && [...document.querySelectorAll("img.product__image")].find((i) => i !== img && (i.getAttribute("alt") || "").trim() === alt && !isPlaceholder(i.getAttribute("src")));
      if (twin) {
        img.setAttribute("src", twin.getAttribute("src"));
        return img;
      }
      return null;
    };
    const cells = [];
    const cssUrl = (value) => {
      const m = (value || "").match(/url\(\s*(["']?)(.*?)\1\s*\)/i);
      if (!m || !m[2]) return "";
      const raw = m[2].replace(/\\([0-9a-f]{1,6})\s?/gi, (s, hex) => String.fromCodePoint(parseInt(hex, 16))).replace(/\\(.)/g, "$1").trim();
      if (!raw || /^data:/i.test(raw)) return "";
      try {
        return new URL(raw, "https://www.vijaysales.com/").href.replace(/'/g, "%27");
      } catch (e) {
        return "";
      }
    };
    const bgUrl = (el) => {
      if (!el) return "";
      const inline = (el.getAttribute("style") || "").match(/background(?:-image)?\s*:[^;]*url\([^)]*\)/i);
      let bg = inline ? cssUrl(inline[0]) : "";
      if (!bg) {
        try {
          const view = document.defaultView;
          const cs = view && view.getComputedStyle ? view.getComputedStyle(el).backgroundImage : "";
          bg = cssUrl(cs);
        } catch (e) {
        }
      }
      return bg;
    };
    const band = element.closest(".offerProducts");
    const bgPics = [];
    if (band) {
      const desktopBg = band.querySelector(":scope > .desktopBg") || element.closest(".desktopBg");
      const mobileBg = band.querySelector(":scope > .mobileBg");
      [bgUrl(desktopBg), bgUrl(mobileBg)].forEach((url, idx) => {
        if (!url || bgPics.some((p) => p.getAttribute("src") === url)) return;
        const img = document.createElement("img");
        img.src = url;
        img.alt = idx === 0 ? "Festive band background" : "Festive band background (mobile)";
        bgPics.push(img);
      });
    }
    element.querySelectorAll("img.mobBackImg").forEach((img) => {
      const src = img.getAttribute("src");
      if (src && !isPlaceholder(src) && !bgPics.some((p) => p.getAttribute("src") === src)) bgPics.push(img);
    });
    if (bgPics.length) cells.push([bgPics]);
    const tabs = [...element.querySelectorAll(".cmp-tabs__tablist .cmp-tabs__tab, .cmp-tabs__tab")].filter((t, i, arr) => arr.indexOf(t) === i);
    const panels = [...element.querySelectorAll(".cmp-tabs__tabpanel")];
    tabs.forEach((tab, idx) => {
      const label = clean(tab.textContent);
      if (!label) return;
      const id = tab.getAttribute("id") || "";
      let panel = null;
      if (id && id.endsWith("-tab")) {
        const panelId = `${id}panel`;
        panel = panels.find((p) => p.getAttribute("id") === panelId) || null;
      }
      if (!panel) panel = panels[idx] || null;
      const ul = document.createElement("ul");
      if (panel) {
        const seen = /* @__PURE__ */ new Set();
        [...panel.querySelectorAll(".product__card")].forEach((card) => {
          var _a, _b, _c, _d;
          if (ul.children.length >= MAX_CARDS2) return;
          const rawImg = card.querySelector(".product__card__image img, img.product__image");
          const img = resolveImage(rawImg);
          const titleLink = card.querySelector(".product__card-title a[href]");
          const wrapLink = card.querySelector("a.product__card-content[href]");
          const href = ((_a = titleLink || wrapLink) == null ? void 0 : _a.getAttribute("href")) || "";
          const nameEl = card.querySelector(".product__card-title a span, .product__card-title .product-name, .product-name");
          const name = clean(nameEl == null ? void 0 : nameEl.textContent) || clean(titleLink == null ? void 0 : titleLink.textContent) || clean(wrapLink == null ? void 0 : wrapLink.getAttribute("title")) || clean(rawImg == null ? void 0 : rawImg.getAttribute("alt"));
          if (!name && !img) return;
          const key = href || name;
          if (seen.has(key)) return;
          seen.add(key);
          const li = document.createElement("li");
          if (img) li.append(img);
          if (name) {
            if (href) {
              const a = document.createElement("a");
              a.href = href;
              a.textContent = name;
              li.append(a);
            } else {
              li.append(document.createTextNode(name));
            }
          }
          const lines = [];
          const finalPrice = price((_b = card.querySelector(".discountedPrice")) == null ? void 0 : _b.textContent);
          if (finalPrice) lines.push([document.createTextNode(finalPrice)]);
          const mrp = price((_c = card.querySelector(".originalPrice .price")) == null ? void 0 : _c.textContent);
          if (mrp) {
            const del = document.createElement("del");
            del.textContent = mrp;
            lines.push([document.createTextNode("MRP "), del]);
          }
          const discount = clean((_d = card.querySelector(".discountPercentage")) == null ? void 0 : _d.textContent);
          if (discount) lines.push([document.createTextNode(discount)]);
          lines.forEach((nodes) => {
            li.append(document.createElement("br"));
            li.append(...nodes);
          });
          ul.append(li);
        });
      }
      cells.push([label, ul.children.length ? [ul] : ""]);
    });
    const viewAll = [...element.querySelectorAll("a.cmp-button[href], .button a[href]")].find((a) => !a.closest(".cmp-tabs__tabpanel"));
    if (viewAll) {
      const a = document.createElement("a");
      a.href = viewAll.getAttribute("href");
      a.textContent = clean(viewAll.textContent) || "View All";
      cells.push([[a]]);
    }
    const block = WebImporter.Blocks.createBlock(document, { name: "tabs-product", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-promo-tile.js
  function parse6(element, { document, params }) {
    const cells = [];
    let tiles = [...element.querySelectorAll(".imageVariation")];
    if (!tiles.length) tiles = [...element.querySelectorAll(".teaser")];
    tiles.forEach((tile) => {
      const img = tile.querySelector(".cmp-teaser__image img, img.cmp-image__image");
      if (!img || !img.getAttribute("src")) return;
      const linkCell = [];
      const linkEl = tile.querySelector("a[href]");
      const href = linkEl ? linkEl.getAttribute("href") : "";
      if (href && href !== "#") {
        const a = document.createElement("a");
        a.href = href;
        a.textContent = href;
        linkCell.push(a);
      }
      cells.push([[img], linkCell]);
    });
    const block = WebImporter.Blocks.createBlock(document, { name: "cards-promo-tile", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-product.js
  var MAX_CARDS3 = 8;
  function parse7(element, { document, params }) {
    const clean = (t) => (t || "").replace(/ /g, " ").replace(/\s+/g, " ").trim();
    const price = (t) => clean(t).replace(/₹\s+/g, "\u20B9");
    const para = (content) => {
      const p = document.createElement("p");
      if (typeof content === "string") p.textContent = content;
      else p.append(...content);
      return p;
    };
    const isPlaceholder = (src) => !src || /\/blank\.(png|gif)|^data:/i.test(src);
    const resolveImage = (img) => {
      if (!img) return null;
      const lazy = ["data-src", "data-lazy", "data-original", "data-lazy-src"].map((a) => img.getAttribute(a)).find((v) => v && !isPlaceholder(v));
      if (lazy) img.setAttribute("src", lazy);
      if (!isPlaceholder(img.getAttribute("src"))) return img;
      const alt = (img.getAttribute("alt") || "").trim();
      const twin = alt && [...document.querySelectorAll("img.product__image")].find((i) => i !== img && (i.getAttribute("alt") || "").trim() === alt && !isPlaceholder(i.getAttribute("src")));
      if (twin) {
        img.setAttribute("src", twin.getAttribute("src"));
        return img;
      }
      return null;
    };
    const cards = [...element.querySelectorAll(".product__card")];
    const seen = /* @__PURE__ */ new Set();
    const cells = [];
    cards.forEach((card) => {
      var _a, _b, _c, _d, _e, _f;
      if (cells.length >= MAX_CARDS3) return;
      const rawImg = card.querySelector(".product__card__image img, img.product__image");
      const img = resolveImage(rawImg);
      const titleLink = card.querySelector(".product__card-title a[href]");
      const wrapLink = card.querySelector("a.product__card-content[href]");
      const anyLink = card.querySelector('a[href^="/p/"], a[href*="/p/"]');
      const href = ((_a = titleLink || wrapLink || anyLink) == null ? void 0 : _a.getAttribute("href")) || "";
      const nameEl = card.querySelector(".product__card-title a span, .product__card-title .product-name, .product-name");
      const name = clean(nameEl == null ? void 0 : nameEl.textContent) || clean(titleLink == null ? void 0 : titleLink.textContent) || clean(wrapLink == null ? void 0 : wrapLink.getAttribute("title")) || clean(rawImg == null ? void 0 : rawImg.getAttribute("alt"));
      if (!name && !img) return;
      const key = href || name;
      if (seen.has(key)) return;
      seen.add(key);
      const body = [];
      card.querySelectorAll(".product-tag__inner").forEach((tag) => {
        const t = clean(tag.textContent);
        if (t) body.push(para(t));
      });
      if (name) {
        if (href) {
          const a = document.createElement("a");
          a.href = href;
          a.textContent = name;
          body.push(para([a]));
        } else {
          body.push(para(name));
        }
      }
      const rating = clean((_b = card.querySelector(".product-reviews")) == null ? void 0 : _b.textContent);
      if (rating && /\d/.test(rating)) body.push(para(rating));
      const finalPrice = price((_c = card.querySelector(".discountedPrice")) == null ? void 0 : _c.textContent);
      if (finalPrice) body.push(para(finalPrice));
      const mrp = price((_d = card.querySelector(".originalPrice .price")) == null ? void 0 : _d.textContent);
      if (mrp) {
        const del = document.createElement("del");
        del.textContent = mrp;
        body.push(para([document.createTextNode("MRP "), del]));
      }
      const discount = clean((_e = card.querySelector(".discountPercentage")) == null ? void 0 : _e.textContent);
      if (discount) body.push(para(discount));
      const offer = clean((_f = card.querySelector(".product__card--offer")) == null ? void 0 : _f.textContent);
      if (offer) body.push(para(offer));
      card.querySelectorAll(".shipping--details p").forEach((p) => {
        const t = clean(p.textContent);
        if (t) body.push(para(t));
      });
      cells.push([img ? [img] : "", body]);
    });
    const block = WebImporter.Blocks.createBlock(document, { name: "cards-product", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-video-reel.js
  function parse8(element, { document, params }) {
    const cells = [];
    const seen = /* @__PURE__ */ new Set();
    const thumbs = [...element.querySelectorAll("img[src], video[poster]")];
    thumbs.forEach((thumb) => {
      const item = thumb.closest('li, a[href], [class*="item"], [class*="card"], [class*="reel"]:not(.reels)') || thumb.parentElement;
      if (!item || seen.has(item)) return;
      seen.add(item);
      let img = thumb;
      if (thumb.tagName === "VIDEO") {
        img = document.createElement("img");
        img.src = thumb.getAttribute("poster");
      }
      const linkEl = item.matches("a[href]") ? item : item.querySelector("a[href]");
      const videoEl = item.querySelector("video source[src], video[src]");
      const href = linkEl ? linkEl.getAttribute("href") : videoEl ? videoEl.getAttribute("src") : "";
      const textCell = [];
      if (href) {
        const p = document.createElement("p");
        const a = document.createElement("a");
        a.href = href;
        a.textContent = linkEl && (linkEl.getAttribute("title") || linkEl.textContent.trim()) || href;
        p.append(a);
        textCell.push(p);
      }
      const caption = [...item.querySelectorAll('p, span, h3, h4, [class*="title"], [class*="view"]')].map((el) => el.textContent.replace(/\s+/g, " ").trim()).filter((t, i, arr) => t && arr.indexOf(t) === i).filter((t) => !linkEl || t !== linkEl.textContent.trim());
      caption.slice(0, 2).forEach((t) => {
        const p = document.createElement("p");
        p.textContent = t;
        textCell.push(p);
      });
      cells.push([[img], textCell]);
    });
    if (!cells.length) {
      element.remove();
      return;
    }
    const block = WebImporter.Blocks.createBlock(document, { name: "cards-video-reel", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-brand-logo.js
  function parse9(element, { document, params }) {
    const cells = [];
    let items = [...element.querySelectorAll(".image .cmp-image")];
    if (!items.length) items = [...element.querySelectorAll(".cmp-image")];
    items.forEach((item) => {
      const img = item.querySelector("img");
      if (!img || !img.getAttribute("src")) return;
      const linkEl = item.querySelector("a[href]");
      const linkCell = [];
      if (linkEl) {
        const a = document.createElement("a");
        a.href = linkEl.getAttribute("href");
        a.textContent = linkEl.getAttribute("href");
        linkCell.push(a);
      }
      cells.push([[img], linkCell]);
    });
    const block = WebImporter.Blocks.createBlock(document, { name: "cards-brand-logo", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/columns-feature-panel.js
  function parse10(element, { document, params }) {
    const clean = (t) => (t || "").replace(/ /g, " ").replace(/\s+/g, " ").trim();
    function teaserCell(container) {
      const cell = [];
      if (!container) return cell;
      const teaser = container.querySelector(".cmp-teaser") || container;
      const img = teaser.querySelector(".cmp-teaser__image img");
      const title = teaser.querySelector(".cmp-teaser__title");
      const desc = teaser.querySelector(".cmp-teaser__description");
      const ctas = [...teaser.querySelectorAll(".cmp-teaser__action-link[href]")];
      if (img) cell.push(img);
      if (title && clean(title.textContent)) {
        const h = document.createElement("h3");
        h.textContent = clean(title.textContent);
        cell.push(h);
      }
      if (desc) {
        [...desc.querySelectorAll("p")].forEach((p) => {
          const t = clean(p.textContent);
          if (!t) return;
          const np = document.createElement("p");
          np.textContent = t;
          cell.push(np);
        });
        if (!desc.querySelector("p") && clean(desc.textContent)) {
          const np = document.createElement("p");
          np.textContent = clean(desc.textContent);
          cell.push(np);
        }
      }
      ctas.forEach((cta) => {
        const p = document.createElement("p");
        const a = document.createElement("a");
        a.href = cta.getAttribute("href");
        a.textContent = clean(cta.textContent) || cta.getAttribute("href");
        p.append(a);
        cell.push(p);
      });
      return cell;
    }
    const reliable = element.querySelector(".reliable-wrap");
    const col1 = teaserCell(reliable);
    const col2 = [];
    const unlock = element.querySelector(".unlock-wrp:not(.d-none)") || element.querySelector(".unlock-wrp");
    if (unlock) {
      const logo = unlock.querySelector(".cmp-image img");
      if (logo) col2.push(logo);
      unlock.querySelectorAll(".cmp-text p, .cmp-text h2, .cmp-text h3").forEach((el) => {
        const t = clean(el.textContent);
        if (!t || /otp|resend|available vs points|digit code/i.test(t)) return;
        const p2 = document.createElement("p");
        p2.textContent = t;
        col2.push(p2);
      });
      const loyaltyLink = unlock.querySelector('a[href*="loyalty"]');
      const p = document.createElement("p");
      const a = document.createElement("a");
      a.href = loyaltyLink ? loyaltyLink.getAttribute("href") : "/loyalty";
      a.textContent = loyaltyLink && clean(loyaltyLink.textContent) || "Know More";
      p.append(a);
      col2.push(p);
    }
    const warranty = element.querySelector(".delivery-wrp, .loyalty-mobile-bg:not(.reliable-wrap)");
    const col3 = teaserCell(warranty);
    const cells = [[col1, col2, col3]];
    const block = WebImporter.Blocks.createBlock(document, { name: "columns-feature-panel", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-stats.js
  function parse11(element, { document, params }) {
    const cells = [];
    const clean = (t) => (t || "").replace(/ /g, " ").replace(/\s+/g, " ").trim();
    let items = [...element.querySelectorAll(".teaser .cmp-teaser")];
    if (!items.length) items = [...element.querySelectorAll(".cmp-teaser")];
    items.forEach((item) => {
      const titleEl = item.querySelector(".cmp-teaser__title");
      const descEl = item.querySelector(".cmp-teaser__description");
      const value = titleEl ? clean(titleEl.textContent) : "";
      const content = [];
      if (value) {
        const p = document.createElement("p");
        const strong = document.createElement("strong");
        strong.textContent = value;
        p.append(strong);
        content.push(p);
      }
      if (descEl) {
        const paras = [...descEl.querySelectorAll("p")];
        (paras.length ? paras : [descEl]).forEach((src) => {
          if (!clean(src.textContent)) return;
          const lines = [""];
          src.childNodes.forEach((n) => {
            if (n.nodeType === 1 && n.tagName === "BR") lines.push("");
            else lines[lines.length - 1] += n.textContent;
          });
          const p = document.createElement("p");
          lines.map(clean).filter(Boolean).forEach((line, i) => {
            if (i) p.append(document.createElement("br"));
            p.append(document.createTextNode(line));
          });
          content.push(p);
        });
      }
      if (content.length) cells.push([content]);
    });
    const block = WebImporter.Blocks.createBlock(document, { name: "cards-stats", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/columns-eco-steps.js
  function parse12(element, { document, params }) {
    const clean = (t) => (t || "").replace(/ /g, " ").replace(/\s+/g, " ").trim();
    const col1 = [];
    const intro = element.querySelector(".green-left .cmp-teaser");
    if (intro) {
      const title = intro.querySelector(".cmp-teaser__title");
      if (title && clean(title.textContent)) {
        const h = document.createElement("h2");
        h.textContent = clean(title.textContent);
        col1.push(h);
      }
      const desc = intro.querySelector(".cmp-teaser__description");
      if (desc && clean(desc.textContent)) {
        const p = document.createElement("p");
        p.textContent = clean(desc.textContent);
        col1.push(p);
      }
      intro.querySelectorAll(".cmp-teaser__action-link[href]").forEach((cta) => {
        const p = document.createElement("p");
        const a = document.createElement("a");
        a.href = cta.getAttribute("href");
        a.textContent = clean(cta.textContent) || "Know More";
        p.append(a);
        col1.push(p);
      });
    }
    const col2 = [];
    const img = element.querySelector(".image .cmp-image img") || [...element.querySelectorAll("img")].find((i) => !i.closest(".cmp-teaser"));
    if (img) col2.push(img);
    const col3 = [];
    const steps = [...element.querySelectorAll(".yellow-right .cmp-teaser")];
    if (steps.length) {
      const ol = document.createElement("ol");
      steps.forEach((step) => {
        var _a;
        const title = clean((_a = step.querySelector(".cmp-teaser__title")) == null ? void 0 : _a.textContent);
        const desc = step.querySelector(".cmp-teaser__description");
        const text = desc ? [...desc.querySelectorAll("p")].map((p) => clean(p.textContent)).filter(Boolean).join(" ") || clean(desc.textContent) : "";
        if (!title && !text) return;
        const li = document.createElement("li");
        if (title) {
          const strong = document.createElement("strong");
          strong.textContent = title;
          li.append(strong);
        }
        if (title && text) li.append(document.createElement("br"));
        if (text) li.append(document.createTextNode(text));
        ol.append(li);
      });
      if (ol.children.length) col3.push(ol);
    }
    const cells = [[col1, col2, col3]];
    const block = WebImporter.Blocks.createBlock(document, { name: "columns-eco-steps", cells });
    element.replaceWith(block);
  }

  // tools/importer/transformers/vijaysales-cleanup.js
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
  function transform(hookName, element, payload) {
    if (hookName === "beforeTransform") {
      const header = element.querySelector("#experiencefragment-fad01fb319");
      if (header) (header.closest("header.experiencefragment") || header).remove();
      const footer = element.querySelector("#experiencefragment-f1fe9443b2");
      if (footer) (footer.closest(".experiencefragment") || footer).remove();
      const bankPopup = element.querySelector("#bank-offers-popup");
      if (bankPopup) (bankPopup.closest(".experiencefragment") || bankPopup).remove();
      element.querySelectorAll(".offerProducts").forEach((section) => {
        const desktop = section.querySelector(":scope > .cmp-container.desktopBg");
        const mobile = section.querySelector(":scope > .cmp-container.mobileBg");
        if (desktop && mobile) mobile.remove();
      });
      removeAll(element, [
        ".vscontainer.d-none",
        // deal timers, hidden fragments, buy-guide menus
        ".homeDealsTimer",
        ".dealTimer",
        // empty spacers; the .loyalty-mobile-bg one is the VS+ warranty panel
        // consumed by the columns-feature-panel parser
        ".delivery-wrp:not(.loyalty-mobile-bg)",
        ".popupOverlay",
        // pincode, search, bank offers, notify-me popups
        ".notifypopup__wrapper",
        ".comparepopup",
        ".compare-floating",
        ".toaster-icon-btn",
        ".toastnotification",
        ".loaderWrapper",
        ".headerUrls",
        ".remove-element",
        '[id^="batBeacon"]',
        ".unlock-wrp.d-none",
        // duplicate (gokwik) loyalty login panel
        ".hide-form",
        // OTP verification / points states of the loyalty form
        ".d-none"
        // any remaining hidden items (product-reviews, deal dates)
      ]);
      removeAll(element, [
        ".swiper-slide-duplicate",
        ".swiper-button-next",
        ".swiper-button-prev",
        ".swiper-pagination",
        ".productcarousel__btn",
        ".quicklinks__btn"
      ]);
      removeAll(element, [
        ".icon--wishlist",
        ".wishlist-toggle",
        ".icon--cart",
        ".product__card-button",
        ".addtocart-mob",
        ".product-compare",
        ".empty-compare-card",
        ".product__price--notify",
        ".cmp-link__screen-reader-only"
      ]);
      removeAll(element, [
        ".cmp-form-text",
        // "Mobile Number" label + input + error text
        ".error-txt",
        "button.cmp-form-button",
        "input",
        "select",
        "textarea",
        "label.form-check-label"
      ]);
      element.querySelectorAll("form").forEach((form) => unwrap(form));
      removeAll(element, ["script", "style", "noscript", "iframe", "link", "meta"]);
    }
    if (hookName === "afterTransform") {
      removeAll(element, [
        "script",
        "style",
        "noscript",
        "iframe",
        "link",
        "header",
        "footer",
        "nav",
        ".swiper-button-next",
        ".swiper-button-prev",
        ".swiper-pagination"
      ]);
      element.querySelectorAll("*").forEach((el) => {
        [...el.attributes].forEach((attr) => {
          const n = attr.name;
          if (n.startsWith("data-") && !n.startsWith("data-excat")) el.removeAttribute(n);
          else if (n.startsWith("on") || n === "style" || n === "tabindex" || n.startsWith("aria-")) {
            el.removeAttribute(n);
          }
        });
      });
    }
  }

  // tools/importer/transformers/vijaysales-dm-images.js
  var EMPTY_ALT_SENTINEL = "Image without alt text";
  function detectDynamicMediaUrl(urlStr) {
    if (!urlStr || !/^(https?:\/\/|\/\/)/i.test(urlStr)) return false;
    let u;
    try {
      u = new URL(urlStr, "https://x/");
    } catch (e) {
      return false;
    }
    if (u.pathname.startsWith("/is/image/")) return "scene7";
    if (/^delivery-p\d+-e\d+\.adobeaemcloud\.com$/.test(u.hostname) && u.pathname.startsWith("/adobe/assets/urn:")) {
      return "dm-openapi";
    }
    return false;
  }
  function normalize(src) {
    return src.startsWith("//") ? `https:${src}` : src;
  }
  function altText(img) {
    const alt = (img.getAttribute("alt") || "").trim();
    return alt || EMPTY_ALT_SENTINEL;
  }
  function hasMeaningfulText(anchor) {
    return anchor.textContent.replace(/\s+/g, "").length > 0;
  }
  function transform2(hookName, element, payload) {
    if (hookName !== "afterTransform") return;
    const doc = element.ownerDocument;
    const processedAnchors = /* @__PURE__ */ new Set();
    const imgs = [...element.querySelectorAll("img")];
    imgs.forEach((img) => {
      if (!img.isConnected) return;
      const src = img.getAttribute("src") || "";
      if (!detectDynamicMediaUrl(src)) return;
      const anchor = img.closest("a");
      if (!anchor) {
        const a = doc.createElement("a");
        a.setAttribute("href", normalize(src));
        a.textContent = altText(img);
        const picture = img.parentElement && img.parentElement.tagName === "PICTURE" ? img.parentElement : null;
        (picture || img).replaceWith(a);
        return;
      }
      if (processedAnchors.has(anchor)) return;
      processedAnchors.add(anchor);
      if (hasMeaningfulText(anchor)) {
        console.warn(`[vijaysales-dm-images] Skipping mixed-content anchor with DM image: ${src}`);
        return;
      }
      const href = anchor.getAttribute("href") || "";
      const anchorImgs = [...anchor.querySelectorAll("img")];
      const replacements = anchorImgs.map((ai) => {
        const aiSrc = ai.getAttribute("src") || "";
        const a = doc.createElement("a");
        if (href) a.setAttribute("href", href);
        if (detectDynamicMediaUrl(aiSrc)) {
          if (!href) a.setAttribute("href", normalize(aiSrc));
          else a.setAttribute("title", normalize(aiSrc));
          a.textContent = altText(ai);
        } else {
          a.append(ai.cloneNode(true));
        }
        return a;
      });
      if (replacements.length === 1) {
        const r = replacements[0];
        if (r.hasAttribute("title")) anchor.setAttribute("title", r.getAttribute("title"));
        if (!href && r.getAttribute("href")) anchor.setAttribute("href", r.getAttribute("href"));
        anchor.replaceChildren(...r.childNodes);
      } else {
        anchor.replaceWith(...replacements);
      }
    });
  }

  // tools/importer/transformers/vijaysales-sections.js
  var MARKER = "data-excat-section-id";
  var END_MARKER = "data-excat-section-end";
  function findSectionElement(root, section) {
    const selectors = Array.isArray(section.selector) ? section.selector : [section.selector];
    for (const sel of selectors) {
      if (!sel) continue;
      try {
        const el = root.querySelector(sel);
        if (el) return el;
      } catch (e) {
      }
    }
    return null;
  }
  function transform3(hookName, element, payload) {
    const template = payload && payload.template;
    const sections = template && template.sections || [];
    if (sections.length < 2) return;
    const doc = element.ownerDocument;
    if (hookName === "beforeTransform") {
      for (let i = sections.length - 1; i >= 0; i -= 1) {
        const section = sections[i];
        const el = findSectionElement(element, section);
        if (!el || !el.parentNode) continue;
        if (section.style) {
          const end = doc.createElement("div");
          end.setAttribute(END_MARKER, section.id);
          el.after(end);
        }
        if (i > 0 || section.style) {
          const hr = doc.createElement("hr");
          hr.setAttribute(MARKER, section.id);
          el.before(hr);
        }
      }
    }
    if (hookName === "afterTransform") {
      for (let i = sections.length - 1; i >= 0; i -= 1) {
        const section = sections[i];
        const hr = element.querySelector(`hr[${MARKER}="${section.id}"]`);
        if (section.style) {
          const metadata = WebImporter.Blocks.createBlock(doc, {
            name: "Section Metadata",
            cells: { style: section.style }
          });
          const end = element.querySelector(`[${END_MARKER}="${section.id}"]`);
          if (end) {
            end.replaceWith(metadata);
          } else {
            const el = findSectionElement(element, section);
            if (el) {
              el.after(metadata);
            } else {
              let next = null;
              for (let j = i + 1; j < sections.length && !next; j += 1) {
                next = element.querySelector(`hr[${MARKER}="${sections[j].id}"]`);
              }
              if (next) next.before(metadata);
              else if (hr) element.append(metadata);
            }
          }
        }
        if (hr) {
          if (i === 0) hr.remove();
          else hr.removeAttribute(MARKER);
        }
      }
      element.querySelectorAll(`[${END_MARKER}]`).forEach((m) => m.remove());
      element.querySelectorAll(`[${MARKER}]`).forEach((m) => m.removeAttribute(MARKER));
    }
  }

  // tools/importer/import-home.js
  var PAGE_TEMPLATE = {
    "name": "home",
    "urls": [
      "https://www.vijaysales.com/"
    ],
    "representativeUrl": "https://www.vijaysales.com/",
    "description": "Vijay Sales homepage: hero banner carousel, bank offers, category quick links, merchandised product carousels and tabs, promo banners, brand logos, loyalty panels, stats and sustainability band.",
    "blocks": [
      {
        "name": "carousel-hero",
        "instances": [
          ".home-swipercarousel"
        ]
      },
      {
        "name": "cards-bank-offer",
        "instances": [
          ".home-bank-container"
        ]
      },
      {
        "name": "cards-category",
        "instances": [
          ".quicklinks-wrp"
        ]
      },
      {
        "name": "cards-product-tile",
        "instances": [
          ".latestProductsWrap-rightContent .customproductcarousel",
          ".superOffersWrap-rightContent .customproductcarousel"
        ]
      },
      {
        "name": "tabs-product",
        "instances": [
          ".offerProducts .desktopBg .seasonProductTabs",
          ".exclusiveDealsTabs:has(.cmp-tabs)"
        ]
      },
      {
        "name": "cards-promo-tile",
        "instances": [
          ".productCardWrp > .cmp-container"
        ]
      },
      {
        "name": "cards-product",
        "instances": [
          ".gamingProductsWrap .customproductcarousel",
          ".productrecommendations .productcarousel__parent"
        ]
      },
      {
        "name": "cards-video-reel",
        "instances": [
          ".reels"
        ]
      },
      {
        "name": "cards-brand-logo",
        "instances": [
          ".brands-imgs"
        ]
      },
      {
        "name": "columns-feature-panel",
        "instances": [
          ".loyalty-card-wrp"
        ]
      },
      {
        "name": "cards-stats",
        "instances": [
          ".counter-wrap"
        ]
      },
      {
        "name": "columns-eco-steps",
        "instances": [
          ".sustanability-wrap"
        ]
      }
    ],
    "urlPattern": "/",
    "sections": [
      {
        "id": "s1",
        "name": "Hero banner carousel",
        "selector": [
          ".home-swipercarousel"
        ],
        "style": null,
        "blocks": [
          "carousel-hero"
        ],
        "defaultContent": []
      },
      {
        "id": "s2",
        "name": "Bank offers strip",
        "selector": [
          ".home-bank-container-parent"
        ],
        "style": null,
        "blocks": [
          "cards-bank-offer"
        ],
        "defaultContent": []
      },
      {
        "id": "s3",
        "name": "Category quick links",
        "selector": [
          ".quicklinks-wrp"
        ],
        "style": null,
        "blocks": [
          "cards-category"
        ],
        "defaultContent": []
      },
      {
        "id": "s4",
        "name": "Best Of Apple",
        "selector": [
          ".latestProductsWrap"
        ],
        "style": "split",
        "blocks": [
          "cards-product-tile"
        ],
        "defaultContent": [
          ".latestProductsWrap-leftContent"
        ]
      },
      {
        "id": "s5",
        "name": "MacBook promo banner",
        "selector": [
          ".promotionoffer-image:has(#vscontainer-4dc5023782)"
        ],
        "style": null,
        "blocks": [],
        "defaultContent": [
          ".promotionoffer-image:has(#vscontainer-4dc5023782) .productpromtioncardteaser"
        ]
      },
      {
        "id": "s6",
        "name": "Grand Diwali Offers",
        "selector": [
          ".offerProducts:has(#title-da0639ad04)"
        ],
        "style": null,
        "blocks": [
          "tabs-product"
        ],
        "defaultContent": [
          ".offerProducts:has(#title-da0639ad04) .desktopBg .title"
        ]
      },
      {
        "id": "s7",
        "name": "Google Pixel promo banner",
        "selector": [
          ".promotionoffer-image:has(#vscontainer-d1f6d1dc6b)"
        ],
        "style": null,
        "blocks": [],
        "defaultContent": [
          ".promotionoffer-image:has(#vscontainer-d1f6d1dc6b) .productpromtioncardteaser"
        ]
      },
      {
        "id": "s8",
        "name": "OPPO / vivo promo tiles",
        "selector": [
          ".productCardWrp:has(#vscontainer-8e6682f20a)"
        ],
        "style": null,
        "blocks": [
          "cards-promo-tile"
        ],
        "defaultContent": []
      },
      {
        "id": "s9",
        "name": "Upgrade Your Home",
        "selector": [
          ".offerProducts:has(#title-16448356b3)"
        ],
        "style": null,
        "blocks": [
          "tabs-product"
        ],
        "defaultContent": [
          ".offerProducts:has(#title-16448356b3) .desktopBg .title"
        ]
      },
      {
        "id": "s10",
        "name": "Exclusive Deals & Offers",
        "selector": [
          ".exclusiveDeals:has(.cmp-tabs)"
        ],
        "style": null,
        "blocks": [
          "tabs-product"
        ],
        "defaultContent": [
          ".exclusiveDeals:has(.cmp-tabs) > .cmp-container > .title"
        ]
      },
      {
        "id": "s11",
        "name": "Great Gifting Ideas",
        "selector": [
          ".offerProducts:has(#title-a60f440709)"
        ],
        "style": null,
        "blocks": [
          "tabs-product"
        ],
        "defaultContent": [
          ".offerProducts:has(#title-a60f440709) .desktopBg .title"
        ]
      },
      {
        "id": "s12",
        "name": "TV deals",
        "selector": [
          ".promotionoffer-image:has(#productpromtioncardteaser-d97853042f)",
          ".gamingProductsWrap"
        ],
        "style": null,
        "blocks": [
          "cards-product"
        ],
        "defaultContent": [
          "#productpromtioncardteaser-d97853042f"
        ]
      },
      {
        "id": "s13",
        "name": "Audio promo tiles",
        "selector": [
          ".productCardWrp:has(#vscontainer-56e6d7fb52)"
        ],
        "style": null,
        "blocks": [
          "cards-promo-tile"
        ],
        "defaultContent": []
      },
      {
        "id": "s14",
        "name": "Super Offers",
        "selector": [
          ".superOffersWrap"
        ],
        "style": "split",
        "blocks": [
          "cards-product-tile"
        ],
        "defaultContent": [
          ".superOffersWrap-leftContent"
        ]
      },
      {
        "id": "s15",
        "name": "Explore Our Featured Products (video reels)",
        "selector": [
          ".exclusiveDeals:has(.reels)"
        ],
        "style": "centered",
        "blocks": [
          "cards-video-reel"
        ],
        "defaultContent": [
          ".exclusiveDeals:has(.reels) > .cmp-container > .title"
        ]
      },
      {
        "id": "s16",
        "name": "Products Recommended For You",
        "selector": [
          ".vscontainer:has(> .cmp-container > .productrecommendations)"
        ],
        "style": null,
        "blocks": [
          "cards-product"
        ],
        "defaultContent": [
          ".productrecommendations .productcarousel__title"
        ]
      },
      {
        "id": "s17",
        "name": "Discover Leading Brands",
        "selector": [
          ".brandListingWrap"
        ],
        "style": "centered",
        "blocks": [
          "cards-brand-logo"
        ],
        "defaultContent": [
          ".brandListingWrap > .cmp-container > .title",
          ".brandListingWrap > .cmp-container > .text",
          ".brandListingWrap > .cmp-container > .button"
        ]
      },
      {
        "id": "s18",
        "name": "Bank discount strip",
        "selector": [
          ".discountStripWrap"
        ],
        "style": "dark",
        "blocks": [],
        "defaultContent": [
          ".discountStripWrap .textOne",
          ".discountStripWrap .textTwo"
        ]
      },
      {
        "id": "s19",
        "name": "Partner / loyalty / warranty cards",
        "selector": [
          ".loyalty-card-wrp"
        ],
        "style": null,
        "blocks": [
          "columns-feature-panel"
        ],
        "defaultContent": []
      },
      {
        "id": "s20",
        "name": "Stats counters",
        "selector": [
          ".counter-wrap"
        ],
        "style": null,
        "blocks": [
          "cards-stats"
        ],
        "defaultContent": []
      },
      {
        "id": "s21",
        "name": "Sustainable Electronics",
        "selector": [
          ".sustanability-wrap"
        ],
        "style": "dark-green",
        "blocks": [
          "columns-eco-steps"
        ],
        "defaultContent": []
      }
    ]
  };
  var parsers = {
    "carousel-hero": parse,
    "cards-bank-offer": parse2,
    "cards-category": parse3,
    "cards-product-tile": parse4,
    "tabs-product": parse5,
    "cards-promo-tile": parse6,
    "cards-product": parse7,
    "cards-video-reel": parse8,
    "cards-brand-logo": parse9,
    "columns-feature-panel": parse10,
    "cards-stats": parse11,
    "columns-eco-steps": parse12
  };
  var sectionTransformers = [transform3];
  var fragmentTransformers = [];
  var lateTransformers = [...sectionTransformers, ...fragmentTransformers];
  var transformers = [transform, transform2, ...lateTransformers];
  var earlyTransformers = transformers.filter((fn) => !lateTransformers.includes(fn));
  var CATALOG = Boolean(PAGE_TEMPLATE.pageCleanup || PAGE_TEMPLATE.blocks.some((b) => b.pageInstances));
  function executeTransformers(hookName, element, payload, list = transformers) {
    var _a, _b;
    const enhancedPayload = __spreadProps(__spreadValues({}, payload), { template: ((_b = (_a = payload.params) == null ? void 0 : _a.targets) == null ? void 0 : _b.template) || PAGE_TEMPLATE });
    list.forEach((fn) => {
      try {
        fn(hookName, element, enhancedPayload);
      } catch (e) {
        console.error(`Transformer failed at ${hookName}:`, e);
      }
    });
  }
  function findBlocksOnPage(document, template, url) {
    const pageBlocks = [];
    const pageKey = (u) => {
      try {
        const { origin, pathname } = new URL(u);
        return `${origin}${pathname.replace(/\/$/, "")}`;
      } catch (e) {
        return u;
      }
    };
    const key = pageKey(url);
    const claim = (blockDef, selector) => {
      let matches = [];
      try {
        matches = document.querySelectorAll(selector);
      } catch (e) {
        return;
      }
      matches.forEach((element) => {
        if (pageBlocks.some((b) => b.element === element || b.element.contains(element) || element.contains(b.element))) return;
        pageBlocks.push({ name: blockDef.name, selector, element });
      });
    };
    template.blocks.forEach((blockDef) => {
      const entry = Object.entries(blockDef.pageInstances || {}).find(([u]) => pageKey(u) === key);
      (entry ? entry[1] : []).forEach((selector) => claim(blockDef, selector));
    });
    template.blocks.forEach((blockDef) => (blockDef.instances || []).forEach((selector) => claim(blockDef, selector)));
    return pageBlocks;
  }
  function markPageTargets(payload) {
    const { document, params } = payload;
    executeTransformers("beforeTransform", document.body, payload, earlyTransformers);
    const blocks = findBlocksOnPage(document, PAGE_TEMPLATE, params.originalURL).map(({ name, selector, element }, i) => {
      element.setAttribute("data-excat-block", String(i));
      return { name, selector };
    });
    const sections = (PAGE_TEMPLATE.sections || []).map((section, i) => {
      const target = (section.selector || []).map((s) => {
        try {
          return document.querySelector(s);
        } catch (e) {
          return null;
        }
      }).find(Boolean);
      if (!target) return section;
      target.setAttribute("data-excat-section", String(i));
      return __spreadProps(__spreadValues({}, section), { selector: [`[data-excat-section="${i}"]`] });
    });
    params.targets = { blocks, template: __spreadProps(__spreadValues({}, PAGE_TEMPLATE), { sections }) };
  }
  var import_home_default = {
    preprocess: (payload) => {
      if (CATALOG) markPageTargets(payload);
    },
    transform: (payload) => {
      const { document, url, params } = payload;
      const main = document.body;
      params.fragments = [];
      if (!params.targets) markPageTargets(payload);
      const pageBlocks = params.targets.blocks.map((block, i) => __spreadProps(__spreadValues({}, block), { element: document.querySelector(`[data-excat-block="${i}"]`) })).filter((block) => block.element);
      executeTransformers("beforeTransform", main, __spreadProps(__spreadValues({}, payload), { pageBlocks }), lateTransformers);
      pageBlocks.forEach((block) => {
        if (!main.contains(block.element)) return;
        const parser = parsers[block.name];
        if (!parser) return;
        try {
          parser(block.element, { document, url, params });
        } catch (e) {
          console.error(`Failed to parse ${block.name} (${block.selector}):`, e);
        }
      });
      executeTransformers("afterTransform", main, payload);
      main.appendChild(document.createElement("hr"));
      WebImporter.rules.createMetadata(main, document);
      WebImporter.rules.transformBackgroundImages(main, document);
      WebImporter.rules.adjustImageUrls(main, url, params.originalURL);
      params.fragments.forEach(({ element }) => {
        executeTransformers("afterTransform", element, payload, earlyTransformers);
        WebImporter.rules.transformBackgroundImages(element, document);
        WebImporter.rules.adjustImageUrls(element, url, params.originalURL);
      });
      const rawPath = new URL(params.originalURL).pathname.replace(/\/$/, "").replace(/\.html?$/, "");
      const path = WebImporter.FileUtils.sanitizePath(rawPath === "" ? "/index" : rawPath);
      return [{
        element: main,
        path,
        report: { title: document.title, template: PAGE_TEMPLATE.name, blocks: pageBlocks.map((b) => b.name) }
      }, ...params.fragments];
    }
  };
  return __toCommonJS(import_home_exports);
})();
