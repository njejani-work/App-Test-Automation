import BasePage, { S } from './BasePage.js';

// "Create new list" dialog on the Saved tab. Captured as locators/MainScreen2.json.
//   name:        id text_input
//   description: id secondary_text_input ("Description (optional)")
//   buttons:     android:id/button2 "Cancel", android:id/button1 "OK"
//   error:       id textinput_error, e.g. 'Reading list "My reading list" already exists.'
const SEL = {
  name: S.id('text_input'),
  description: S.id('secondary_text_input'),
  ok: S.id('button1'),
  cancel: S.id('button2'),
  error: S.id('textinput_error'),
};

class CreateReadingListDialog extends BasePage {
  get anchors() {
    return [SEL.name];
  }

  get nameInput() { return $(SEL.name); }
  get okButton() { return $(SEL.ok); }
  get error() { return $(SEL.error); }

  async create(name, description = '') {
    await this.waitForOpen();
    await this.type(SEL.name, name);
    if (description) await this.type(SEL.description, description);
    await this.hideKeyboard();
    if (await this.anyDisplayed([SEL.error])) {
      throw new Error(`Can't create list "${name}": ${await this.error.getText()}`);
    }
    await this.tap(SEL.ok);
    await driver.waitUntil(async () => !(await this.anyDisplayed([SEL.name])), {
      timeout: 10000,
      timeoutMsg: 'Create-list dialog did not close after OK',
    });
  }

  async cancel() {
    await this.tap(SEL.cancel);
  }
}

export default new CreateReadingListDialog();
