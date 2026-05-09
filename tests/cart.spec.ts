import { test } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { ProductsPage } from '../pages/ProductsPage';
import { CartPage } from '../pages/CartPage';
import usersFixture from '../fixtures/users.json';

/**
 * Cart test suite.
 * Uses standard_user as required by the PDF spec.
 *
 * Validates:
 * - Product appears in cart
 * - Quantity equals 1
 * - Product name in cart matches the selected item
 */

const { password } = usersFixture;
const STANDARD_USER = 'standard_user';

test.describe('Add to Cart — standard_user', () => {
  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(STANDARD_USER, password);
  });

  test('first product is added to cart with correct name and quantity', async ({ page }) => {
    const productsPage = new ProductsPage(page);
    const cartPage = new CartPage(page);

    // Step 1: Assert we're on the Products page
    await productsPage.assertOnProductsPage();

    // Step 2: Add the first product and capture its name
    const selectedProductName = await productsPage.addFirstProductToCart();

    // Step 3: Assert cart badge updates to 1
    await productsPage.assertCartBadge(1);

    // Step 4: Navigate to cart
    await productsPage.goToCart();

    // Step 5: Assert cart page state
    await cartPage.assertOnCartPage();

    // Step 6: Assert product name, presence, and quantity
    await cartPage.assertCartContains(selectedProductName);
  });
});
