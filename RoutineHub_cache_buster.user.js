// ==UserScript==
// @name        RoutineHub cache buster
// @version     1.1.0
// @license     MIT
// @author      https://github.com/atnbueno
// @description A simple tweak to the internal links of routinehub.co to work around its caching issues
// @icon        https://s3.us-west-002.backblazeb2.com/routinehub/static/icon/apple-touch-icon-76x76.png
// @namespace   https://github.com/atnbueno/userscripts
// @supportURL  https://github.com/atnbueno/userscripts/issues
// @match       https://routinehub.co/*
// ==/UserScript==

// v1.1.0: jQuery dependency removed, code simplified, and metadata added

const timestamp = Math.floor(Date.now() / 1000);
document.addEventListener('DOMContentLoaded', () => document
  .querySelectorAll('a:not([href^="http"]):not([href*="?"])')
  .forEach(link => link.setAttribute('href',
    `${link.getAttribute('href')}?${timestamp}`)));
