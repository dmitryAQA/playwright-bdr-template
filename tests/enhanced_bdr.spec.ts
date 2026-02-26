import { test, expect } from '@playwright/test';
import { BDR } from '../src/bdr/bdr';
import { attachTable } from '../src/bdr/tables';

test.describe('Enhanced BDR Features (Mocked)', () => {

    test('Parameterized Steps', async ({ page }) => {
        // Use about:blank for speed and stability
        await BDR.Given('User is on the login page', async () => {
            await page.goto('about:blank');
            await page.setContent('<h1>Login Page</h1>');
        });

        const username = 'standard_user';
        // Parameters are passed to the step body AND formatted in the title
        await BDR.When('User logs in as {}', username, async (u: string) => {
            // Reporting is handled by BDR step wrapper
        });

        await BDR.Then('Inventory page should be visible', async () => {
            // Mock success
            expect(true).toBe(true);
        });
    });

    test('Data Tables and HTML Attachments', async ({ page }) => {
        await BDR.Given('User is logged in', async () => {
            await page.goto('about:blank');
        });

        await BDR.When('User adds the following items to cart:', async () => {
            const items = [
                { name: 'Sauce Labs Backpack', id: 'sauce-labs-backpack', price: '$29.99' },
                { name: 'Sauce Labs Bike Light', id: 'sauce-labs-bike-light', price: '$9.99' }
            ];

            // 1. This should attach an HTML table to the report
            await attachTable('Cart Items', items);

            // 2. Simulate processing items
            for (const item of items) {
                await test.step(`Processing item: ${item.name}`, async () => {
                    // Actual logic would go here
                });
            }
        });

        await BDR.Then('Cart badge shows {}', '2', async (count: string) => {
            expect(count, 'The badge should display exactly 2').toBe('2');
        });
    });

    const testUsers = [
        { name: 'standard_user', role: 'Premium' },
        { name: 'visual_user', role: 'Basic' },
        { name: 'problem_user', role: 'Support' }
    ];

    testUsers.forEach(({ name, role }) => {
        test(`Data-Driven Scalability: Flow for ${name} (${role})`, async ({ page }) => {
            await BDR.Given('Background: User context initialized for {}', name, async () => {
                // Mocking setup
                await page.goto('about:blank');
            });

            await BDR.When('User performs a sequence of business actions as {}', role, async (r: string) => {
                await test.step('Sub-step 1: Verify permissions for ' + r, async () => {
                    console.log('Checking permissions...');
                });
                await test.step('Sub-step 2: Execute domain logic', async () => {
                    console.log('Executing logic...');
                });
            });

            await BDR.Then('The system state is valid for user types', async () => {
                expect(true).toBe(true);
            });
        });
    });
});
