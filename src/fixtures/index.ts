import { test as base, APIRequestContext, expect } from '@playwright/test';
// eslint-disable-next-line no-restricted-imports
import { faker } from '@faker-js/faker';
import { attachInfraDetector } from '../bdr/bdr';
import { LoginFlow } from '../flows/LoginFlow';
import { InventoryFlow } from '../flows/InventoryFlow';
import { CartFlow } from '../flows/CartFlow';
import { UserFlow } from '../flows/UserFlow';
import { LoginPage } from '../pom/LoginPage';
import { InventoryPage } from '../pom/InventoryPage';
import { CartPage } from '../pom/CartPage';
import { UserApi } from '../api/UserApi';
import { generateIdempotencyKey } from '../api/Idempotency';

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
    userApi: UserApi;

    // Business Flows (Level 2)
    loginFlow: LoginFlow;
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

/**
 * Hash function for deterministic seeding
 */
function hashCode(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convert to 32bit integer
    }
    return Math.abs(hash);
}

export const test = base.extend<BdrFixtures>({
    /**
     * RUN_ID: Unique identifier for the current CI run or local execution.
     * Used for data isolation (Rule #1).
     */
    runId: [async ({ }, use) => {
        const id = process.env.CI_RUN_ID || process.env.GITHUB_RUN_ID || Date.now().toString().slice(-6);
        await use(id);
    }, { scope: 'test' }],

    /**
     * Seeded Faker: Provides deterministic but unique data for each test.
     * Rule: Unique between runs, stable between retries.
     */
    faker: async ({ runId }, use, testInfo) => {
        // Compose a unique seed from runId and the test's unique ID
        const seedValue = hashCode(`${runId}-${testInfo.testId}`);
        faker.seed(seedValue);

        // Expose seed in annotations for reproduction (Lead Standard)
        testInfo.annotations.push({ type: 'faker-seed', description: String(seedValue) });

        await use(faker);
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
        await use(new UserApi(api));
    },

    /**
     * API Context with Idempotency Support
     */
    api: async ({ request, runId }: { request: APIRequestContext; runId: string }, use: (r: any) => Promise<void>) => {
        const wrapMethod = (method: 'post' | 'put') => {
            return (url: string, options: any = {}) => {
                const key = generateIdempotencyKey(method, url, options.data);
                return request[method](url, {
                    ...options,
                    headers: {
                        ...options.headers,
                        'X-Idempotency-Key': `test-${runId}-${key}`,
                    }
                });
            };
        };

        const apiWrapper = {
            ...request,
            post: wrapMethod('post'),
            put: wrapMethod('put'),
        };

        await use(apiWrapper);
    },

    // --- Business Flows (DI via fixtures) ---
    loginFlow: async ({ loginPage, inventoryPage }, use) => {
        await use(new LoginFlow(loginPage, inventoryPage));
    },
    inventoryFlow: async ({ inventoryPage }, use) => {
        await use(new InventoryFlow(inventoryPage));
    },
    cartFlow: async ({ cartPage }, use) => {
        await use(new CartFlow(cartPage));
    },
    userFlow: async ({ userApi }, use) => {
        await use(new UserFlow(userApi));
    },
});

export { expect };
