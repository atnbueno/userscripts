// simple-toast.js
// A minimal custom element for displaying toast notifications.
//
// Author: Antonio Bueno
// License: MIT
// Created: 2025-06-26
// Updated: 2025-07-03
// Part of: https://github.com/atnbueno/userscripts

// Define the <simple-toast> custom element
class SimpleToast extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" }); // Attach a shadow DOM for encapsulation
  }

  connectedCallback() {
    // Get the type and message from element attributes
    const type = this.getAttribute("type") || "info";
    const message = this.getAttribute("message") || "";

    // SVG icons for different toast types
    const icons = {
      error: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 90 81"><path d="M15 0A15 15 0 000 15v36a15 15 0 0015 15h6v12a3 3 0 003 3 3 3 0 002.121-.879L40.242 66H75a15 15 0 0015-15V15A15 15 0 0075 0H15zm17.271 17.271a3 3 0 012.122.88L45 28.757 55.607 18.15a3 3 0 014.243 0 3 3 0 010 4.243L49.242 33 59.85 43.607a3 3 0 010 4.243 3 3 0 01-4.243 0L45 37.242 34.393 47.85a3 3 0 01-4.243 0 3 3 0 010-4.243L40.758 33 30.15 22.393a3 3 0 010-4.243 3 3 0 012.121-.879z" fill="#ffffff"/></svg>`,
      info: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 90 81"><path d="M15 0A15 15 0 000 15v36a15 15 0 0015 15h6v12a3 3 0 003 3 3 3 0 002.121-.879L40.242 66H75a15 15 0 0015-15V15A15 15 0 0075 0H15zm30 12a4.5 4.5 0 014.5 4.5A4.5 4.5 0 0145 21a4.5 4.5 0 01-4.5-4.5A4.5 4.5 0 0145 12zm-6 15h7.5a3 3 0 013 3v18H54a3 3 0 013 3 3 3 0 01-3 3H39a3 3 0 01-3-3 3 3 0 013-3h4.5V33H39a3 3 0 01-3-3 3 3 0 013-3z" fill="#ffffff"/></svg>`,
      success: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 90 81"><path d="M15 0A15 15 0 000 15v36a15 15 0 0015 15h6v12a3 3 0 003 3 3 3 0 002.121-.879L40.242 66H75a15 15 0 0015-15V15A15 15 0 0075 0H15zm45 15a3 3 0 013 3 3 3 0 01-.428 1.545l-17.9 29.818a3 3 0 01-.074.123l-.04.067A3 3 0 0142 51a3 3 0 01-2.098-.86l-.002.003-.052-.053L27.91 38.152l-.031-.03.002-.003A3 3 0 0127 36a3 3 0 013-3 3 3 0 012.12.88l.001-.001.031.031 9.248 9.248 16.028-26.703A3 3 0 0160 15z" fill="#ffffff"/></svg>`,
      wait: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 90 81"><path d="M15 0A15 15 0 000 15v36a15 15 0 0015 15h6v12a3 3 0 003 3 3 3 0 002.121-.879L40.242 66H75a15 15 0 0015-15V15A15 15 0 0075 0H15zm9 27a6 6 0 016 6 6 6 0 01-6 6 6 6 0 01-6-6 6 6 0 016-6zm21 0a6 6 0 016 6 6 6 0 01-6 6 6 6 0 01-6-6 6 6 0 016-6zm21 0a6 6 0 016 6 6 6 0 01-6 6 6 6 0 01-6-6 6 6 0 016-6z" fill="#ffffff"/></svg>`,
      warning: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 90 81"><path d="M15 0A15 15 0 000 15v36a15 15 0 0015 15h6v12a3 3 0 003 3 3 3 0 002.121-.879L40.242 66H75a15 15 0 0015-15V15A15 15 0 0075 0H15zm30 12a4.5 4.5 0 014.5 4.5 4.5 4.5 0 01-.004.184h.004L48 37.664h-.004A3 3 0 0145 40.5a3 3 0 01-2.996-2.84H42l-1.5-20.976h.004a4.5 4.5 0 01-.004-.184A4.5 4.5 0 0145 12zm0 33a4.5 4.5 0 014.5 4.5A4.5 4.5 0 0145 54a4.5 4.5 0 01-4.5-4.5A4.5 4.5 0 0145 45z" fill="#ffffff"/></svg>`
    };

    // Background colors per toast type
    const colors = {
      error: "rgba(255, 59, 48, 0.8)",
      info: "rgba(0, 122, 255, 0.8)",
      success: "rgba(52, 199, 89, 0.8)",
      wait: "rgba(142, 142, 147, 0.8)",
      warning: "rgba(255, 149, 0, 0.8)"
    };

    // Fallback to "info" icon/color if type is invalid
    const icon = icons[type] || icons.info;
    const color = colors[type] || colors.info;

    // Base styles and layout for toasts
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          --fade-duration: 0.3s;
        }

        div {
          display: flex;
          align-items: center;
          gap: 0.5rem;

          margin-top: 0.5rem;
          padding: 1rem 1.3rem;
          border-radius: 2rem;

          background: ${color};
          color: white;
          box-shadow: 0 0.2rem 0.4rem rgba(0, 0, 0, 0.3);

          font-family: system-ui, sans-serif;
          word-break: break-word;

          opacity: 1;
          transition: opacity var(--fade-duration) ease;

          user-select: none;
          cursor: default;
        }

        svg {
          width: 2rem;
        }

        .hide {
          opacity: 0;
          transition: opacity var(--fade-duration) ease;
        }
      </style>
      <div>${icon} ${message}</div>
    `;
  }
}

// Register the <simple-toast> element
customElements.define("simple-toast", SimpleToast);

// Define the <toast-container> custom element to hold toasts
class ToastContainer extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });

    // Base styles and layout for toast container
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          position: fixed;
          bottom: 1.5rem;
          right: 1.5rem;
          z-index: 99;

          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 0.5rem;
          max-width: calc(100vw - 3rem);

          pointer-events: none;

          transform: translateY(100%);
          transition: transform 0.3s ease;
        }

        :host(.visible) {
          transform: translateY(0);
          pointer-events: auto;
        }
      </style>
      <slot></slot>
    `;
  }

  // Add the toast to the container
  showToast(message, type = "info", duration = 5000) {
    const toast = document.createElement("simple-toast");
    toast.setAttribute("message", message);
    toast.setAttribute("type", type);
    
    // Add the toast to the container
    this.shadowRoot.appendChild(toast);
    this.classList.add("visible");

    // Read fade duration from CSS variable
    const toastDiv = toast.shadowRoot.querySelector("div");
    const style = getComputedStyle(toastDiv);
    const fadeDurationStr = style.getPropertyValue("--fade-duration").trim() || "0.5s";

    // Convert fade duration string to milliseconds
    let fadeDurationMs = parseFloat(fadeDurationStr);
    if (fadeDurationStr.endsWith("s")) {
      fadeDurationMs = parseFloat(fadeDurationStr) * 1000;
    }

    // Schedule the toast to fade out
    setTimeout(() => {
      toastDiv.classList.add("hide");

      // Remove toast after fade transition ends
      toastDiv.addEventListener(
        "transitionend",
        () => {
          toast.remove();

          // Hide container if no more toasts
          if (this.shadowRoot.children.length === 1) {
            this.classList.remove("visible");
          }
        },
        { once: true }
      );
    }, duration - fadeDurationMs);
  }
}

// Register the <toast-container> element
customElements.define("toast-container", ToastContainer);

// Global helper function to show a toast
function toast(message, type = "info", timeout = 5) {
  let container = document.querySelector("toast-container");

  // If no container exists, create one and add to body
  if (!container) {
    container = document.createElement("toast-container");
    document.body.appendChild(container);
  }

  // Show the toast using the container's method
  container.showToast(message, type, timeout * 1000);
}

// Expose global toast function
window.toast = toast;
