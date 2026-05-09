import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { ProductsPage } from '../pages/ProductsPage';
import usersFixture from '../fixtures/users.json';

/**
 * Login test suite.
 * Covers all 6 SauceDemo users using data-driven approach from fixtures/users.json.
 *
 * Validates per PDF requirements:
 * 1. Successful users are redirected to the Products page
 * 2. URL after login is correct (/inventory.html)
 * 3. Failed users see the correct error message
 */

const { password, users } = usersFixture;

// Separate user lists for clarity
const successUsers = users.filter((u) => u.expectedOutcome === 'success');
const errorUsers = users.filter((u) => u.expectedOutcome === 'error');

test.describe('Login — Successful users', () => {
  for (const user of successUsers) {
    test(`${user.username}: redirects to Products page`, async ({ page }) => {
      const loginPage = new LoginPage(page);
      const productsPage = new ProductsPage(page);

      await loginPage.goto();
      await loginPage.login(user.username, password);

      // Validate 1: redirect to Products page
      await productsPage.assertOnProductsPage();

      // Validate 2: URL is correct
      await expect(page).toHaveURL('/inventory.html');
    });
  }
});

test.describe('Login — Failed / locked users', () => {
  for (const user of errorUsers) {
    test(`${user.username}: shows correct error message`, async ({ page }) => {
      const loginPage = new LoginPage(page);

      await loginPage.goto();
      await loginPage.login(user.username, password);

      // Validate 3: correct error message appears
      await loginPage.assertErrorMessage(user.expectedErrorMessage ?? '');

      // Confirm user did NOT reach Products page
      await expect(page).toHaveURL('/');
    });
  }
});

test.describe('Login — Edge cases', () => {
  test('empty credentials show error', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login('', '');
    await loginPage.assertErrorMessage('Epic sadface: Username is required');
  });

  test('valid username, empty password shows error', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login('standard_user', '');
    await loginPage.assertErrorMessage('Epic sadface: Password is required');
  });

  test('wrong password shows error', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login('standard_user', 'wrong_password');
    await loginPage.assertErrorMessage(
      'Epic sadface: Username and password do not match any user in this service'
    );
  });
});
