# Interactive Photo Gallery

A small **HTML, CSS, and JavaScript** gallery exercise with mouse-hover and keyboard-focus interactions.

## Source files

- [Calm](Calm)
- [Interactive-Photo-Gallery](Interactive-Photo-Gallery)

Both extensionless files contain gallery HTML, embedded styling, and JavaScript. They currently present the same gallery implementation.

## Behavior

Six image thumbnails load from Pexels. Hovering over or focusing a thumbnail updates a larger preview and its caption. Moving the pointer away or removing focus resets the preview. The images include alt text and keyboard tab stops.

## View locally

Download either source file, save a local copy with an `.html` extension, and open that copy in a browser. Internet access is required for the externally hosted images.

## Limitations

The repository has no `index.html` entry point. Keyboard-focus support is present in the source, but this is not a claim of verified accessibility compliance. Runtime, mobile layout, and external image availability have not been tested as part of this documentation update.

## Interaction flow

The [gallery source](Interactive-Photo-Gallery) registers its event listeners in `initGallery()` when the body loads.

| Event | Handler | Result in the source |
| :--- | :--- | :--- |
| mouseover or focus | upDate(previewPic) | Copies the thumbnail URL into the preview background and its alt text into the preview caption. |
| mouseleave or blur | unDo() | Clears the background and restores the initial instruction. |

There is no separate selected-image state. Each event updates or clears the same preview immediately. For example, moving the pointer away from a keyboard-focused thumbnail can clear the preview even while focus remains there. This is inferred from the handlers, not a recorded browser test.

## Accessibility and layout review notes

These observations describe the current source and identify future verification work; they are not a conformance assessment.

- The preview has a fixed 400px width plus borders, and the body adds 20px padding. On narrow viewports this can exceed the available width even though the thumbnail row wraps. Verify horizontal overflow before presenting the gallery as mobile-ready.
- Thumbnail focus changes the border to blue and applies a scale transform; the default outline is disabled. Verify focus visibility, contrast, and overlap at zoomed sizes.
- The preview is a CSS background with a text caption. No live-region attribute is present, so screen-reader announcement of caption changes needs explicit testing. The presence of thumbnail alt text alone does not establish the preview's accessibility.
- The instruction mentions hover only, while focus handlers also exist. Touch interaction and the combination of mouse and keyboard input require separate checks.
- Image URLs are external. Availability and whether each written alt description accurately matches the current image have not been verified.

Any future verification report should identify the source file and commit, browser, viewport, input method, assistive technology if used, steps, and observed result. Keep observations separate from proposed fixes.
