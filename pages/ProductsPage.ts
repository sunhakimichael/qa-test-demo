import { Page, Locator, expect } from '@playwright/test';

/**
 * Page Object Model for the SauceDemo Products (inventory) page.
 */
export class ProductsPage {
  readonly page: Page;

  readonly pageTitle: Locator;
  readonly inventoryList: Locator;
  readonly firstProductName: Locator;
  readonly firstAddToCartButton: Locator;
  readonly shoppingCartBadge: Locator;
  readonly shoppingCartLink: Locator;

  constructor(page: Page) {
    this.page = page;
    this.pageTitle = page.locator('.title');
    this.inventoryList = page.locator('.inventory_list');
    this.firstProductName = page.locator('.inventory_item_name').first();
    this.firstAddToCartButton = page.locator('[data-test^="add-to-cart"]').first();
    this.shoppingCartBadge = page.locator('.shopping_cart_badge');
    this.shoppingCartLink = page.locator('.shopping_cart_link');
  }

  /** Assert we are on the Products page */
  async assertOnProductsPage(): Promise<void> {
    await expect(this.page).toHaveURL('/inventory.html');
    await expect(this.pageTitle).toHaveText('Products');
    await expect(this.inventoryList).toBeVisible();
  }

  /**
   * Adds the first product to the cart.
   * Returns the product name so tests can assert on it later.
   */
  async addFirstProductToCart(): Promise<string> {
    const productName = await this.firstProductName.textContent();
    await this.firstAddToCartButton.click();
    return productName?.trim() ?? '';
  }

  /** Navigate to the cart */
  async goToCart(): Promise<void> {
    await this.shoppingCartLink.click();
  }

  /** Assert cart badge shows the expected item count */
  async assertCartBadge(count: number): Promise<void> {
    await expect(this.shoppingCartBadge).toHaveText(String(count));
  }
}
