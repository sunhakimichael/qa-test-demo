# SauceDemo Automated Test Suite

Playwright + TypeScript automation for [saucedemo.com](https://www.saucedemo.com), covering login, cart, and checkout flows with a Page Object Model architecture.

---

## Framework & Tools

| Tool | Version | Purpose |
|------|---------|---------|
| [Playwright](https://playwright.dev) | ^1.44 | Browser automation + test runner |
| TypeScript | ^5.4 | Type-safe test authoring |
| Allure Playwright | ^3.0 | Rich HTML test reporting |
| ESLint + TS Plugin | ^8.57 | Code quality enforcement |

**Browsers tested:** Chromium, Firefox (configurable in `playwright.config.ts`)

---

## Prerequisites

- Node.js **v18 or later**
- npm v9 or later

---

## Installation

```bash
# 1. Clone the repository
git clone https://github.com/<your-username>/saucedemo-playwright.git
cd saucedemo-playwright

# 2. Install Node dependencies
npm install

# 3. Install Playwright browsers
npx playwright install --with-deps
```

> **Optional — Allure CLI (for rich reports):**
> ```bash
> npm install -g allure-commandline
> ```

---

## Running Tests

### Run all tests (parallel, headless)
```bash
npm test
```

### Run a specific suite
```bash
npm run test:login       # Login scenarios only
npm run test:cart        # Cart scenarios only
npm run test:checkout    # Checkout scenarios only
```

### Run in headed mode (watch the browser)
```bash
npm run test:headed
```

### Debug a failing test step by step
```bash
npm run test:debug
```

---

## Reports

### Playwright HTML Report
```bash
npm run report:html
```
Opens the built-in HTML report at `playwright-report/index.html`.

### Allure Report
```bash
# Generate the report from results
npm run allure:generate

# Serve it in a browser
npm run report:allure
```

> Results folder: `allure-results/`  
> Generated report: `allure-report/`

---

## Project Structure

```
saucedemo-playwright/
│
├── fixtures/
│   └── users.json              # All 6 test users + shared password
│
├── pages/                      # Page Object Model classes
│   ├── LoginPage.ts            # Login page selectors & actions
│   ├── ProductsPage.ts         # Products (inventory) page
│   ├── CartPage.ts             # Shopping cart page
│   └── CheckoutPage.ts        # Checkout steps 1, 2 & confirmation
│
├── tests/                      # Test spec files
│   ├── login.spec.ts           # Login tests — all 6 users, edge cases
│   ├── cart.spec.ts            # Add-to-cart flow (standard_user)
│   └── checkout.spec.ts        # Full checkout flow (standard_user)
│
├── utils/
│   └── dataGenerator.ts        # Random firstName, lastName, postalCode
│
├── playwright.config.ts        # Playwright config (reporters, browsers, base URL)
├── tsconfig.json               # TypeScript config
├── .eslintrc.json              # ESLint rules
├── .gitignore
├── package.json
└── README.md
```

---

## Test Coverage

### Login (`tests/login.spec.ts`)

| User | Expected Outcome | Validated |
|------|-----------------|-----------|
| `standard_user` | Redirect to `/inventory.html` + URL check | ✅ |
| `locked_out_user` | Error: "Sorry, this user has been locked out." | ✅ |
| `problem_user` | Redirect to `/inventory.html` | ✅ |
| `performance_glitch_user` | Redirect to `/inventory.html` | ✅ |
| `error_user` | Redirect to `/inventory.html` | ✅ |
| `visual_user` | Redirect to `/inventory.html` | ✅ |
| Empty credentials | Error: "Username is required" | ✅ |
| Valid user, empty password | Error: "Password is required" | ✅ |
| Wrong password | Error: "do not match any user" | ✅ |

### Cart (`tests/cart.spec.ts`)
- Adds first product to cart as `standard_user`
- Asserts product appears in cart with quantity = 1 and matching name

### Checkout (`tests/checkout.spec.ts`)
- Completes full checkout with randomly generated first name, last name, and postal code
- Asserts "Thank you for your order!" confirmation message
- Asserts Back Home navigates back to `/inventory.html`

---

## Test Data Management

User credentials live in `fixtures/users.json` — no hardcoded values in test files.

Checkout form data (first name, last name, postal code) is generated at runtime via `utils/dataGenerator.ts`, ensuring each run uses fresh random values.

---

## Configuration

Edit `playwright.config.ts` to change:
- **Base URL** — `use.baseURL`
- **Browsers** — `projects` array
- **Parallelism** — `workers`
- **Retries** — `retries` (default: 2 on CI, 0 locally)
- **Reports** — `reporter` array

---

## CI / CD

The project is CI-ready. On CI environments (`process.env.CI = true`):
- Tests run with 2 workers
- Retries are set to 2
- `forbidOnly` is enabled to catch accidentally committed `.only` calls

Example GitHub Actions workflow:
```yaml
name: Playwright Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - run: npm ci
      - run: npx playwright install --with-deps
      - run: npm test
      - uses: actions/upload-artifact@v4
        if: always()
        with:
          name: playwright-report
          path: playwright-report/
```

---

## Evaluation Criteria Mapping

| Criterion | Implementation |
|-----------|---------------|
| Test Scenarios | Login (all 6 users + 3 edge cases), cart, full checkout |
| Test Data Management | `fixtures/users.json` + runtime `dataGenerator.ts` |
| Framework Architecture | POM — pages/ separated from tests/ |
| Reusability | Page classes reused across all specs; shared login in `beforeEach` |
| Scalability | Add new pages to `pages/`, new specs to `tests/`, new users to `users.json` |
| Code Quality | TypeScript strict mode, ESLint, explicit return types, descriptive naming |
