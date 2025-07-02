// ==UserScript==
// @name          Feedback Assistant Helper
// @namespace     https://userscripts.atnbueno.com
// @version       1.0
// @description   Adds a download link with full metadata to Apple Feedback Assistant reports, including form details, follow-ups, and resolution status
// @author        Antonio Bueno
// @license       MIT

// @match         https://feedbackassistant.apple.com/*
// @icon          https://feedbackassistant.apple.com/apple-touch-icon.png
// @downloadURL   https://github.com/atnbueno/userscripts/raw/refs/heads/main/feedback-assistant-helper.user.js
// @updateURL     https://github.com/atnbueno/userscripts/raw/refs/heads/main/feedback-assistant-helper.user.js
// @supportURL    https://github.com/atnbueno/userscripts/issues
// @homepageURL   https://github.com/atnbueno/userscripts

// @grant         GM.addStyle
// @grant         GM.xmlHttpRequest
// @run-at        document-end
// ==/UserScript==


(function () {
  "use strict";

  /* "Simple Toast" web component begins here */
  class SimpleToast extends HTMLElement{constructor(){super();this.attachShadow({mode:"open"})}
  connectedCallback(){const type=this.getAttribute("type")||"info";const message=this.getAttribute("message")||"";const icons={warning:"⚠️",error:"🛑",success:"✅",info:"ℹ️"};const colors={warning:"#CC9900AA",error:"#E9152DAA",success:"#008932AA",info:"#1E6EF4AA"};const icon=icons[type]||icons.info;const color=colors[type]||colors.info
  this.shadowRoot.innerHTML=`<style>:host{--fade-duration:0.3s}div{background:${color};color:#fff;padding:1rem 1.3rem;border-radius:1.6rem;font-family:system-ui,sans-serif;box-shadow:0 .2rem .4rem rgb(0 0 0 / .3);user-select:none;margin-top:.5rem;cursor:default;word-break:break-word;opacity:1;transition:opacity var(--fade-duration) ease}.hide{opacity:0;transition:opacity var(--fade-duration) ease}</style><div>${icon} ${message}</div>`}}
  customElements.define("simple-toast",SimpleToast)

  class ToastContainer extends HTMLElement{constructor(){super();this.attachShadow({mode:"open"})
  this.shadowRoot.innerHTML="<style>:host{position:fixed;bottom:1.5rem;right:1.5rem;display:flex;flex-direction:column;align-items:flex-end;gap:.5rem;max-width:calc(100vw - 3rem);z-index:99;pointer-events:none;transform:translateY(100%);transition:transform 0.3s ease}:host(.visible){transform:translateY(0);pointer-events:auto}</style><slot></slot>"}showToast(message,type="info",duration=5000){const toast=document.createElement("simple-toast");toast.setAttribute("message",message);toast.setAttribute("type",type);this.shadowRoot.appendChild(toast);this.classList.add("visible");const toastDiv=toast.shadowRoot.querySelector("div");const style=getComputedStyle(toastDiv);const fadeDurationStr=style.getPropertyValue("--fade-duration").trim()||"0.5s";let fadeDurationMs=parseFloat(fadeDurationStr);if(fadeDurationStr.endsWith("s")){fadeDurationMs=parseFloat(fadeDurationStr)*1000}setTimeout(()=>{toastDiv.classList.add("hide");toastDiv.addEventListener("transitionend",()=>{toast.remove();if(this.shadowRoot.children.length===1){this.classList.remove("visible")}},{once:!0})},duration-fadeDurationMs)}}
  customElements.define("toast-container",ToastContainer)
  
  function toast(message,type="info",timeout=5){let container=document.querySelector("toast-container");if(!container){container=document.createElement("toast-container");document.body.appendChild(container)}container.showToast(message,type,timeout*1000)}
  window.toast=toast
  /* End of "Simple Toast" web component */

  toast("Waiting for the page to load...");
  observeUrlChanges();

  if (/\/feedback\/\d+$/.test(location.pathname)) {
    waitForElement("article", runScript);
  }

  // Main script logic, triggered when a valid feedback report page is detected
  async function runScript() {
    const url = new URL(location.href);
    const pathParts = url.pathname.split("/");
    const id = pathParts.pop();
    const section = pathParts.pop();

    // Exit early if we're not on a numeric feedback report page
    if (section !== "feedback" || !/^\d+$/.test(id)) return;

    toast("Requesting feedback details...");

    try {
      // Fetch the main metadata about the report
      const details = await fetchJson(`https://appleseed.apple.com/sp/feedback/feedback_details/feedback/${id}?locale=en`);

      // Fetch the full form response using the associated form_response_id
      toast("Requesting form response details...");
      const form_response = await fetchJson(`https://appleseed.apple.com/sp/feedback/form_response_details/${details.form_response_id}?locale=en`);

      // Fetch all available follow-up entries in order
      let followups = [];
      if (Array.isArray(details.feedback_followup_ids)) {
        const sortedIds = [...details.feedback_followup_ids].sort(); // Clone and sort
        const followupPromises = sortedIds.map(fid =>
          fetchJson(`https://beta.apple.com/sp/feedback/feedback_followup/${fid}?locale=en`)
            .then(data => ({ id: fid, ...data })) // attach ID to each result
            .catch(err => {
              toast(`Failed to fetch follow-up ${fid}`, "warning");
              return null;
            })
        );
      
        const results = await Promise.all(followupPromises);
        followups = results.filter(Boolean); // remove nulls
      }

      // Fetch resolution status (may include internal Apple review notes)
      let status = null;
      try {
        status = await fetchJson(`https://beta.apple.com/sp/feedback/${id}/status?locale=en`);
      } catch (err) {
        status = {};
      }

      // Combine all data into a single object for export
      const combined = {
        id: Number(id),
        details,
        form_response,
        followups,
        status,
      };

      // Find the matching <div> in the <article> and either update or inject a download link
      document.querySelectorAll("article div").forEach((div) => {
        if (
          div.childNodes.length === 1 &&
          div.childNodes[0].nodeType === Node.TEXT_NODE &&
          div.textContent.endsWith(`FB${id}`)
        ) {
          const jsonString = JSON.stringify(combined, null, 2);
          const url = "data:application/json," + encodeURIComponent(jsonString);

          let link = div.querySelector("#downloadable-report");
          if (link) {
            // Update existing link
            link.href = url;
          } else {
            // Insert new link
            link = document.createElement("a");
            link.download = `FB${id}.json`;
            link.href = url;
            link.id = "downloadable-report";
            link.textContent = `FB${id}`;
            link.title = "Download full report as JSON";
            div.innerHTML = div.innerHTML.replace(`FB${id}`, link.outerHTML);
          }

          toast("Full JSON report linked", "success");
        }
      });
    } catch (err) {
      // Catch any unexpected failure in the main flow
      toast("Script failed", "error");
    }
  }

  // Generic helper that performs a GET request and parses JSON response
  function fetchJson(url) {
    return new Promise((resolve, reject) => {
      GM.xmlHttpRequest({
        method: "GET",
        url,
        onload: (res) => {
          try {
            resolve(JSON.parse(res.responseText));
          } catch (err) {
            reject(err);
          }
        },
        onerror: reject,
      });
    });
  }

  // Wait until a DOM element matching the selector appears, then run the callback
  function waitForElement(selector, callback) {
    const el = document.querySelector(selector);
    if (el) return callback(el);
    const observer = new MutationObserver(() => {
      const el = document.querySelector(selector);
      if (el) {
        observer.disconnect();
        callback(el);
      }
    });
    const root = document.getElementById("root");
    if (root) observer.observe(root, { childList: true, subtree: true });
  }

  // Watch for internal navigation (React SPA) and re-run script on report pages
  function observeUrlChanges() {
    let currentUrl = location.href;
    const observer = new MutationObserver(() => {
      if (location.href !== currentUrl) {
        currentUrl = location.href;
        if (/\/feedback\/\d+$/.test(location.pathname)) {
          toast("New report loading...", "info", 2);
          waitForElement("article", runScript);
        }
      }
    });
    observer.observe(document.body, { childList: true, subtree: true });
  }

  // Style the download link and fix overflow bugs
  GM.addStyle("#downloadable-report {font-weight: bold} #root>div>div, #root p {overflow: inherit}");
})();
