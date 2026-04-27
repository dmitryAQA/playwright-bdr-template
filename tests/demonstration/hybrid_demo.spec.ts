import { test } from '../../src/fixtures';
import { BDR } from '../../src/bdr/bdr';
import { attachTable } from '../../src/bdr/tables';
import { UserFactory } from '../../src/factories/UserFactory';
import { ProductFactory } from '../../src/factories/ProductFactory';
import { ProfileFactory } from '../../src/factories/ProfileFactory';

test.describe('Hybrid BDR Demo: API + UI', () => {
    test('E2E: Rapid Checkout (Success - Mocked API)', async ({
        userFlow,
        authFlow,
        inventoryFlow,
        cartFlow,
        faker,
    }) => {
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
