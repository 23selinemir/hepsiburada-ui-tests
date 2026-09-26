import { Page, Locator } from '@playwright/test';

export class LoginPage {
  readonly page: Page;
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly accountMenu: Locator;
  readonly loginLink: Locator;
  readonly loggedInAccount: Locator;
  readonly loginError: Locator;

  constructor(page: Page) {
    this.page = page;

    this.usernameInput = page.locator('#txtUserName');
    this.passwordInput = page.locator('input#txtPassword');
    this.loginButton = page.locator('#btnLogin');

    this.accountMenu = page.locator(
      '[data-test-id="account"]'
    );

    this.loginLink = page.locator('#login');

    this.loggedInAccount = page.locator(
      '[data-test-id="account"][title="Hesabım"]'
    );

    this.loginError = page.locator(
      '[data-test-id="inline-alert-label"]'
    );
  }

  async login(username: string, password: string) {
    await this.accountMenu.hover();
    await this.loginLink.click();

    await this.usernameInput.waitFor({
      state: 'visible',
    });

    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);

    await this.loginButton.click();

    const result = await Promise.race([
      this.loggedInAccount
        .waitFor({
          state: 'visible',
          timeout: 15000,
        })
        .then(() => 'success'),

      this.loginError
        .waitFor({
          state: 'visible',
          timeout: 15000,
        })
        .then(() => 'error'),
    ]);

    if (result === 'error') {
      const errorMessage =
        await this.loginError.innerText();

      throw new Error(
        `Hepsiburada giriş işlemi başarısız: ${errorMessage}`
      );
    }

    console.log(
      'Hepsiburada giriş işlemi başarılı.'
    );
  }
}