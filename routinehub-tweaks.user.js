// ==UserScript==
// @name        RoutineHub tweaks
// @version     2.4.1
// @license     MIT
// @author      https://github.com/atnbueno
// @description Experiments in improving the UX of using routinehub.co
// @icon        https://s3.us-west-002.backblazeb2.com/routinehub/static/icon/apple-touch-icon-76x76.png
// @namespace   https://github.com/atnbueno/userscripts
// @supportURL  https://github.com/atnbueno/userscripts/issues
// @match       https://routinehub.co/*
// @match       https://www.routinehub.co/*
// @run-at      document-start
// @grant       GM.addStyle
// ==/UserScript==

(function () {
  "use strict";

  document.addEventListener("DOMContentLoaded", function(event) {

/*
    // Adds retina version of images if they are available
    document.querySelectorAll('.content img').forEach(image => {
      image.onerror = () => image.removeAttribute('srcset');
      image.setAttribute('srcset', image.src.replace(/^(.+?)\.(gif|jpe?g|png|webp).*$/g, "$1.$2, $1_2x.$2 2x"));
    });
*/

    // Add blinking effect to the carousel when clicked
    const carousel = document.querySelector('#carousel');
    if (carousel) {
      const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
          if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
            mutation.addedNodes.forEach(function(node) {
              if (node.classList && node.classList.contains('slick-list')) {
                ['touchstart', 'mousedown'].forEach(event => {
                  node.addEventListener(event, () => node.classList.add('darkened'));
                });
                ['touchend', 'mouseup'].forEach(event => {
                  node.addEventListener(event, () => node.classList.remove('darkened'));
                });
              }
            });
          }
        });
      });
      observer.observe(carousel, { childList: true, subtree: true });
    }

    GM.addStyle(
    // Adjusts the homepage carousel size
    `#carousel, .slick-slide {
        margin: 0 auto;
        max-width: 660px;
      }`+
    // Avoids layout shifting in the navbar
    `.fas {
        min-width: 20px;
      }`+
    // Visual feedback when the carousel is clicked or tapped
    `.darkened {
        background-color: #0002;
        filter: brightness(80%);
      }`+
    // Restores red background for "delete" buttons
    `.button.is-dark.is-danger, .button.is-fullwidth[href$="/delete"] {
      background-color: hsl(348, 86%, 61%);
    }`+
    // Ensures proper .button separation
    `.button[type="submit"], button+a.button {
      margin-bottom: 0.5rem;
    }`+
    // Avoids button overflowing horizontally in version histories
    `.button.is-fullwidth {
      width: auto;
    }
    `);

  });
})();
