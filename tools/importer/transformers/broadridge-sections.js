/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: Broadridge section breaks and section metadata.
 *
 * Driven by payload.template.sections from page-templates.json.
 * Section selectors (verified against migration-work/cleaned.html):
 *   - section-1 hero-deconstructed: "main .section.hero-deconstructed" (line 2617)
 *   - section-2 featured-solutions:  "main .section.featured-solutions" (line 2689), style: "light"
 *
 * For each section (processed in reverse document order):
 *   - Insert a Section Metadata block after the section when section.style is set.
 *   - Insert an <hr> before the section when it is not the first section
 *     and there is content before it.
 */
const TransformHook = {
  beforeTransform: 'beforeTransform',
  afterTransform: 'afterTransform',
};

export default function transform(hookName, element, payload) {
  if (hookName === TransformHook.afterTransform) {
    const template = payload && payload.template;
    const sections = template && template.sections;
    if (!sections || sections.length < 2) {
      return;
    }

    const doc = element.ownerDocument;

    // Process sections in reverse order so inserting nodes does not shift the
    // positions of sections we have not handled yet.
    for (let i = sections.length - 1; i >= 0; i -= 1) {
      const section = sections[i];

      // The template selectors are rooted at "main ..."; resolve them relative
      // to the element we are transforming (which is the main content root).
      const relativeSelector = section.selector.replace(/^\s*main\s+/, '');
      const sectionEl = element.querySelector(relativeSelector)
        || element.querySelector(section.selector);

      if (!sectionEl) {
        continue;
      }

      // Section Metadata block (only when a style is defined for the section).
      if (section.style) {
        const metadataBlock = WebImporter.Blocks.createBlock(doc, {
          name: 'Section Metadata',
          cells: {
            style: section.style,
          },
        });
        sectionEl.after(metadataBlock);
      }

      // Section break before every section except the first, and only when
      // there is preceding content to break from.
      if (i > 0 && sectionEl.previousElementSibling) {
        sectionEl.before(doc.createElement('hr'));
      }
    }
  }
}
