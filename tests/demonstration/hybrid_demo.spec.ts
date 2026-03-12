import { test } from '../../src/fixtures';
import { BDR } from '../../src/bdr/bdr';
import { attachTable } from '../../src/bdr/tables';
import { User, Product } from '../../src/types/BusinessEntities';

test.describe('Hybrid BDR Demo: API + UI', () => {

    test('E2E: Rapid Checkout (Success - Mocked API)', async ({ userFlow, loginFlow, inventoryFlow, cartFlow }) => {
        // Direct object mocking (no crutches, just JS)
        // @ts-ignore
        const api = userFlow.userApi;
        api.login = async () => ({ ok: () => true, json: async () => ({ success: true }) } as any);

        const userData = {
            username: 'premium_user',
            balance: '$1,000.00',
            status: 'Active',
            region: 'EU-West'
        };

        await BDR.Given('Background: User account prepared via API (MOCKED)', async () => {
            // "Rich Diagnostics": attaching a table with data that actually "came" from the API
            await attachTable('API User Profile', [userData]);
            await userFlow.login(userData.username);
        });

        await BDR.When('User logs in and adds items to cart via UI', async () => {
            const testUser: User = { username: 'standard_user', role: 'user', email: 'test@test.com' };
            const testProduct: Product = { name: 'Sauce Labs Backpack', price: 29.99, description: 'Cool backpack', category: 'clothing' };

            await loginFlow.open();
            await loginFlow.login(testUser);
            await inventoryFlow.addItemToCart(testProduct);
        });

        await BDR.Then('The purchase is successfully recorded', async () => {
            const testProduct: Product = { name: 'Sauce Labs Backpack', price: 29.99, description: 'Cool backpack', category: 'clothing' };
            await inventoryFlow.goToCart();
            await cartFlow.verifyItemInCart(testProduct);
        });
    });

});
