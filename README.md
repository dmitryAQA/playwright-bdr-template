# Playwright BDR Template (TypeScript Reference Implementation)

> **"Minimum Magic, Maximum Control"** — The engineering standard for scaling test automation to 1000+ tests without Gherkin.

[![Live Demo](https://img.shields.io/badge/Live-Demo_Report-brightgreen)](https://dmitryaqa.github.io/playwright-bdr-template/)
[![Methodology](https://img.shields.io/badge/Read-Manifest-blue)](https://github.com/dmitryAQA/bdr-methodology)

This repository is the **Reference Implementation** of the [BDR Methodology](https://github.com/dmitryAQA/bdr-methodology) using **Playwright** and **TypeScript**. 

It demonstrates how to implement **Behavior-Driven Living Requirements** in code, generating beautiful reports without maintaining `.feature` files.

## Key Resources

- **[BDR Methodology Manifesto](https://github.com/dmitryAQA/bdr-methodology)**: The full theory, 4-layer architecture, anti-flakiness principles, and guides for other languages.
- **[Live Allure Report](https://dmitryaqa.github.io/playwright-bdr-template/)**: See how the code below translates into "Living Documentation".

## Quick Start

### 1. Install dependencies
```bash
npm ci
npx playwright install
```

### 2. Run demonstration
```bash
# Run all BDR demo tests
npx playwright test tests/demonstration/scaling_demo.spec.ts
```

### 3. View Report
```bash
# Generate and open Allure report with BDR categories and history
npm run report
```

## Project Structure

This template strictly follows the BDR responsibility layers:

| Directory | Layer | Description |
| :--- | :--- | :--- |
| **`tests/demonstration/`** | **Level 3 (Spec)** | The entry point. Pure business intent. Reads like a story. |
| **`tests/features/`** | **Level 3 (Spec)** | BDR feature demonstrations (Data-driven, inline flows, API). |
| **`src/flows/`** | **Level 2 (Domain)** | Business Logic. Creating users, adding items to cart. Reusable components. |
| **`src/pom/`** | **Level 1 (Page)** | Page Objects. Selectors and raw Playwright interactions. |
| **`src/bdr/`** | **Core** | Utilities for Reporting, Tables, and Decorators. |
| **`docs/contracts/`** | **Metadata** | Examples of Consumer-Driven Contracts (CDC) for Rule #7. |

---

## Architectural Highlights (For Engineering Reviews)

If you are reviewing this repository for its technical depth, here are the core pieces that solve real-world enterprise automation challenges:

*   **BDR Decorators**: [src/bdr/decorators.ts](src/bdr/decorators.ts) - A clean implementation of TypeScript Method Decorators for zero-boilerplate reporting.
*   **Lazy PO Model**: [src/pom/LoginPage.ts](src/pom/LoginPage.ts) - Implementation of "Lazy Getters" for Locators to prevent "Stale Element" exceptions.
*   **Infrastructure Health Check (Rule #0)**: [tests/setup/health.setup.ts](tests/setup/health.setup.ts) - Automated environment availability check that runs before all tests to prevent false-positives.
*   **Dependency Injection Fixtures**: [src/fixtures/index.ts](src/fixtures/index.ts) - Level 3 fixture architecture where Business Flows receive Page Objects as dependencies.
*   **Deterministic Data Seeding (Rule #3)**: [src/fixtures/index.ts](src/fixtures/index.ts) - Seeded Faker implementation that ensures test data is unique across runs but stable during retries.
*   **Automatic Idempotency (Rule #6)**: [src/api/Idempotency.ts](src/api/Idempotency.ts) - Automatically protects against duplicate data operations during network retries.
*   **Contract Testing Reference (Rule #7)**: [docs/contracts/user-profile.json](docs/contracts/user-profile.json) - Example schema for Consumer-Driven Contracts (CDC).
*   **Data Cleanup Strategy (Rule #8)**: Factories in [src/factories/](src/factories/) now include `_cleanup: true` metadata for infrastructure-level data hygiene.

---

## Architecture Guidelines

To get the most out of BDR's deterministic architecture, follow these rules:

### BDR Step Options

Every `BDR` step (`Given`, `When`, `Then`) accepts optional execution settings as the second argument:

```typescript
await BDR.When('User buys product', { stepId: 'purchase-flow' }, async () => {
    await cartPage.checkout();
});
```

*   **`stepId` (string)**: 
    *   Stabilizes history tracking. By default, BDR uses the step name as a key. If you rename a step, its history resets. Providing a `stepId` ensures that analytics persist even after major refactoring.

---

### The BDR Symbiosis: ESLint + Static Analysis
BDR focuses on **runtime reporting and intent**. However, for full Enterprise-grade protection, BDR works in strict symbiosis with ESLint:
1.  **Static Anti-Patterns (ESLint)**: Catches `waitForTimeout`, `page.$`, and forgotten `await` statements right in your IDE before code is committed.
2.  **Runtime Awareness**: BDR wraps your actions in semantic blocks, ensuring the report always reflects the business goal even if the tech stack underneath shifts.

**Required ESLint Setup:**
```bash
npm install -D eslint eslint-plugin-playwright @typescript-eslint/parser @typescript-eslint/eslint-plugin
```

Create `eslint.config.mjs` in your root directory:
```javascript
import playwright from "eslint-plugin-playwright";
import tsParser from "@typescript-eslint/parser";

export default [
    playwright.configs["flat/recommended"],
    {
        files: ["tests/**/*.ts", "src/**/*.ts"],
        languageOptions: { parser: tsParser },
        rules: {
            "playwright/expect-expect": "off",
            "no-restricted-imports": ["error", {
                paths: [{
                    name: "@faker-js/faker",
                    message: "Use the seeded 'faker' fixture from src/fixtures/index.ts to ensure deterministic tests."
                }]
            }]
        }
    },
    {
        files: ["src/pom/**/*.ts"],
        rules: {
            // Rule #9: Stateless POM Enforcement
            "no-restricted-syntax": ["error", {
                "selector": "PropertyDefinition:not([key.name='page'])",
                "message": "POM must be stateless. Don't store data in properties. Use method arguments instead."
            }]
        }
    },
    {
        files: ["src/flows/**/*.ts"],
        rules: {
            // Rule #10: BDR Flow Enforcement
            "no-restricted-syntax": ["error", {
                "selector": "MethodDefinition[kind='method'][accessibility!='private']:not(:has(Decorator[expression.callee.name='Step']))",
                "message": "All public Flow methods must be decorated with @Step for BDR reporting."
            }]
        }
    }
];
```

### Stabilizing Hooks (beforeEach)
You can wrap setup code inside BDR steps within Playwright hooks to ensure consistent reporting even for background preparation:
```typescript
test.beforeEach(async ({ page }) => {
    await BDR.Given('Setup: Login via API', async () => {
        await api.login();
        await page.goto('/');
    });
});
```

### Advanced BDR Placeholders
The `@Step` decorator supports smart interpolation:
*   `{0}`: Replaces with the first argument (index-based).
*   `{}`: Sequential replacement.
*   `{0.username}`: Deep-property access for objects (Lead Standard).

---

## Open for Opportunities

I am currently open to **Contract / Consulting** roles to help teams implement scalable test architecture.
[Connect on LinkedIn](https://www.linkedin.com/in/dmitry-sorvachev-7b099b3b9/)

---
## Contributing

This repository is for the **TypeScript** implementation.

If you are looking for **Python**, **Java**, or **C#** examples, please check the [Community Implementations](https://github.com/dmitryAQA/bdr-methodology#community-implementations) section in the main methodology repository. 

