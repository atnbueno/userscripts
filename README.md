# atnbueno/userscripts

A collection of userscripts, designed to enhance websites with small, focused customizations. These scripts are compatible with modern userscript managers like [Violentmonkey](https://violentmonkey.github.io/), and the [Userscripts](https://apps.apple.com/app/userscripts/id1463298887) extension on macOS/iOS/iPadOS.

---

## Available Scripts

### Feedback Assistant Helper

**Enhances the web version of the [Apple Feedback Assistant](https://feedbackassistant.apple.com/)** by converting the feedback ID (e.g., `FB12345678`) at the top of the report into a link that lets you download full report data (as JSON), including:

- Report details
- Form response data
- Follow-ups
- Resolution status (if available)

It also provides on-page notifications for progress and errors, and handles dynamic navigation automatically.

**Note:** Due to macOS Safari security restrictions this userscript doesn't work, but it will work with any other browser that supports the **Violentmonkey** extension (see below)

This userscript pairs well with this shortcut that converts JSON reports into Markdown using a customizable template:  
<https://routinehub.co/shortcut/14347/>

👉🏼 **[Install "Feedback Assistant Helper"](https://github.com/atnbueno/userscripts/raw/refs/heads/main/feedback-assistant-helper.user.js)** 👈🏼

---

### RoutineHub Tweaks

**Improves the UI/UX of [RoutineHub.co](https://routinehub.co)**. See the scripts comments for additional details.

**[Install "RoutineHub Tweaks"](https://github.com/atnbueno/userscripts/raw/refs/heads/main/routinehub-tweaks.user.js)**

---

## Compatibility

These scripts are tested and confirmed to work with:

- [Violentmonkey](https://violentmonkey.github.io/) (Firefox, Chromium)
- [Userscripts](https://apps.apple.com/app/userscripts/id1463298887) (iOS, iPadOS, macOS)

---

## How to Install

### For desktop PC browsers (Firefox, Chromium-based)

1. Install [Violentmonkey](https://violentmonkey.github.io/).
2. Click the install link for the script.
3. Review and confirm the installation when prompted.

### For Safari (macOS, iOS, iPadOS)

1. Install the [Userscripts](https://apps.apple.com/app/userscripts/id1463298887) Safari extension from the App Store.
2. Enable it in Safari settings and grant access to the sites you want.
3. Open the script’s install link in Safari ("Raw" file).
4. "Tap to install" in the extension icon in Safari (the blue `</>`).
5. Refresh the page or enable the script from the Userscripts extension menu if needed.

---

## Support or Issues

If something doesn’t work, or if you’d like to request a feature, open an issue in [this repo's *Issues* section](https://github.com/atnbueno/userscripts/issues)

---

## License

All scripts in this repo are published under the [MIT License](LICENSE).

