// ==UserScript==
// @name        RoutineHub tweaks
// @version     2.8
// @license     MIT
// @author      https://github.com/atnbueno
// @description Experiments in improving the UX of using routinehub.co
// @icon        https://s3.us-west-002.backblazeb2.com/routinehub/static/icon/apple-touch-icon-76x76.png
// @namespace   https://github.com/atnbueno/userscripts
// @supportURL  https://github.com/atnbueno/userscripts/issues
// @match       https://routinehub.co/*
// @match       https://www.routinehub.co/*
// @match       https://routinehub.co/user/*
// @run-at      document-start
// @grant       GM.addStyle
// ==/UserScript==

(function () {
  "use strict";

  document.addEventListener("DOMContentLoaded", function(event) {

    // Replace the icon of sidebar links to mastodon.social)
    const links = document.querySelectorAll('.sidebar a');
    links.forEach(link => {
      if (link.href.includes('mastodon.social')) {
        link.innerHTML = '<span class="fa-stack fa-lg"><i class="fas fa-square fa-stack-2x"></i><i class="fa-brands fa-mastodon fa-stack-1x fa-inverse"></i></span></a>';
      }
    });

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

    // Toggles the logged-in dropdown menu when hovering over the gear icon
    const dropdown = document.querySelector(".navbar-menu .dropdown");
    if (dropdown) {
    const dropdownMenu = dropdown.querySelector(".dropdown-menu");
      dropdown.addEventListener("mouseenter", function() {
        dropdownMenu.style.display = "block";
      });
      dropdown.addEventListener("mouseleave", function() {
        dropdownMenu.style.display = "none";
      });
    }

    // Pre-selects the first item in any release drop-down
    const releaseSelect = document.getElementById('id_ios_release');
    if (releaseSelect) {
      releaseSelect.options[0].setAttribute('selected', 'true');
      Array.from(releaseSelect.options).slice(1).forEach(option => option.removeAttribute('selected'));
    }

    const qrCodeImage = document.querySelector(".qr-code img");
    qrCodeImage.src += "&ecc=M&margin=0&size=527x527&qzone=1";
    qrCodeImage.insertAdjacentHTML("afterend", '<img src="data:image/png;base64,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">');

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
      margin-right: 0.75rem;
    }`+
    // Avoids button overflowing horizontally in version histories
    `.button.is-fullwidth {
      width: auto;
    }`+
    // Fixes layout shifting because of ads
    `#ads {
      width: 310px;
      height: 256px;
    }`+
    // Wraps code
    `div.content pre {
      white-space: pre-line;
    }`+
    // QR code overlay
    `.qr-code {
      position: relative;
    }
    .qr-code img {
      transform: scale(1) !important;
    }
    .qr-code p+img {
      position: absolute;
    }
    .qr-code-overlay {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 50%; /* Adjust size as needed */
      height: auto; /* Maintain aspect ratio */
    }`);

  });
})();
