// eslint-disable-next-line no-restricted-imports
import { faker } from '@faker-js/faker';
import { TestInfo } from '@playwright/test';
import { hashCode } from './CryptoUtils';

/**
 * FakerUtils (Rule #11: Shared Utilities)
 *
 * Helper functions for deterministic data generation.
 */

/**
 * Configures the Faker instance with a stable seed for the current test.
 * Rule: Stable between retries, unique between runs.
 */
export async function setupSeededFaker(runId: string, testInfo: TestInfo) {
    // Compose a unique seed from runId and the test's unique ID
    const seedValue = hashCode(`${runId}-${testInfo.testId}`);
    faker.seed(seedValue);

    // Expose seed in annotations for reproduction (Lead Standard)
    testInfo.annotations.push({
        type: 'faker-seed',
        description: String(seedValue),
    });

    return faker;
}
