import { test as base, APIRequestContext, expect } from '@playwright/test';
// eslint-disable-next-line no-restricted-imports
import { faker } from '@faker-js/faker';
import { attachInfraDetector } from '../bdr/bdr';
import { createIdempotentApi } from '../api/infrastructure/ApiWrapper';
import { TestConfig } from '../config/TestConfig';
import { setupSeededFaker } from '../utils/FakerUtils';

/**
 * Infrastructure Fixtures
 *
 * Fixtures are reserved for objects with managed lifecycle (setup/teardown)
 * or global state. Business objects (POMs, Flows) are created explicitly
 * in tests to keep dependencies visible.
 */
type BdrFixtures = {
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

    /**
     * API Context with Idempotency Support
     */
    api: async ({ request, runId }: { request: APIRequestContext; runId: string }, use: (r: any) => Promise<void>) => {
        await use(createIdempotentApi(request, runId));
    },
});

export { expect };
