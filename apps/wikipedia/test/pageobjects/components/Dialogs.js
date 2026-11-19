// Pop-ups and promo cards that can appear at any time. Only "close it" buttons are listed,
// so this never accepts, buys, logs in or changes anything. Seen in the capture (11 Nov 2026):
//   Saved tab:  "Sync reading lists ... Not now", "NEW! Discover articles picked just for you ... No thanks"
//   Search tab: bottom sheet "A Faster way to Search" (Add / ~Close)       -> locators/MainScreen3.json
//   Reading list: balloon "Share this reading list with others ... Got it" -> locators/ReadingListScreen.json
import { S } from '../BasePage.js';
import { note, step } from '../../support/report/recorder.js';

const CLOSE_BUTTONS = [
  S.text('Not now'),
  S.text('No thanks'),
  S.text('Got it'),
  S.desc('Close'),
  S.text('Maybe later'),
  S.text('Dismiss'),
  S.text('NOT NOW'),
  S.text('NO THANKS'),
];

class Dialogs {
  /** Close known pop-ups until none is left (or `timeout` passes without one). Returns how many. */
  async dismissAll({ timeout = 2000, max = 5 } = {}) {
    let closed = 0;
    while (closed < max) {
      const button = await this.#findOne(timeout);
      if (!button) break;
      const label = (await button.getText().catch(() => '')) || (await button.getAttribute('content-desc').catch(() => '')) || 'button';
      step(`Pop-up: tap "${label}"`);
      await button.click();
      note(`Closed a pop-up with "${label}"`); // shown on the dashboard
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
