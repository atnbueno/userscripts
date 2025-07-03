# `components/`

This folder contains standalone web components that I use in my userscripts. Each component is:

* **Self-contained** (single-file)
* **Dependency-free**
* **Userscript-friendly**, via `@require` headers

---

## `simple-toast.js`

A lightweight, modular component system for displaying toast notifications. It defines a public `toast()` function that's very easy to use:

```js
toast(message, type="info", timeout=5)
```

### Usage in userscripts

Include via `@require`:

```js
// @require  https://raw.githubusercontent.com/atnbueno/userscripts/main/components/simple-toast.js
```

Examples of calls to `toast()`:

```js
toast("Saved successfully!");
toast("Error submitting form", "error");
toast("Updated", "success", 2);
```

Arguments:

* **Message**: Text content
* **Type**: `info` (default), `success`, `warning`, `error`, `wait`
* **Timeout**: Seconds before auto-dismiss (default: 5s)

### Under the hood

* The `toast()` function ensures a `<toast-container>` exists, then delegates to `container.showToast(...)`.
* The container creates individual `<simple-toast>` elements and manages their lifecycle (display, fade-out, and removal).
* Each toast uses Shadow DOM for internal structure and encapsulated styling.

This component is ideal for showing lightweight, non-blocking messages in userscripts — especially where native `alert()` or console logging isn't user-friendly.
