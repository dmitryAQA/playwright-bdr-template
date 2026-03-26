/**
 * TestConfig (Rule #10: Global Constants & Env)
 *
 * Centralized configuration for the test environment.
 * Use process.env for CI/CD flexibility.
 */
export const TestConfig = {
    // Default password for Saucedemo (fallback to 'secret_sauce')
    password: process.env.TEST_PASSWORD || 'secret_sauce',

    // Base URL or other global settings (if needed)
    baseUrl: process.env.BASE_URL || 'https://www.saucedemo.com',

    // Default timeouts or retry settings
    timeouts: {
        short: 5000,
        standard: 30000,
    },

    // Global RUN_ID for data isolation and idempotency
    runId: process.env.CI_RUN_ID || process.env.GITHUB_RUN_ID || Date.now().toString().slice(-6),
};
