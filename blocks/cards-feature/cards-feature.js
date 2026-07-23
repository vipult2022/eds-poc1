import { createOptimizedPicture } from '../../scripts/aem.js';

export default function decorate(block) {
  const ul = document.createElement('ul');
  [...block.children].forEach((row) => {
    const li = document.createElement('li');
    while (row.firstElementChild) li.append(row.firstElementChild);
    [...li.children].forEach((div) => {
      if (div.children.length === 1 && div.querySelector('picture')) {
        div.className = 'cards-feature-card-image';
      } else {
        div.className = 'cards-feature-card-body';
      }
    });

    // The trailing link is the whole-card CTA (arrow); make the card clickable.
    const body = li.querySelector('.cards-feature-card-body');
    const links = body ? body.querySelectorAll('a') : [];
    if (links.length) {
      const cta = links[links.length - 1];
      cta.classList.add('cards-feature-cta');
      li.dataset.href = cta.getAttribute('href');
    }

    ul.append(li);
  });

  ul.querySelectorAll('picture > img').forEach((img) => img.closest('picture').replaceWith(createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }])));
  block.replaceChildren(ul);

  // Make the whole card clickable while keeping the CTA link accessible.
  // Ignore clicks that originate on an interactive element or a text selection.
  ul.querySelectorAll('li[data-href]').forEach((li) => {
    li.addEventListener('click', (e) => {
      if (e.target.closest('a') || window.getSelection().toString()) return;
      const cta = li.querySelector('a.cards-feature-cta');
      if (cta) cta.click();
    });
  });
}
