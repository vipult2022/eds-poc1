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

  // tools/importer/import-homepage.js
  var import_homepage_exports = {};
  __export(import_homepage_exports, {
    default: () => import_homepage_default
  });

  // tools/importer/parsers/cards-hero-promo.js
  function parse(element, { document }) {
    const cards = Array.from(element.querySelectorAll(":scope > .card"));
    const cells = [];
    cards.forEach((card) => {
      const imageEl = card.querySelector(":scope > .card__image picture, :scope > .card__image img");
      const imageCell = imageEl || "";
      const contentCell = [];
      const badge = card.querySelector(".badge");
      if (badge) contentCell.push(badge);
      const heading = card.querySelector('h1, h2, h3, [class*="title"]');
      if (heading) contentCell.push(heading);
      const description = card.querySelector(".hero-deconstructed__card-description, .text-atom p");
      if (description) contentCell.push(description);
      const ctaLink = card.querySelector("a.cta, .card__cta a");
      if (ctaLink) {
        contentCell.push(ctaLink);
      } else if (card.matches("a[href]")) {
        const cardLink = document.createElement("a");
        cardLink.href = card.getAttribute("href");
        cardLink.textContent = heading && heading.textContent.trim() || "Read more";
        contentCell.push(cardLink);
      }
      cells.push([imageCell, contentCell]);
    });
    if (cells.length === 0) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const block = WebImporter.Blocks.createBlock(document, { name: "cards-hero-promo", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-feature.js
  function parse2(element, { document }) {
    const cards = Array.from(element.querySelectorAll(":scope > .card"));
    const cells = [];
    cards.forEach((card) => {
      const imageEl = card.querySelector(":scope > .card__image picture, :scope > .card__image img");
      const imageCell = imageEl || "";
      const contentCell = [];
      const titleEl = card.querySelector('.heading, h1, h2, h3, [class*="title"]');
      if (titleEl && titleEl.textContent.trim()) {
        const heading = document.createElement("h3");
        heading.textContent = titleEl.textContent.trim();
        contentCell.push(heading);
      }
      const description = card.querySelector(".text-atom p, .card__content p");
      if (description) contentCell.push(description);
      if (card.matches("a[href]")) {
        const cardLink = document.createElement("a");
        cardLink.href = card.getAttribute("href");
        cardLink.textContent = titleEl && titleEl.textContent.trim() || "Learn more";
        contentCell.push(cardLink);
      }
      cells.push([imageCell, contentCell]);
    });
    if (cells.length === 0) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const block = WebImporter.Blocks.createBlock(document, { name: "cards-feature", cells });
    element.replaceWith(block);
  }

  // tools/importer/transformers/broadridge-cleanup.js
  var TransformHook = {
    beforeTransform: "beforeTransform",
    afterTransform: "afterTransform"
  };
  function transform(hookName, element, payload) {
    if (hookName === TransformHook.beforeTransform) {
      WebImporter.DOMUtils.remove(element, [
        "#onetrust-consent-sdk",
        "#ot-sdk-btn-floating"
      ]);
      WebImporter.DOMUtils.remove(element, [
        "#snippet_1744805197482",
        "#geolocation"
      ]);
      element.querySelectorAll('img[src^="data:image/svg+xml"]').forEach((img) => img.remove());
      WebImporter.DOMUtils.remove(element, [
        ".section.insights",
        ".section.top-tabber",
        ".section.side-tabber",
        ".section.analyst-recognition",
        ".section.contact-us"
      ]);
    }
    if (hookName === TransformHook.afterTransform) {
      WebImporter.DOMUtils.remove(element, [
        "header#site-header",
        "footer#footer-section",
        "nav",
        ".local-placeholder"
      ]);
      WebImporter.DOMUtils.remove(element, [
        "#batBeacon255297908951",
        "template",
        "iframe"
      ]);
      element.querySelectorAll('img[src*="bat.bing.com"], img[src*="/action/0"]').forEach((img) => {
        const wrapper = img.closest("p") || img;
        wrapper.remove();
      });
      WebImporter.DOMUtils.remove(element, [
        "link",
        "noscript",
        "source"
      ]);
      element.querySelectorAll("*").forEach((el) => {
        el.removeAttribute("onclick");
        el.removeAttribute("x-html");
        el.removeAttribute("@click");
        el.removeAttribute(":data-value");
      });
    }
  }

  // tools/importer/transformers/broadridge-sections.js
  var TransformHook2 = {
    beforeTransform: "beforeTransform",
    afterTransform: "afterTransform"
  };
  function transform2(hookName, element, payload) {
    if (hookName === TransformHook2.afterTransform) {
      const template = payload && payload.template;
      const sections = template && template.sections;
      if (!sections || sections.length < 2) {
        return;
      }
      const doc = element.ownerDocument;
      for (let i = sections.length - 1; i >= 0; i -= 1) {
        const section = sections[i];
        const relativeSelector = section.selector.replace(/^\s*main\s+/, "");
        const sectionEl = element.querySelector(relativeSelector) || element.querySelector(section.selector);
        if (!sectionEl) {
          continue;
        }
        if (section.style) {
          const metadataBlock = WebImporter.Blocks.createBlock(doc, {
            name: "Section Metadata",
            cells: {
              style: section.style
            }
          });
          sectionEl.after(metadataBlock);
        }
        if (i > 0 && sectionEl.previousElementSibling) {
          sectionEl.before(doc.createElement("hr"));
        }
      }
    }
  }

  // tools/importer/import-homepage.js
  var PAGE_TEMPLATE = {
    name: "homepage",
    description: "Broadridge corporate home page",
    urls: [
      "https://www.broadridge.com/"
    ],
    blocks: [
      {
        name: "cards-hero-promo",
        instances: ["main .section.hero-deconstructed"]
      },
      {
        name: "section-featured-solutions",
        instances: ["main .section.featured-solutions"],
        section: "light"
      },
      {
        name: "cards-feature",
        instances: ["main .section.featured-solutions .featured-solutions__card-grid"]
      }
    ],
    sections: [
      {
        id: "section-1",
        name: "hero-deconstructed",
        selector: "main .section.hero-deconstructed",
        style: null,
        blocks: ["cards-hero-promo"],
        defaultContent: []
      },
      {
        id: "section-2",
        name: "featured-solutions",
        selector: "main .section.featured-solutions",
        style: null,
        blocks: ["cards-feature"],
        defaultContent: ["main .section.featured-solutions .section-header__heading h2"]
      }
    ]
  };
  var parsers = {
    "cards-hero-promo": parse,
    "cards-feature": parse2
  };
  var transformers = [
    transform,
    ...PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [transform2] : []
  ];
  function executeTransformers(hookName, element, payload) {
    const enhancedPayload = __spreadProps(__spreadValues({}, payload), {
      template: PAGE_TEMPLATE
    });
    transformers.forEach((transformerFn) => {
      try {
        transformerFn.call(null, hookName, element, enhancedPayload);
      } catch (e) {
        console.error(`Transformer failed at ${hookName}:`, e);
      }
    });
  }
  function findBlocksOnPage(document, template) {
    const pageBlocks = [];
    template.blocks.forEach((blockDef) => {
      if (blockDef.name.startsWith("section-")) return;
      blockDef.instances.forEach((selector) => {
        const elements = document.querySelectorAll(selector);
        if (elements.length === 0) {
          console.warn(`Block "${blockDef.name}" selector not found: ${selector}`);
        }
        elements.forEach((element) => {
          pageBlocks.push({
            name: blockDef.name,
            selector,
            element,
            section: blockDef.section || null
          });
        });
      });
    });
    console.log(`Found ${pageBlocks.length} block instances on page`);
    return pageBlocks;
  }
  var import_homepage_default = {
    transform: (payload) => {
      const { document, url, params } = payload;
      const main = document.body;
      executeTransformers("beforeTransform", main, payload);
      const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);
      pageBlocks.forEach((block) => {
        if (!block.element.parentNode) return;
        const parser = parsers[block.name];
        if (parser) {
          try {
            parser(block.element, { document, url, params });
          } catch (e) {
            console.error(`Failed to parse ${block.name} (${block.selector}):`, e);
          }
        } else {
          console.warn(`No parser found for block: ${block.name}`);
        }
      });
      executeTransformers("afterTransform", main, payload);
      const hr = document.createElement("hr");
      main.appendChild(hr);
      WebImporter.rules.createMetadata(main, document);
      WebImporter.rules.transformBackgroundImages(main, document);
      WebImporter.rules.adjustImageUrls(main, url, params.originalURL);
      const pathname = new URL(params.originalURL).pathname.replace(/\/$/, "").replace(/\.html$/, "");
      const path = WebImporter.FileUtils.sanitizePath(pathname || "/index");
      return [{
        element: main,
        path,
        report: {
          title: document.title,
          template: PAGE_TEMPLATE.name,
          blocks: pageBlocks.map((b) => b.name)
        }
      }];
    }
  };
  return __toCommonJS(import_homepage_exports);
})();
