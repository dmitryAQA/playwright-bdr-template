import { test, expect } from '../../src/fixtures/index';
import { BDR } from '../../src/bdr/bdr';
import { attachTable } from '../../src/bdr/tables';
import { UserFactory } from '../../src/factories/UserFactory';
import { ProductFactory } from '../../src/factories/ProductFactory';
import { SystemUserKey } from '../../src/data/SystemUsers';

test.describe('Enhanced BDR Features (Model Patterns)', () => {
    test('Parameterized Steps with Data-Driven Inputs', async ({ page }) => {
        const testUser = UserFactory.createFromSystem('STANDARD');

        await BDR.Given('User is on the blank demonstration page', async () => {
            await page.goto('about:blank');
            await page.setContent('<h1>BDR Demonstration</h1>');
        });

        // Parameters are passed to the step body AND automatically formatted in the title
        await BDR.When('User logs in as {}', testUser.username, async (u: string) => {
            // Business logic implementation for step "User logs in as standard_user"
        });

        await BDR.Then('Inventory state should be verified for user {}', testUser.username, async () => {
            expect(true).toBe(true);
        });
    });

    test('Rich Reporting: Data Tables and Attachments', async ({ page }) => {
        const items = [ProductFactory.createFromCatalog('BACKPACK'), ProductFactory.createFromCatalog('BIKE_LIGHT')];
        const expectedCount = items.length.toString();

        await BDR.Given('User navigation is initialized', async () => {
            await page.goto('about:blank');
        });

        await BDR.When('User adds multiple items from catalog to cart:', async () => {
            // 1. This attaches a formatted HTML table to the Playwright report
            await attachTable('Cart Items Snapshot', items);

            // 2. Logic for processing list of business entities
            for (const item of items) {
                await test.step(`Processing catalog item: ${item.name}`, async () => {
                    // Logic for individual item interaction
                });
            }
        });

        await BDR.Then('Cart badge shows {}', expectedCount, async (count: string) => {
            expect(count).toBe(expectedCount);
        });
    });

    const dataDrivenUsers: SystemUserKey[] = ['STANDARD', 'VISUAL', 'PROBLEM'];

    dataDrivenUsers.forEach((userKey) => {
        test(`Data-Driven Scalability: Flow for ${userKey} instance`, async ({ page }) => {
            const user = UserFactory.createFromSystem(userKey);

            await BDR.Given('Background: User context initialized for {}', user.username, async () => {
                await page.goto('about:blank');
            });

            await BDR.When('User performs actions with role {}', user.role, async (r: string) => {
                await test.step(`Verifying permissions for role: ${r}`, async () => {
                    // Permission check logic
                });

                await test.step('Execute domain-specific logic', async () => {
                    // Business action
                });
            });

            await BDR.Then('The system state is valid for user role {}', user.role, async () => {
                expect(true).toBe(true);
            });
        });
    });
});
