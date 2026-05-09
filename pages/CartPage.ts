import { Page, Locator, expect } from '@playwright/test';

/**
 * Page Object Model for the SauceDemo Cart page.
 */
export class CartPage {
  readonly page: Page;

  readonly cartTitle: Locator;
  readonly cartItems: Locator;
  readonly firstItemName: Locator;
  readonly firstItemQuantity: Locator;
  readonly checkoutButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.cartTitle = page.locator('.title');
    this.cartItems = page.locator('.cart_item');
    this.firstItemName = page.locator('.inventory_item_name').first();
    this.firstItemQuantity = page.locator('.cart_quantity').first();
    this.checkoutButton = page.locator('[data-test="checkout"]');
  }

  /** Assert we are on the Cart page */
  async assertOnCartPage(): Promise<void> {
    await expect(this.page).toHaveURL('/cart.html');
    await expect(this.cartTitle).toHaveText('Your Cart');
  }

  /** Assert cart contains exactly one item with the expected name */
  async assertCartContains(expectedProductName: string): Promise<void> {
    await expect(this.cartItems).toHaveCount(1);
    await expect(this.firstItemName).toHaveText(expectedProductName);
    await expect(this.firstItemQuantity).toHaveText('1');
  }

  /** Proceed to checkout */
  async proceedToCheckout(): Promise<void> {
    await this.checkoutButton.click();
  }
}
