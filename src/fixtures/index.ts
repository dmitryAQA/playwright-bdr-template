import { test as base } from '@playwright/test';
import { LoginFlow } from '../flows/LoginFlow';
import { InventoryFlow } from '../flows/InventoryFlow';
import { CartFlow } from '../flows/CartFlow';
import { UserFlow } from '../api/user.flow';
import { LoginPage } from '../pom/LoginPage';
import { InventoryPage } from '../pom/InventoryPage';
import { CartPage } from '../pom/CartPage';
import { UserApi } from '../api/user.api';

type BdrFixtures = {
    loginFlow: LoginFlow;
    inventoryFlow: InventoryFlow;
    cartFlow: CartFlow;
    userFlow: UserFlow;
};

export const test = base.extend<BdrFixtures>({
    loginFlow: async ({ page }, use) => {
        const loginPage = new LoginPage(page);
        const inventoryPage = new InventoryPage(page);
        await use(new LoginFlow(loginPage, inventoryPage));
    },
    inventoryFlow: async ({ page }, use) => {
        const inventoryPage = new InventoryPage(page);
        await use(new InventoryFlow(inventoryPage));
    },
    cartFlow: async ({ page }, use) => {
        const cartPage = new CartPage(page);
        await use(new CartFlow(cartPage));
    },
    userFlow: async ({ request }, use) => {
        const userApi = new UserApi(request);
        await use(new UserFlow(userApi));
    },
});

export { expect } from '@playwright/test';
