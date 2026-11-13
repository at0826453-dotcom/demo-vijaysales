/* eslint-disable */
/* global WebImporter */

// Import script for the "home" template (https://www.vijaysales.com/).
import carouselHeroParser from './parsers/carousel-hero.js';
import cardsBankOfferParser from './parsers/cards-bank-offer.js';
import cardsCategoryParser from './parsers/cards-category.js';
import cardsProductTileParser from './parsers/cards-product-tile.js';
import tabsProductParser from './parsers/tabs-product.js';
import cardsPromoTileParser from './parsers/cards-promo-tile.js';
import cardsProductParser from './parsers/cards-product.js';
import cardsVideoReelParser from './parsers/cards-video-reel.js';
import cardsBrandLogoParser from './parsers/cards-brand-logo.js';
import columnsFeaturePanelParser from './parsers/columns-feature-panel.js';
import cardsStatsParser from './parsers/cards-stats.js';
import columnsEcoStepsParser from './parsers/columns-eco-steps.js';
import cleanupTransformer from './transformers/vijaysales-cleanup.js';
import dmImagesTransformer from './transformers/vijaysales-dm-images.js';
import sectionsTransformer from './transformers/vijaysales-sections.js';

const PAGE_TEMPLATE = {
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

const parsers = {
  'carousel-hero': carouselHeroParser,
  'cards-bank-offer': cardsBankOfferParser,
  'cards-category': cardsCategoryParser,
  'cards-product-tile': cardsProductTileParser,
  'tabs-product': tabsProductParser,
  'cards-promo-tile': cardsPromoTileParser,
  'cards-product': cardsProductParser,
  'cards-video-reel': cardsVideoReelParser,
  'cards-brand-logo': cardsBrandLogoParser,
  'columns-feature-panel': columnsFeaturePanelParser,
  'cards-stats': cardsStatsParser,
  'columns-eco-steps': columnsEcoStepsParser,
};
// Late transformers change the DOM (section <hr> markers, shared fragments), so their beforeTransform
// runs after block discovery.
const sectionTransformers = [sectionsTransformer];
const fragmentTransformers = [];
const lateTransformers = [...sectionTransformers, ...fragmentTransformers];
const transformers = [cleanupTransformer, dmImagesTransformer, ...lateTransformers];
const earlyTransformers = transformers.filter((fn) => !lateTransformers.includes(fn));
// Catalog selectors (pageInstances, pageCleanup) count the <script> and <hr> elements the importer
// removes before transform, so a catalog template finds its targets in preprocess.
const CATALOG = Boolean(PAGE_TEMPLATE.pageCleanup || PAGE_TEMPLATE.blocks.some((b) => b.pageInstances));

function executeTransformers(hookName, element, payload, list = transformers) {
  const enhancedPayload = { ...payload, template: payload.params?.targets?.template || PAGE_TEMPLATE };
  list.forEach((fn) => {
    try { fn(hookName, element, enhancedPayload); }
    catch (e) { console.error(`Transformer failed at ${hookName}:`, e); }
  });
}

function findBlocksOnPage(document, template, url) {
  const pageBlocks = [];
  const pageKey = (u) => {
    try { const { origin, pathname } = new URL(u); return `${origin}${pathname.replace(/\/$/, '')}`; }
    catch { return u; }
  };
  const key = pageKey(url);
  const claim = (blockDef, selector) => {
    let matches = [];
    try { matches = document.querySelectorAll(selector); } catch { return; }
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

// Runs the early transformers, then marks each block and section target with an attribute: the
// importer re-creates the body before transform, so only attributes survive, not element references.
function markPageTargets(payload) {
  const { document, params } = payload;
  executeTransformers('beforeTransform', document.body, payload, earlyTransformers);
  const blocks = findBlocksOnPage(document, PAGE_TEMPLATE, params.originalURL).map(({ name, selector, element }, i) => {
    element.setAttribute('data-excat-block', String(i));
    return { name, selector };
  });
  const sections = (PAGE_TEMPLATE.sections || []).map((section, i) => {
    const target = (section.selector || []).map((s) => { try { return document.querySelector(s); } catch { return null; } }).find(Boolean);
    if (!target) return section;
    target.setAttribute('data-excat-section', String(i));
    return { ...section, selector: [`[data-excat-section="${i}"]`] };
  });
  params.targets = { blocks, template: { ...PAGE_TEMPLATE, sections } };
}

export default {
  preprocess: (payload) => {
    if (CATALOG) markPageTargets(payload);
  },
  transform: (payload) => {
    const { document, url, params } = payload;
    const main = document.body;
    params.fragments = [];

    if (!params.targets) markPageTargets(payload);
    const pageBlocks = params.targets.blocks
      .map((block, i) => ({ ...block, element: document.querySelector(`[data-excat-block="${i}"]`) }))
      .filter((block) => block.element);
    executeTransformers('beforeTransform', main, { ...payload, pageBlocks }, lateTransformers);

    pageBlocks.forEach((block) => {
      if (!main.contains(block.element)) return;
      const parser = parsers[block.name];
      if (!parser) return;
      try { parser(block.element, { document, url, params }); }
      catch (e) { console.error(`Failed to parse ${block.name} (${block.selector}):`, e); }
    });

    executeTransformers('afterTransform', main, payload);

    main.appendChild(document.createElement('hr'));
    WebImporter.rules.createMetadata(main, document);
    WebImporter.rules.transformBackgroundImages(main, document);
    WebImporter.rules.adjustImageUrls(main, url, params.originalURL);

    // A fragment's nodes left `main` before afterTransform: finalize it the same way, without the
    // page-only section breaks and metadata.
    params.fragments.forEach(({ element }) => {
      executeTransformers('afterTransform', element, payload, earlyTransformers);
      WebImporter.rules.transformBackgroundImages(element, document);
      WebImporter.rules.adjustImageUrls(element, url, params.originalURL);
    });

    const rawPath = new URL(params.originalURL).pathname
      .replace(/\/$/, '')
      .replace(/\.html?$/, '');
    const path = WebImporter.FileUtils.sanitizePath(rawPath === '' ? '/index' : rawPath);

    return [{
      element: main,
      path,
      report: { title: document.title, template: PAGE_TEMPLATE.name, blocks: pageBlocks.map((b) => b.name) },
    }, ...params.fragments];
  },
};
