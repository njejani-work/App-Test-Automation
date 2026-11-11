// Pop-ups that can appear at any time (feature announcements, surveys, "rate us", Android prompts).
// Tests call Dialogs.dismissAll() at points where one might show up. Only "close it" buttons
// are listed, so this never accepts, buys or changes anything.
import { S } from '../BasePage.js';

const CLOSE_BUTTONS = [
  S.text('Got it'),
  S.text('Not now'),
  S.text('No thanks'),
  S.text('Maybe later'),
  S.text('Dismiss'),
  S.text('Close'),
  S.text('NOT NOW'),
  S.text('NO THANKS'),
  S.id('closeButton'),
];

class Dialogs {
  /**
   * Close any known pop-up, repeatedly, until none is left or `timeout` passes without one.
   * Returns how many were closed.
   */
  async dismissAll({ timeout = 2000, max = 5 } = {}) {
    let closed = 0;
    while (closed < max) {
      const button = await this.#findOne(timeout);
      if (!button) break;
      await button.click();
      closed++;
      await driver.pause(500);
    }
    return closed;
  }

  async #findOne(timeout) {
    const end = Date.now() + timeout;
    do {
      for (const sel of CLOSE_BUTTONS) {
        const el = await $(sel);
        if ((await el.isExisting()) && (await el.isDisplayed())) return el;
      }
      await driver.pause(300);
    } while (Date.now() < end);
    return null;
  }
}

export default new Dialogs();
