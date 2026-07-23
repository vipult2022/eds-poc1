/* eslint-disable */
/* global WebImporter */
/**
 * Parser for cards-hero-promo.
 * Base block: cards.
 * Source: https://www.broadridge.com/ (main .section.hero-deconstructed)
 * Generated: 2026-07-23
 *
 * Block table: 2 columns [image | text content], one row per card.
 * - Card 1 (primary): background SVG image + H1 "UNIFY" + description + "Let's go" CTA.
 * - Card 2 (promo): no image (empty image cell) + badge + heading + card link.
 * - Card 3 (promo): png image + badge + heading + card link.
 * Inline data-URI SVG arrow icons in .card__cta are dropped.
 */
export default function parse(element, { document }) {
  // Each direct child .card is a single card (article for the primary card, <a> for promos).
  const cards = Array.from(element.querySelectorAll(':scope > .card'));

  const cells = [];

  cards.forEach((card) => {
    // --- Image cell ---
    // Only real images (picture/img) count; the arrow-icon data-URI in .card__cta is excluded.
    const imageEl = card.querySelector(':scope > .card__image picture, :scope > .card__image img');
    const imageCell = imageEl || '';

    // --- Text content cell ---
    const contentCell = [];

    // Badge (promo cards): e.g. "PRESS RELEASE", "INSIGHTS".
    const badge = card.querySelector('.badge');
    if (badge) contentCell.push(badge);

    // Heading: H1 for the primary card, H3 for promo cards.
    const heading = card.querySelector('h1, h2, h3, [class*="title"]');
    if (heading) contentCell.push(heading);

    // Description paragraph (primary card only).
    const description = card.querySelector('.hero-deconstructed__card-description, .text-atom p');
    if (description) contentCell.push(description);

    // Call-to-action.
    // Primary card: an explicit .cta link with visible text.
    const ctaLink = card.querySelector('a.cta, .card__cta a');
    if (ctaLink) {
      contentCell.push(ctaLink);
    } else if (card.matches('a[href]')) {
      // Promo cards wrap the whole card in an <a>; turn that into a link CTA.
      const cardLink = document.createElement('a');
      cardLink.href = card.getAttribute('href');
      cardLink.textContent = (heading && heading.textContent.trim()) || 'Read more';
      contentCell.push(cardLink);
    }

    cells.push([imageCell, contentCell]);
  });

  // Empty-block guard: if no cards were found, unwrap the element.
  if (cells.length === 0) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-hero-promo', cells });
  element.replaceWith(block);
}
