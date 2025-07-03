// ==UserScript==
// @name          Feedback Assistant Helper
// @namespace     https://github.com/atnbueno/userscripts
// @version       1.1
// @description   Adds a download link with full metadata to Apple Feedback Assistant reports, including form details, follow-ups, and resolution status
// @author        Antonio Bueno
// @license       MIT

// @match         https://feedbackassistant.apple.com/*
// @icon          https://feedbackassistant.apple.com/apple-touch-icon.png
// @require       https://github.com/atnbueno/userscripts/raw/refs/heads/main/components/simple-toast.min.js
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

  toast("Waiting for the page to load...", "wait", 3);
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

    toast("Requesting feedback details...", "wait", 3);

    try {
      // Fetch the main metadata about the report
      const details = await fetchJson(`https://appleseed.apple.com/sp/feedback/feedback_details/feedback/${id}?locale=en`);

      // Fetch the full form response using the associated form_response_id
      toast("Requesting submission details...", "wait");
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

          toast("JSON link added at the top", "success");
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
