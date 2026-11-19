// AUTO-GENERATED from locators/CreateAccountScreen.json by scripts/locator-capture.
// Do not edit: it is regenerated on every capture. Extend this class for actions, e.g.
//   class Login extends CreateAccountScreenClass { async login(phone) { ... } }
// Screen: (no title) | activity: org.wikipedia.createaccount.CreateAccountActivity | updated: 2026-11-11T16:51:05.538Z
import BasePage from './BasePage.js';

const L = {
  actionBarRootView: ["id=org.wikipedia.dev:id/action_bar_root", "//android.widget.FrameLayout[@resource-id=\"org.wikipedia.dev:id/action_bar_root\"]"],
  toolbarView: ["id=org.wikipedia.dev:id/toolbar", "//android.view.ViewGroup[@resource-id=\"org.wikipedia.dev:id/toolbar\"]"],
  navigateUpBtn: ["~Navigate up", "//android.widget.ImageButton[@content-desc=\"Navigate up\"]"],
  createAnAccountText: ["android=new UiSelector().text(\"Create an account\")", "//android.widget.TextView[@text=\"Create an account\"]"],
  list: ["/hierarchy/android.widget.FrameLayout[1]/android.widget.LinearLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.widget.ScrollView[1]"],
  createAccountPrimaryContainerView: ["id=org.wikipedia.dev:id/create_account_primary_container", "//android.widget.LinearLayout[@resource-id=\"org.wikipedia.dev:id/create_account_primary_container\"]"],
  createAccountUsernameView: ["id=org.wikipedia.dev:id/create_account_username", "//android.widget.LinearLayout[@resource-id=\"org.wikipedia.dev:id/create_account_username\"]"],
  usernameInput: ["android=new UiSelector().text(\"Username\")", "//android.widget.EditText[@text=\"Username\"]"],
  createAccountPasswordView: ["id=org.wikipedia.dev:id/create_account_password_input", "//android.widget.LinearLayout[@resource-id=\"org.wikipedia.dev:id/create_account_password_input\"]"],
  passwordInput: ["android=new UiSelector().text(\"Password\")", "//android.widget.EditText[@text=\"Password\"]"],
  endIconBtn: ["(//android.widget.ImageButton[@resource-id=\"org.wikipedia.dev:id/text_input_end_icon\" and @content-desc=\"Show password\"])[1]", "android=new UiSelector().resourceId(\"org.wikipedia.dev:id/text_input_end_icon\").instance(0)", "~Show password", "id=org.wikipedia.dev:id/text_input_end_icon"],
  createAccountPasswordRepeatView: ["id=org.wikipedia.dev:id/create_account_password_repeat", "//android.widget.LinearLayout[@resource-id=\"org.wikipedia.dev:id/create_account_password_repeat\"]"],
  repeatPasswordInput: ["android=new UiSelector().text(\"Repeat password\")", "//android.widget.EditText[@text=\"Repeat password\"]"],
  createAccountEmailView: ["id=org.wikipedia.dev:id/create_account_email", "//android.widget.LinearLayout[@resource-id=\"org.wikipedia.dev:id/create_account_email\"]"],
  emailOptionalInput: ["android=new UiSelector().text(\"Email (Optional)\")", "//android.widget.EditText[@text=\"Email (Optional)\"]"],
  emailRecommendationText: ["id=org.wikipedia.dev:id/email_recommendation_text", "android=new UiSelector().text(\"Recommended since email is needed for account recovery.\")", "//android.widget.TextView[@resource-id=\"org.wikipedia.dev:id/email_recommendation_text\" and @text=\"Recommended since email is needed for account recovery.\"]"],
  createAccountSubmitBtn: ["id=org.wikipedia.dev:id/create_account_submit_button", "android=new UiSelector().text(\"Next\")", "//android.widget.Button[@resource-id=\"org.wikipedia.dev:id/create_account_submit_button\" and @text=\"Next\"]"],
  alreadyHaveAnAccountText: ["android=new UiSelector().text(\"Already have an account?\")", "//android.widget.TextView[@text=\"Already have an account?\"]"],
  createAccountLoginBtn: ["id=org.wikipedia.dev:id/create_account_login_button", "android=new UiSelector().text(\"Log in\")", "//android.widget.Button[@resource-id=\"org.wikipedia.dev:id/create_account_login_button\" and @text=\"Log in\"]"],
  footerContainerView: ["id=org.wikipedia.dev:id/footer_container", "//android.widget.LinearLayout[@resource-id=\"org.wikipedia.dev:id/footer_container\"]"],
  hCaptchaDisclaimerText: ["id=org.wikipedia.dev:id/hCaptchaDisclaimer", "//android.widget.TextView[@resource-id=\"org.wikipedia.dev:id/hCaptchaDisclaimer\"]"],
  forgotPasswordLink: ["id=org.wikipedia.dev:id/forgot_password_link", "android=new UiSelector().text(\"Forgot your password?\")", "//android.widget.TextView[@resource-id=\"org.wikipedia.dev:id/forgot_password_link\" and @text=\"Forgot your password?\"]"],
  text: ["android=new UiSelector().text(\"•\")", "//android.widget.TextView[@text=\"•\"]"],
  privacyPolicyLink: ["id=org.wikipedia.dev:id/privacy_policy_link", "android=new UiSelector().text(\"Privacy policy\")", "//android.widget.TextView[@resource-id=\"org.wikipedia.dev:id/privacy_policy_link\" and @text=\"Privacy policy\"]"],
  uehbcInput: ["android=new UiSelector().text(\"uehbc\")", "//android.widget.EditText[@text=\"uehbc\"]"],
  aaaaInput: ["android=new UiSelector().text(\"aaaa\")", "//android.widget.EditText[@text=\"aaaa\"]"],
  errorIconBtn: ["~Error", "id=org.wikipedia.dev:id/text_input_error_icon", "//android.widget.ImageButton[@resource-id=\"org.wikipedia.dev:id/text_input_error_icon\" and @content-desc=\"Error\"]"],
  textinputErrorText: ["id=org.wikipedia.dev:id/textinput_error", "//android.widget.TextView[@resource-id=\"org.wikipedia.dev:id/textinput_error\"]"],
};

class CreateAccountScreen extends BasePage {
  constructor() {
    super(L, ["createAccountSubmitBtn","createAccountLoginBtn","forgotPasswordLink"]);
  }

  /** FrameLayout */
  get actionBarRootView() {
    return $(L.actionBarRootView[0]);
  }

  /** ViewGroup */
  get toolbarView() {
    return $(L.toolbarView[0]);
  }

  /** ImageButton */
  get navigateUpBtn() {
    return $(L.navigateUpBtn[0]);
  }

  /** TextView "Create an account" */
  get createAnAccountText() {
    return $(L.createAnAccountText[0]);
  }

  /** ScrollView */
  get list() {
    return $(L.list[0]);
  }

  /** LinearLayout */
  get createAccountPrimaryContainerView() {
    return $(L.createAccountPrimaryContainerView[0]);
  }

  /** LinearLayout */
  get createAccountUsernameView() {
    return $(L.createAccountUsernameView[0]);
  }

  /** EditText "Username" */
  get usernameInput() {
    return $(L.usernameInput[0]);
  }

  /** LinearLayout */
  get createAccountPasswordView() {
    return $(L.createAccountPasswordView[0]);
  }

  /** EditText "Password" */
  get passwordInput() {
    return $(L.passwordInput[0]);
  }

  /** ImageButton */
  get endIconBtn() {
    return $(L.endIconBtn[0]);
  }

  /** LinearLayout */
  get createAccountPasswordRepeatView() {
    return $(L.createAccountPasswordRepeatView[0]);
  }

  /** EditText "Repeat password" */
  get repeatPasswordInput() {
    return $(L.repeatPasswordInput[0]);
  }

  /** LinearLayout */
  get createAccountEmailView() {
    return $(L.createAccountEmailView[0]);
  }

  /** EditText "Email (Optional)" */
  get emailOptionalInput() {
    return $(L.emailOptionalInput[0]);
  }

  /** TextView "Recommended since email is needed for ac" */
  get emailRecommendationText() {
    return $(L.emailRecommendationText[0]);
  }

  /** Button "Next" */
  get createAccountSubmitBtn() {
    return $(L.createAccountSubmitBtn[0]);
  }

  /** TextView "Already have an account?" */
  get alreadyHaveAnAccountText() {
    return $(L.alreadyHaveAnAccountText[0]);
  }

  /** Button "Log in" */
  get createAccountLoginBtn() {
    return $(L.createAccountLoginBtn[0]);
  }

  /** LinearLayout */
  get footerContainerView() {
    return $(L.footerContainerView[0]);
  }

  /** TextView "This site is protected by hCaptcha and i" */
  get hCaptchaDisclaimerText() {
    return $(L.hCaptchaDisclaimerText[0]);
  }

  /** TextView "Forgot your password?" */
  get forgotPasswordLink() {
    return $(L.forgotPasswordLink[0]);
  }

  /** TextView "•" */
  get text() {
    return $(L.text[0]);
  }

  /** TextView "Privacy policy" */
  get privacyPolicyLink() {
    return $(L.privacyPolicyLink[0]);
  }

  /** EditText "uehbc" */
  get uehbcInput() {
    return $(L.uehbcInput[0]);
  }

  /** EditText "aaaa" */
  get aaaaInput() {
    return $(L.aaaaInput[0]);
  }

  /** ImageButton */
  get errorIconBtn() {
    return $(L.errorIconBtn[0]);
  }

  /** TextView "The user name "aaaa" is not available. P" */
  get textinputErrorText() {
    return $(L.textinputErrorText[0]);
  }
}

export { CreateAccountScreen as CreateAccountScreenClass, L as CreateAccountScreenLocators };
export default new CreateAccountScreen();
