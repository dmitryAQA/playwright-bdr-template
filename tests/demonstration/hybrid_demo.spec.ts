import {
    test,
    BDR,
    attachTable,
    UserFactory,
    ProductFactory,
    ProfileFactory,
    AuthFlow,
    InventoryFlow,
    CartFlow,
    UserFlow,
    LoginPage,
    InventoryPage,
    CartPage,
    UserApiClient,
    Page,
} from '../../src/fixtures';
import type { APIRequestContext } from '@playwright/test';

/* eslint-disable no-restricted-syntax */
function createAuthFlow(page: Page) {
    return new AuthFlow(new LoginPage(page), new InventoryPage(page));
}

function createInventoryFlow(page: Page) {
    return new InventoryFlow(new InventoryPage(page));
}

function createCartFlow(page: Page) {
    return new CartFlow(new CartPage(page), page);
}

function createUserFlow(request: APIRequestContext) {
    return new UserFlow(new UserApiClient(request as any));
}
/* eslint-enable no-restricted-syntax */

test.describe('Hybrid BDR Demo: API + UI', () => {
    test('E2E: Rapid Checkout (Success - Mocked API)', async ({ page, request, faker }) => {
        const userFlow = createUserFlow(request);
        const authFlow = createAuthFlow(page);
        const inventoryFlow = createInventoryFlow(page);
        const cartFlow = createCartFlow(page);

        // Direct object mocking (no crutches, just JS)
        // @ts-ignore
        const api = userFlow.userApi;
        api.login = async (username: string, password?: string) =>
            ({ ok: () => true, json: async () => ({ success: true }) }) as any;

        // Rule #4: Data-Driven Determinism via Factories & Catalog
        const testUser = UserFactory.createFromSystem('STANDARD');
        const testProduct = ProductFactory.createFromCatalog('BACKPACK');
        const userData = ProfileFactory.createFromProfiles('PREMIUM');

        await BDR.Given('Background: User account prepared via API (MOCKED)', async () => {
            // "Rich Diagnostics": attaching a table with data that actually "came" from the API
            await attachTable('API User Profile', [userData]);
            await userFlow.login(userData);
        });

        await BDR.When('User logs in and adds items to cart via UI', async () => {
            await authFlow.open();
            await authFlow.loginAs(testUser);
            await inventoryFlow.addItemToCart(testProduct);
        });

        await BDR.Then('The purchase is successfully recorded', async () => {
            await inventoryFlow.goToCart();
            await cartFlow.verifyItemInCart(testProduct);
        });
    });
});
