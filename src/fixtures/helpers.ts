import { test as base } from '@playwright/test';
// eslint-disable-next-line no-restricted-imports
import { faker } from '@faker-js/faker';
import { TestConfig } from '../config/TestConfig';
import { setupSeededFaker } from '../utils/FakerUtils';

export type HelpersFixtures = {
    runId: string;
    faker: typeof faker;
};

export const test = base.extend<HelpersFixtures>({
    runId: [
        async ({}, use) => {
            await use(TestConfig.runId);
        },
        { scope: 'test' },
    ],

    faker: async ({ runId }, use, testInfo) => {
        await use(await setupSeededFaker(runId, testInfo));
    },
});
