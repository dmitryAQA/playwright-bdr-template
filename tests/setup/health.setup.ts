import { test, expect } from '@playwright/test';

/**
 * Health Setup (Rule #0)
 * 
 * This setup project verifies environment availability before running any tests.
 * This prevents burning CI minutes and generating false-positive alerts 
 * when the staging or production environment is down.
 * 
 * @see docs/articles/статьянахабреантифлакинес1.md
 */
test('Check environment availability', async ({ request, baseURL }) => {
    // baseURL must be defined in playwright.config.ts
    if (!baseURL) {
        throw new Error('baseURL must be defined in playwright.config.ts');
    }

    console.log(`Pinging environment: ${baseURL}`);

    // Ping the environment with a short timeout
    const response = await request.get(baseURL, {
        timeout: 10000,
        // We don't care about the body, just the status
        failOnStatusCode: false
    });

    /**
     * Rule: If the server returns something other than 200/300, 
     * we consider the environment "unstable" and fail the setup.
     */
    await expect(response).toBeOK();

    console.log('Environment is UP and ready for testing.');
});
