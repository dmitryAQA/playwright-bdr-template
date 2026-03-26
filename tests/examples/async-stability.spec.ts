import { test, expect } from '../../src/fixtures/index';
import { BDR } from '../../src/bdr/bdr';

/**
 * Lead Standard Example: Async Stability (Rule #5)
 *
 * This test demonstrates how to handle "Eventual Consistency" using expect.poll.
 * We use a mocked API that returns the desired state only after several attempts.
 */
test.describe('Async Stability Examples', () => {
    test('DEMO: expect.poll vs Eventual Consistency', async ({ page, runId }) => {
        const orderId = `order-${runId}`;

        await BDR.Given('Background: Mock API with 2-second delay for status update', async () => {
            let callCount = 0;
            await page.route(`**/api/orders/${orderId}`, async (route) => {
                callCount++;
                const status = callCount < 3 ? 'PENDING' : 'COMPLETED';
                await route.fulfill({ json: { status } });
            });
            // We use about:blank for pure API polling demo
            await page.goto('about:blank');
        });

        await BDR.Then('Order status should eventually become COMPLETED', async () => {
            // expect.poll handles polling and eventual consistency automatically
            await expect
                .poll(
                    async () => {
                        const response = await page.request.get(`/api/orders/${orderId}`);
                        const body = await response.json();
                        return body.status;
                    },
                    {
                        message: 'Waiting for order status to become COMPLETED',
                        timeout: 5000,
                    },
                )
                .toBe('COMPLETED');
        });
    });

    test('DEMO: expect.toPass architecture', async ({ page }) => {
        await BDR.Given('User is on the login page (with potential flakiness)', async () => {
            // expect.toPass allows retrying a whole block of actions (e.g. reload and find)
            await expect(async () => {
                await page.goto('/');
                // Use high-priority User-centric locator instead of CSS classes
                await expect(page.getByText('Swag Labs')).toBeVisible();
            }).toPass({
                intervals: [1000, 2000],
                timeout: 10000,
            });
        });
    });
});
