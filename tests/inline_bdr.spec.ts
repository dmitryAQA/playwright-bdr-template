import { test, expect } from '@playwright/test';
import { BDR } from '../src/bdr/bdr';

test.describe('Inline BDR Demo (Flexible)', () => {

    test('Successful Login (Inline BDD Style)', async ({ page }) => {
        // No Page Objects needed here - great for quick scripts or debugging

        await BDR.Given('User is on the login page', async () => {
            await page.goto('/');
        });

        await BDR.When('User logs in as standard_user', async () => {
            await page.fill('[data-test="username"]', 'standard_user');
            await page.fill('[data-test="password"]', 'secret_sauce');
            await page.click('[data-test="login-button"]');
        });

        await BDR.Then('Inventory page is visible', async () => {
            await expect(page.locator('.inventory_list')).toBeVisible();
        });
    });

    test('Data Driven Test (Inline)', async ({ page }) => {
        const items = ['Sauce Labs Backpack', 'Sauce Labs Bike Light'];

        await BDR.Given('User is logged in', async () => {
            await page.goto('/');
            await page.fill('[data-test="username"]', 'standard_user');
            await page.fill('[data-test="password"]', 'secret_sauce');
            await page.click('[data-test="login-button"]');
        });

        for (const item of items) {
            await BDR.When(`User adds "${item}" to cart`, async () => {
                const id = item.toLowerCase().replace(/ /g, '-');
                await page.click(`[data-test="add-to-cart-${id}"]`);
            });
        }

        await BDR.Then('Cart badge shows "2"', async () => {
            await expect(page.locator('.shopping_cart_badge')).toHaveText('2');
        });
    });

});
