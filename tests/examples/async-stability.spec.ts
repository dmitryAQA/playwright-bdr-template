import { test, expect } from '../../src/fixtures/index';

/**
 * Lead Standard Example: Async Stability (Rule #5)
 * 
 * This test demonstrates how to handle "Eventual Consistency" using expect.poll.
 * We use a mocked API that returns the desired state only after 2 seconds.
 */
test.describe('Async Stability Examples', () => {

    test('DEMO: expect.poll vs Eventual Consistency', async ({ page, runId }) => {
        const orderId = `order-${runId}`;

        // 1. Mock the API with an artificial delay of 2 seconds
        // First call: Status is PENDING
        // Second call (after delay): Status is COMPLETED
        let callCount = 0;
        await page.route(`**/api/orders/${orderId}`, async (route) => {
            callCount++;
            if (callCount < 3) {
                await route.fulfill({ json: { status: 'PENDING' } });
            } else {
                await route.fulfill({ json: { status: 'COMPLETED' } });
            }
        });

        // 2. INCORRECT: Simple expect will fail immediately
        // const response = await page.request.get(`/api/orders/${orderId}`);
        // expect((await response.json()).status).toBe('COMPLETED'); // ❌ Fails

        // 3. CORRECT: expect.poll will wait for the state to eventually become COMPLETED
        await expect.poll(async () => {
            const response = await page.request.get(`/api/orders/${orderId}`);
            const body = await response.json();
            console.log(`Polling order status: ${body.status}`);
            return body.status;
        }, {
            message: 'Waiting for order status to become COMPLETED',
            timeout: 5000,
        }).toBe('COMPLETED'); // ✅ Passes after ~2-3 polls
    });

    test('DEMO: expect.toPass architecture', async ({ page }) => {
        // expect.toPass allows retrying a whole block of actions (e.g. reload and find)
        await expect(async () => {
            // Imagine a flaky UI that needs a refresh to show a newly created item
            await page.goto('https://www.saucedemo.com/');
            await expect(page.locator('.login_logo')).toBeVisible();
        }).toPass({
            intervals: [1000, 2000, 5000],
            timeout: 10000
        });
    });
});
