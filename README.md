# Interactive Photo Gallery

A small **HTML, CSS, and JavaScript** gallery exercise with pointer, keyboard, and native-button selection interactions.

## Source files

- [Calm](Calm)
- [Interactive-Photo-Gallery](Interactive-Photo-Gallery)

Both extensionless files contain gallery HTML, embedded styling, and JavaScript. They currently present the same gallery implementation.

## Behavior

Six image thumbnails load from Pexels. Hovering or focusing a thumbnail previews it. Clicking, tapping, or activating its button with Enter or Space keeps it selected. Clear selection resets the preview and selection state.

Each thumbnail is a native button with an accessible name supplied by its image alt text and an `aria-pressed` state. A visible caption in a polite, atomic live region describes the preview. The preview image has empty alt text to avoid repeating that caption.

## View locally

Download either source file, save a local copy with an `.html` extension, and open that copy in a browser. Internet access is required for the externally hosted images.

## Limitations

The repository has no `index.html` entry point. Save a local copy as HTML as described above. External image availability and the accuracy of the existing alt descriptions have not been independently verified. This project does not claim accessibility conformance.

## Interaction flow

The [gallery source](Interactive-Photo-Gallery) registers listeners in `initGallery()` after the page markup is parsed. Both supported source files are kept identical by a regression test.

| Event | Handler | Result in the source |
| :--- | :--- | :--- |
| mouseenter or focus | render(button) | Previews that button's image and writes its caption as text. |
| mouseleave or blur | restorePreview() | Falls back to a still-hovered button, a focused button, or the selected button, in that order. |
| click / native keyboard activation | Selection handler | Keeps one button selected and updates `aria-pressed`. |
| Clear selection | Clear handler | Clears all preview/selection state and moves focus to the clear button. |

Hover, focus, and selection are tracked separately. Leaving a hovered thumbnail restores any keyboard-focused preview instead of blanking it. A selected image persists after transient hover and focus end. Captions use `textContent`, so image descriptions are not interpreted as HTML.

## Accessibility and layout review notes

These are implementation details and remaining verification limits, not a conformance assessment.

- The preview is bounded to 100% of its container and at most 400px wide, with border-box sizing and a 4:3 media area. Thumbnail rows wrap.
- Native buttons retain a visible focus outline. The previous scale animation was removed to avoid overlapping adjacent thumbnails.
- Captions sit below the image on a solid background. Screen-reader announcement timing still requires testing with assistive technology.
- Instructions include hover, focus, click, tap, and keyboard activation. Real touch-device behavior, zoom, and narrow-screen rendering still require browser verification.

Any future verification report should identify the source file and commit, browser, viewport, input method, assistive technology if used, steps, and observed result. Keep observations separate from proposed fixes.

## Regression tests

Use Node.js 22 or later:

```sh
npm ci
npm test
```

Thirteen Node tests use jsdom to execute the actual inline script in both source files. They cover named native buttons, mixed hover/focus transitions, persistent exclusive selection, clearing, safe text captions, live-region attributes, and source-file parity. The suite was run with Node.js 24.

jsdom does not render layout, synthesize native keyboard activation, load the remote photos, or emulate a screen reader. Passing these tests does not establish browser compatibility or accessibility conformance.
