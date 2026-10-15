const assert = require('node:assert/strict');
const { test } = require('node:test');
const { readFileSync } = require('node:fs');
const { join } = require('node:path');
const { JSDOM } = require('jsdom');

for (const file of ['Calm', 'Interactive-Photo-Gallery']) {
  async function page(t) {
    const dom = new JSDOM(readFileSync(join(__dirname, '..', file), 'utf8'), {
      runScripts: 'dangerously', url: 'https://gallery.test/'
    });
    t.after(() => dom.window.close());
    await new Promise(resolve => dom.window.addEventListener('load', resolve, { once: true }));
    const doc = dom.window.document;
    const buttons = [...doc.querySelectorAll('.thumbnail')];
    const fire = (element, event) => element.dispatchEvent(new dom.window.MouseEvent(event));
    return { doc, buttons, fire };
  }

  test(`${file}: thumbnails are named native buttons`, async t => {
    const { buttons } = await page(t);
    assert.equal(buttons.length, 6);
    for (const button of buttons) {
      assert.equal(button.tagName, 'BUTTON');
      assert.equal(button.type, 'button');
      assert.ok(button.querySelector('img').alt);
      assert.equal(button.getAttribute('aria-pressed'), 'false');
    }
  });

  test(`${file}: mouse leave restores keyboard-focused preview`, async t => {
    const { doc, buttons, fire } = await page(t);
    buttons[0].focus();
    fire(buttons[1], 'mouseenter');
    assert.equal(doc.querySelector('#caption').textContent, buttons[1].querySelector('img').alt);
    fire(buttons[1], 'mouseleave');
    assert.equal(doc.querySelector('#caption').textContent, buttons[0].querySelector('img').alt);
  });

  test(`${file}: blur preserves hovered preview and leaving clears it`, async t => {
    const { doc, buttons, fire } = await page(t);
    fire(buttons[0], 'mouseenter');
    buttons[1].focus();
    buttons[1].blur();
    assert.equal(doc.querySelector('#caption').textContent, buttons[0].querySelector('img').alt);
    fire(buttons[0], 'mouseleave');
    assert.equal(doc.querySelector('#preview').hidden, true);
    assert.match(doc.querySelector('#caption').textContent, /Hover, focus, or select/);
  });

  test(`${file}: activation persists a single selected image`, async t => {
    const { doc, buttons, fire } = await page(t);
    buttons[0].click();
    buttons[1].focus();
    buttons[1].blur();
    fire(buttons[1], 'mouseleave');
    assert.equal(doc.querySelector('#preview').src, buttons[0].querySelector('img').src);
    buttons[2].click();
    assert.equal(buttons[0].getAttribute('aria-pressed'), 'false');
    assert.equal(buttons[2].getAttribute('aria-pressed'), 'true');
    assert.equal(doc.querySelectorAll('[aria-pressed="true"]').length, 1);
  });

  test(`${file}: clear selection restores empty preview`, async t => {
    const { doc, buttons } = await page(t);
    buttons[0].focus();
    buttons[0].click();
    doc.querySelector('#clear-selection').click();
    assert.equal(doc.querySelector('#preview').hidden, true);
    assert.equal(doc.querySelectorAll('[aria-pressed="true"]').length, 0);
  });

  test(`${file}: captions are text, in a polite live region`, async t => {
    const { doc, buttons } = await page(t);
    buttons[0].querySelector('img').alt = '<b>Plain text</b>';
    buttons[0].click();
    const caption = doc.querySelector('#caption');
    assert.equal(caption.textContent, '<b>Plain text</b>');
    assert.equal(caption.querySelector('b'), null);
    assert.equal(caption.getAttribute('aria-live'), 'polite');
    assert.equal(caption.getAttribute('aria-atomic'), 'true');
  });
}

test('both supported source files stay identical', () => {
  assert.equal(readFileSync(join(__dirname, '..', 'Calm'), 'utf8'),
    readFileSync(join(__dirname, '..', 'Interactive-Photo-Gallery'), 'utf8'));
});
