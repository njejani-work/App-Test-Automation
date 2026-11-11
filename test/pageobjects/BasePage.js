// Base class + selector helpers for the Wikipedia Android app (UiAutomator2).
//
// Locator strategy, best first:
//   1. resource-id   - the app is mostly native Android views with stable ids. We match the
//                      END of the id (".*:id/search_container") because the package part
//                      changes per flavour (org.wikipedia.dev / org.wikipedia.alpha / org.wikipedia).
//   2. visible text  - for Jetpack Compose screens (search results, Home feed), which have
//                      no resource-ids. Tests assume the device language is English.
//   3. XPath         - not used: slow and breaks when layouts change.

const q = (s) => JSON.stringify(String(s));

/** Selector builders (strings usable with $ / $$). */
export const S = {
  id: (name) => `android=new UiSelector().resourceIdMatches(${q(`.*:id/${name}`)})`,
  text: (s) => `android=new UiSelector().text(${q(s)})`,
  textContains: (s) => `android=new UiSelector().textContains(${q(s)})`,
  desc: (s) => `android=new UiSelector().description(${q(s)})`,
  descContains: (s) => `android=new UiSelector().descriptionContains(${q(s)})`,
  cls: (cls) => `android=new UiSelector().className(${q(cls)})`,
  /** A TextView whose text contains s (skips the search box itself, which is an EditText). */
  textViewContains: (s) => `android=new UiSelector().className("android.widget.TextView").textContains(${q(s)})`,
};

export default class BasePage {
  /** Selectors that identify the screen; any one of them displayed = the screen is open. */
  get anchors() {
    return [];
  }

  get name() {
    return this.constructor.name;
  }

  async isOpen(timeout = 0) {
    try {
      await driver.waitUntil(() => this.anyDisplayed(this.anchors), { timeout: Math.max(timeout, 1), interval: 300 });
      return true;
    } catch {
      return false;
    }
  }

  async waitForOpen(timeout = 20000) {
    await driver.waitUntil(() => this.anyDisplayed(this.anchors), {
      timeout,
      interval: 300,
      timeoutMsg: `${this.name} did not open within ${timeout} ms`,
    });
    return this;
  }

  /** True if any of the selectors is on screen right now. */
  async anyDisplayed(selectors) {
    for (const sel of selectors) {
      const el = await $(sel);
      if ((await el.isExisting()) && (await el.isDisplayed())) return true;
    }
    return false;
  }

  async tap(sel, { timeout = 15000 } = {}) {
    const el = await $(sel);
    await el.waitForDisplayed({ timeout, timeoutMsg: `${this.name}: not displayed: ${sel}` });
    await el.click();
  }

  async type(sel, value, { clear = true } = {}) {
    const el = await $(sel);
    await el.waitForDisplayed({ timeoutMsg: `${this.name}: input not displayed: ${sel}` });
    if (clear) await el.clearValue().catch(() => {});
    await el.setValue(String(value));
  }

  async hideKeyboard() {
    try {
      if (await driver.isKeyboardShown()) await driver.hideKeyboard();
    } catch {}
  }

  /** Android back button. */
  async goBack() {
    await this.hideKeyboard();
    await driver.back();
  }
}
