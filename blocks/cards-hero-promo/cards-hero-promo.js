import { createOptimizedPicture } from '../../scripts/aem.js';

export default function decorate(block) {
  const ul = document.createElement('ul');
  [...block.children].forEach((row) => {
    const li = document.createElement('li');
    while (row.firstElementChild) li.append(row.firstElementChild);

    // Classify each cell: a cell that holds (only) a picture is the media/background
    // layer, everything else is the card body. An empty cell (a promo card with no
    // background image authored) is still treated as the media layer so promo cards
    // keep a consistent structure.
    [...li.children].forEach((div) => {
      const hasPicture = !!div.querySelector('picture');
      const isEmpty = div.children.length === 0 && div.textContent.trim() === '';
      if ((hasPicture && div.children.length === 1) || isEmpty) {
        div.className = 'cards-hero-promo-card-image';
      } else {
        div.className = 'cards-hero-promo-card-body';
      }
    });

    // The large UNIFY card leads with an h1/h2 heading -> mark it primary.
    const body = li.querySelector('.cards-hero-promo-card-body');
    const isPrimary = !!(body && body.querySelector('h1, h2'));
    if (isPrimary) li.classList.add('cards-hero-promo-primary');

    if (body) {
      const heading = body.querySelector('h1, h2, h3, h4, h5, h6');
      // Promote a short category label that sits before the heading to a pill badge,
      // but only on the smaller promo cards (never on the primary hero card).
      if (!isPrimary && heading) {
        const kids = [...body.children];
        const firstP = body.querySelector(':scope > p');
        // treat firstP as a badge only when it sits before the heading and is a
        // plain label (no link inside).
        const precedesHeading = firstP
          && kids.indexOf(firstP) < kids.indexOf(heading);
        if (firstP && precedesHeading && !firstP.querySelector('a')) {
          firstP.classList.add('cards-hero-promo-badge');
        }
      }
      // Style the trailing link as the card CTA.
      const links = body.querySelectorAll('a');
      if (links.length) links[links.length - 1].classList.add('cards-hero-promo-cta');
    }

    ul.append(li);
  });

  ul.querySelectorAll('picture > img').forEach((img) => img.closest('picture').replaceWith(createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }])));
  block.replaceChildren(ul);
}
