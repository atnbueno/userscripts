// ==UserScript==
// @name        RoutineHub tweaks
// @version     2.0
// @license     MIT
// @author      https://github.com/atnbueno
// @description Experiments in improving the experience of using routinehub.co
// @icon        https://s3.us-west-002.backblazeb2.com/routinehub/static/icon/apple-touch-icon-76x76.png
// @namespace   https://github.com/atnbueno/userscripts
// @supportURL  https://github.com/atnbueno/userscripts/issues
// @match       https://routinehub.co/*
// ==/UserScript==

(function () {
  "use strict";
  document.addEventListener("DOMContentLoaded", function(event) {

    // Adds retina version of images if they are available
    document.querySelectorAll('.content img').forEach(image => {
      image.onerror = () => image.removeAttribute('srcset');
      image.setAttribute('srcset', image.src.replace(/^(.+?)\.(gif|jpe?g|png|webp).*$/g, "$1.$2, $1_2x.$2 2x"));
    });

  });
})();
