/* eslint-disable */
/* global WebImporter */
/**
 * Parser for cards-feature.
 * Base block: cards.
 * Source: https://www.broadridge.com/ (main .section.featured-solutions .featured-solutions__card-grid)
 * Generated: 2026-07-23
 *
 * Block table: 2 columns [image | text content], one row per card.
 * Each card is an <a> wrapping an icon/animated png image and a content block
 * containing a title (Proxy Services / Tokenization / Asset Servicing / Global Trading)
 * and a one-line description. The whole card is a link, preserved as a CTA in the
 * text cell. Inline data-URI SVG arrow icons in .card__cta are dropped.
 */
export default function parse(element, { document }) {
  // The grid element itself is passed in; each direct-child .card is one card.
  const cards = Array.from(element.querySelectorAll(':scope > .card'));

  const cells = [];

  cards.forEach((card) => {
    // --- Image cell ---
    // Real icon/animated image only; the .card__cta arrow data-URI is excluded.
    const imageEl = card.querySelector(':scope > .card__image picture, :scope > .card__image img');
    const imageCell = imageEl || '';

    // --- Text content cell ---
    const contentCell = [];

    // Title: rendered as a heading-styled div (".heading.title-1").
    const titleEl = card.querySelector('.heading, h1, h2, h3, [class*="title"]');
    if (titleEl && titleEl.textContent.trim()) {
      const heading = document.createElement('h3');
      heading.textContent = titleEl.textContent.trim();
      contentCell.push(heading);
    }

    // Description paragraph (inside the .text-atom span).
    const description = card.querySelector('.text-atom p, .card__content p');
    if (description) contentCell.push(description);

    // Whole-card link preserved as a CTA.
    if (card.matches('a[href]')) {
      const cardLink = document.createElement('a');
      cardLink.href = card.getAttribute('href');
      cardLink.textContent = (titleEl && titleEl.textContent.trim()) || 'Learn more';
      contentCell.push(cardLink);
    }

    cells.push([imageCell, contentCell]);
  });

  // Empty-block guard: if no cards were found, unwrap the element.
  if (cells.length === 0) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-feature', cells });
  element.replaceWith(block);
}
