import { test } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { ProductsPage } from '../pages/ProductsPage';
import { CartPage } from '../pages/CartPage';
import { CheckoutPage } from '../pages/CheckoutPage';
import { generateCheckoutData } from '../utils/dataGenerator';
import usersFixture from '../fixtures/users.json';

/**
 * Checkout test suite.
 * Uses standard_user per PDF spec.
 * Checkout data (first name, last name, postal code) is randomly generated at runtime.
 *
 * Validates:
 * - Checkout completes successfully
 * - "Thank you for your order!" confirmation message appears
 * - User can return to Products page via Back Home button
 */

const { password } = usersFixture;
const STANDARD_USER = 'standard_user';

test.describe('Checkout Flow — standard_user', () => {
  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(STANDARD_USER, password);
  });

  test('completes checkout and shows order confirmation', async ({ page }) => {
    const productsPage = new ProductsPage(page);
    const cartPage = new CartPage(page);
    const checkoutPage = new CheckoutPage(page);

    // Generate random checkout data for this run
    const { firstName, lastName, postalCode } = generateCheckoutData();

    // Step 1: Add a product to cart
    await productsPage.assertOnProductsPage();
    await productsPage.addFirstProductToCart();
    await productsPage.goToCart();

    // Step 2: Proceed to checkout from cart
    await cartPage.assertOnCartPage();
    await cartPage.proceedToCheckout();

    // Step 3: Fill in shipping information with random data
    await checkoutPage.assertOnStepOne();
    await checkoutPage.fillShippingInfo(firstName, lastName, postalCode);

    // Step 4: Confirm we reached the overview page
    await checkoutPage.assertOnStepTwo();

    // Step 5: Finish the order
    await checkoutPage.finishOrder();

    // Step 6: Assert order confirmation message
    await checkoutPage.assertOrderConfirmed();

    // Step 7: Return to Products page via Back Home button
    await checkoutPage.goBackHome();
  });
});
