import { test, expect } from '../../src/fixtures/index';
import { BDR } from '../../src/bdr/bdr';
import { UserFactory } from '../../src/factories/UserFactory';
import { ProductFactory } from '../../src/factories/ProductFactory';
import { CatalogKey } from '../../src/data/Catalog';

test.describe('Inline BDR Demo (Model Patterns)', () => {
    test('Successful Login (Inline BDD Style)', async ({ page }) => {
        const user = UserFactory.createFromSystem('STANDARD');

        await BDR.Given('User is on the login page', { retryable: true }, async () => {
            await page.goto('/');
        });

        await BDR.When('User logs in as {}', user.username, async () => {
            // Using standard high-priority Playwright locators (Role/TestID)
            await page.getByPlaceholder('Username').fill(user.username);
            await page.getByPlaceholder('Password').fill(user.password!);
            await page.getByRole('button', { name: 'Login' }).click();
        });

        await BDR.Then('Inventory page is visible', { retryable: true }, async () => {
            // Using TestID instead of fragile CSS classes
            await expect(page.getByTestId('inventory-container')).toBeVisible();
        });
    });

    test('Data-Driven Sequence (Inline)', async ({ page }) => {
        const user = UserFactory.createFromSystem('STANDARD');
        const catalogKeys: CatalogKey[] = ['BACKPACK', 'BIKE_LIGHT'];
        const items = catalogKeys.map((key) => ProductFactory.createFromCatalog(key));
        const expectedBadge = items.length.toString();

        await BDR.Given('User is logged in as {}', user.username, async () => {
            await page.goto('/');
            await page.getByPlaceholder('Username').fill(user.username);
            await page.getByPlaceholder('Password').fill(user.password!);
            await page.getByRole('button', { name: 'Login' }).click();
        });

        for (const item of items) {
            await BDR.When('User adds product "{}" to cart', item.name, async () => {
                // Use IDs provided by the Catalog instead of string manipulation guesses
                await page.getByTestId(`add-to-cart-${item.id}`).click();
            });
        }

        await BDR.Then('Cart badge shows {}', expectedBadge, async (count: string) => {
            await expect(page.getByTestId('shopping-cart-badge')).toHaveText(count);
        });
    });
});
