/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: Broadridge site-wide cleanup.
 * All selectors below were verified against migration-work/cleaned.html
 * (the scraped Broadridge homepage). No selectors are guessed.
 */
const TransformHook = {
  beforeTransform: 'beforeTransform',
  afterTransform: 'afterTransform',
};

export default function transform(hookName, element, payload) {
  if (hookName === TransformHook.beforeTransform) {
    // Cookie consent / privacy chrome (added by OneTrust, not authorable).
    // Found in cleaned.html: <div id="onetrust-consent-sdk"> (line 5603),
    // <div id="ot-sdk-btn-floating" ...> (line 5888).
    WebImporter.DOMUtils.remove(element, [
      '#onetrust-consent-sdk',
      '#ot-sdk-btn-floating',
    ]);

    // Geolocation snippet injected at top of <body>.
    // Found in cleaned.html: <div id="snippet_1744805197482"> wrapping
    // <div id="geolocation"> (lines 4-8).
    WebImporter.DOMUtils.remove(element, [
      '#snippet_1744805197482',
      '#geolocation',
    ]);

    // Inline SVG data-URI icons (decorative chrome, not authorable content).
    // Found in cleaned.html as <img src="data:image/svg+xml;base64,...">
    // (e.g. lines 25, 37, 53, 2658, 5896).
    element.querySelectorAll('img[src^="data:image/svg+xml"]').forEach((img) => img.remove());

    // Out-of-scope sections: only the hero-deconstructed and featured-solutions
    // sections are being migrated. Drop the remaining sections so they do not
    // round-trip into the authored content as default content.
    WebImporter.DOMUtils.remove(element, [
      '.section.insights',
      '.section.top-tabber',
      '.section.side-tabber',
      '.section.analyst-recognition',
      '.section.contact-us',
    ]);
  }

  if (hookName === TransformHook.afterTransform) {
    // Non-authorable site shell: header (with utility/main/secondary nav),
    // footer, and empty layout placeholders.
    // Found in cleaned.html:
    //   <header id="site-header" class="site-header section"> (line 9)
    //     contains <nav id="promo-nav"> (line 11) and <nav id="main-nav"> (line 62)
    //   <footer class="section footer" id="footer-section"> (line 5357)
    //   <div class="local-placeholder"> x2 (lines 5353, 5355)
    WebImporter.DOMUtils.remove(element, [
      'header#site-header',
      'footer#footer-section',
      'nav',
      '.local-placeholder',
    ]);

    // Tracking beacon and non-authorable templates/iframes.
    // Found in cleaned.html:
    //   <div id="batBeacon255297908951"> with Bing beacon img (lines 5901-5902)
    //   <template id="env-vars"> (line 5350) and search recomandation <template> (line 41)
    //   <iframe class="ot-text-resize" ...> (line 5885)
    WebImporter.DOMUtils.remove(element, [
      '#batBeacon255297908951',
      'template',
      'iframe',
    ]);

    // Tracking-pixel images (e.g. Bing UET beacon) that survive as bare <img>
    // elements after image-rule processing.
    element.querySelectorAll('img[src*="bat.bing.com"], img[src*="/action/0"]').forEach((img) => {
      const wrapper = img.closest('p') || img;
      wrapper.remove();
    });

    // Stray stylesheet <link> elements (e.g. inside <main>) and <noscript>.
    // Found in cleaned.html: <link href="/_Static-Assets/css/homepage-hero.css">
    // and <link href="/_Static-Assets/css/desktopbreakhp.css"> (lines 2614-2615).
    WebImporter.DOMUtils.remove(element, [
      'link',
      'noscript',
      'source',
    ]);

    // Attribute cleanup: strip Alpine.js / tracking attributes present in the
    // captured DOM (e.g. @click, x-html, :data-value on search recomandation
    // items - line 43) so they do not round-trip into authored content.
    element.querySelectorAll('*').forEach((el) => {
      el.removeAttribute('onclick');
      el.removeAttribute('x-html');
      el.removeAttribute('@click');
      el.removeAttribute(':data-value');
    });
  }
}
