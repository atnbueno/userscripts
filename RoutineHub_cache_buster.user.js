// ==UserScript==
// @name        RoutineHub cache buster
// @version     1.2.0
// @license     MIT
// @author      https://github.com/atnbueno
// @description A simple tweak to the internal links of routinehub.co to work around its caching issues
// @icon        https://s3.us-west-002.backblazeb2.com/routinehub/static/icon/apple-touch-icon-76x76.png
// @namespace   https://github.com/atnbueno/userscripts
// @supportURL  https://github.com/atnbueno/userscripts/issues
// @match       https://routinehub.co/*
// ==/UserScript==

// v1.1.0: jQuery dependency removed, code simplified, and metadata added
// v1.2.0: Timestamp resolution changed to 30 seconds, and timestamp now hashed with the cookies using SHA-256

async function sha256(message) {
  const crypto = window.crypto.subtle;
  const encoder = new TextEncoder();
  const data = encoder.encode(message);
  try {
    const hash = await crypto.digest('SHA-256', data);
    return btoa(String.fromCharCode(...new Uint8Array(hash)));
  } catch (error) {
    console.error(error);
  }
}

(async () => {
  const cacheBuster = await sha256(Math.floor(Date.now() / 30000) + document.cookie);
  document.addEventListener('DOMContentLoaded', () => document
    .querySelectorAll('a:not([href^="http"]):not([href*="?"])')
    .forEach(link => link.setAttribute('href',
      `${link.getAttribute('href')}?${cacheBuster}`)));
})();
