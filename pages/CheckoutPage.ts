import { Page, Locator, expect } from '@playwright/test';

/**
 * Page Object Model for the SauceDemo Checkout flow.
 * Covers: Checkout Step One (info), Step Two (overview), and Confirmation.
 */
export class CheckoutPage {
  readonly page: Page;

  // Step One — Information
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly postalCodeInput: Locator;
  readonly continueButton: Locator;
  readonly checkoutStepOneTitle: Locator;

  // Step Two — Overview
  readonly finishButton: Locator;
  readonly checkoutStepTwoTitle: Locator;

  // Confirmation
  readonly confirmationHeader: Locator;
  readonly confirmationMessage: Locator;
  readonly backHomeButton: Locator;

  constructor(page: Page) {
    this.page = page;

    // Step One
    this.firstNameInput = page.locator('[data-test="firstName"]');
    this.lastNameInput = page.locator('[data-test="lastName"]');
    this.postalCodeInput = page.locator('[data-test="postalCode"]');
    this.continueButton = page.locator('[data-test="continue"]');
    this.checkoutStepOneTitle = page.locator('.title');

    // Step Two
    this.finishButton = page.locator('[data-test="finish"]');
    this.checkoutStepTwoTitle = page.locator('.title');

    // Confirmation
    this.confirmationHeader = page.locator('.complete-header');
    this.confirmationMessage = page.locator('.complete-text');
    this.backHomeButton = page.locator('[data-test="back-to-products"]');
  }

  /** Assert we are on checkout step one */
  async assertOnStepOne(): Promise<void> {
    await expect(this.page).toHaveURL('/checkout-step-one.html');
    await expect(this.checkoutStepOneTitle).toHaveText('Checkout: Your Information');
  }

  /** Fill in customer information and continue */
  async fillShippingInfo(
    firstName: string,
    lastName: string,
    postalCode: string
  ): Promise<void> {
    await this.firstNameInput.fill(firstName);
    await this.lastNameInput.fill(lastName);
    await this.postalCodeInput.fill(postalCode);
    await this.continueButton.click();
  }

  /** Assert we are on checkout step two (overview) */
  async assertOnStepTwo(): Promise<void> {
    await expect(this.page).toHaveURL('/checkout-step-two.html');
    await expect(this.checkoutStepTwoTitle).toHaveText('Checkout: Overview');
  }

  /** Click the Finish button to complete the order */
  async finishOrder(): Promise<void> {
    await this.finishButton.click();
  }

  /** Assert the order confirmation screen is shown */
  async assertOrderConfirmed(): Promise<void> {
    await expect(this.page).toHaveURL('/checkout-complete.html');
    await expect(this.confirmationHeader).toHaveText('Thank you for your order!');
  }

  /** Click Back Home and assert we return to the Products page */
  async goBackHome(): Promise<void> {
    await this.backHomeButton.click();
    await expect(this.page).toHaveURL('/inventory.html');
  }
}
