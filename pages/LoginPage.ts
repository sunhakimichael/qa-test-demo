import { Page, Locator, expect } from '@playwright/test';

/**
 * Page Object Model for the SauceDemo Login page.
 * Encapsulates all selectors and interactions — tests never touch raw locators.
 */
export class LoginPage {
  readonly page: Page;

  // Locators
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly errorMessage: Locator;
  readonly errorMessageContainer: Locator;

  constructor(page: Page) {
    this.page = page;
    this.usernameInput = page.locator('[data-test="username"]');
    this.passwordInput = page.locator('[data-test="password"]');
    this.loginButton = page.locator('[data-test="login-button"]');
    this.errorMessage = page.locator('[data-test="error"]');
    this.errorMessageContainer = page.locator('.error-message-container');
  }

  /** Navigate to the login page */
  async goto(): Promise<void> {
    await this.page.goto('/');
  }

  /** Fill credentials and submit the login form */
  async login(username: string, password: string): Promise<void> {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }

  /** Assert the error message matches expected text */
  async assertErrorMessage(expectedMessage: string): Promise<void> {
    await expect(this.errorMessage).toBeVisible();
    await expect(this.errorMessage).toContainText(expectedMessage);
  }

  /** Assert no error is shown */
  async assertNoError(): Promise<void> {
    await expect(this.errorMessageContainer).not.toBeVisible();
  }
}
