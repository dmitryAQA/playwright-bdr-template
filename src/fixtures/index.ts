import { test as base, APIRequestContext, expect } from '@playwright/test';
// eslint-disable-next-line no-restricted-imports
import { faker } from '@faker-js/faker';
import { attachInfraDetector } from '../bdr/bdr';
import { AuthFlow } from '../flows/AuthFlow';
import { InventoryFlow } from '../flows/InventoryFlow';
import { CartFlow } from '../flows/CartFlow';
import { UserFlow } from '../flows/UserFlow';
import { LoginPage } from '../pom/LoginPage';
import { InventoryPage } from '../pom/InventoryPage';
import { CartPage } from '../pom/CartPage';
import { UserApiClient } from '../api/clients/UserApiClient';
import { generateIdempotencyKey } from '../api/infrastructure/Idempotency';
import { createIdempotentApi } from '../api/infrastructure/ApiWrapper';
import { TestConfig } from '../config/TestConfig';
import { hashCode } from '../utils/CryptoUtils';
import { setupSeededFaker } from '../utils/FakerUtils';

/**
 * Lead Architecture: Level 3 Fixtures
 *
 * We use Dependency Injection (DI) to compose Flows from individual Page Object fixtures.
 * This allows Playwright to manage the lifecycle of each component and cache instances.
 */
type BdrFixtures = {
    // Page Objects (Level 1)
    loginPage: LoginPage;
    inventoryPage: InventoryPage;
    cartPage: CartPage;
    userApi: UserApiClient;

    // Business Flows (Level 2)
    authFlow: AuthFlow;
    inventoryFlow: InventoryFlow;
    cartFlow: CartFlow;
    userFlow: UserFlow;

    // Infrastructure
    runId: string;
    faker: typeof faker;

    /**
     * Idempotent API wrapper: Automatically adds X-Idempotency-Key
     * based on request body to prevent double-spending/double-creation.
     */
    api: any;
};

export const test = base.extend<BdrFixtures>({
    /**
     * RUN_ID: Unique identifier for the current CI run or local execution.
     * Used for data isolation (Rule #1).
     */
    runId: [
        async ({}, use) => {
            await use(TestConfig.runId);
        },
        { scope: 'test' },
    ],

    /**
     * Seeded Faker: Provides deterministic but unique data for each test.
     * Rule: Unique between runs, stable between retries.
     */
    faker: async ({ runId }, use, testInfo) => {
        await use(await setupSeededFaker(runId, testInfo));
    },

    // Auto-attach infra detector to each page
    page: async ({ page }, use) => {
        attachInfraDetector(page);
        await use(page);
    },

    // --- Page Objects & API ---
    loginPage: async ({ page }, use) => {
        await use(new LoginPage(page));
    },
    inventoryPage: async ({ page }, use) => {
        await use(new InventoryPage(page));
    },
    cartPage: async ({ page }, use) => {
        await use(new CartPage(page));
    },
    userApi: async ({ api }, use) => {
        await use(new UserApiClient(api));
    },

    /**
     * API Context with Idempotency Support
     */
    api: async ({ request, runId }: { request: APIRequestContext; runId: string }, use: (r: any) => Promise<void>) => {
        await use(createIdempotentApi(request, runId));
    },

    // --- Business Flows (DI via fixtures) ---
    authFlow: async ({ loginPage, inventoryPage }, use) => {
        await use(new AuthFlow(loginPage, inventoryPage));
    },
    inventoryFlow: async ({ inventoryPage }, use) => {
        await use(new InventoryFlow(inventoryPage));
    },
    cartFlow: async ({ cartPage, page }, use) => {
        await use(new CartFlow(cartPage, page));
    },
    userFlow: async ({ userApi }, use) => {
        await use(new UserFlow(userApi));
    },
});

export { expect };
