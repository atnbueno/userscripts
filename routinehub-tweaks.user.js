// ==UserScript==
// @name        RoutineHub tweaks
// @version     2.1
// @license     MIT
// @author      https://github.com/atnbueno
// @description Experiments in improving the experience of using routinehub.co
// @icon        https://s3.us-west-002.backblazeb2.com/routinehub/static/icon/apple-touch-icon-76x76.png
// @namespace   https://github.com/atnbueno/userscripts
// @supportURL  https://github.com/atnbueno/userscripts/issues
// @match       https://routinehub.co/*
// @grant       GM_addStyle
// ==/UserScript==

(function () {
  "use strict";

  if (typeof GM_addStyle == 'undefined') {
    var GM_addStyle = (CSS) => {
      'use strict';
      let head = document.getElementsByTagName('head')[0];
      if (head) {
        let style = document.createElement('style');
        style.setAttribute('type', 'text/css');
        style.textContent = CSS;
        head.appendChild(style);
        return style;
      }
      return null;
    };
  }

  document.addEventListener("DOMContentLoaded", function(event) {

    // Adds retina version of images if they are available
    document.querySelectorAll('.content img').forEach(image => {
      image.onerror = () => image.removeAttribute('srcset');
      image.setAttribute('srcset', image.src.replace(/^(.+?)\.(gif|jpe?g|png|webp).*$/g, "$1.$2, $1_2x.$2 2x"));
    });

    // Adjusts the homepage carousel size
    GM_addStyle(''+`
      #carousel, .slick-slide {
        margin: 0 auto;
        max-width: 660px;
      }
    `);

  });
})();
