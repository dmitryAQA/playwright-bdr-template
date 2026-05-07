/* eslint-disable no-restricted-syntax */
import { Page } from '@playwright/test';
import { test as base } from './api';
import { LoginPage } from '../pom/LoginPage';
import { InventoryPage } from '../pom/InventoryPage';
import { CartPage } from '../pom/CartPage';

export type PomFixtures = {
    loginPage: LoginPage;
    inventoryPage: InventoryPage;
    cartPage: CartPage;
};

export const test = base.extend<PomFixtures>({
    loginPage: async ({ page }: { page: Page }, use: (r: LoginPage) => Promise<void>) => {
        await use(new LoginPage(page));
    },

    inventoryPage: async ({ page }: { page: Page }, use: (r: InventoryPage) => Promise<void>) => {
        await use(new InventoryPage(page));
    },

    cartPage: async ({ page }: { page: Page }, use: (r: CartPage) => Promise<void>) => {
        await use(new CartPage(page));
    },
});
