import { test } from '../src/fixtures';
import { BDR } from '../src/bdr/bdr';
import { attachTable } from '../src/bdr/tables';

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
            await loginFlow.open();
            await loginFlow.login('standard_user', 'secret_sauce');
            await inventoryFlow.addItemToCart('Sauce Labs Backpack');
        });

        await BDR.Then('The purchase is successfully recorded', async () => {
            await inventoryFlow.goToCart();
            await cartFlow.verifyItemInCart('Sauce Labs Backpack');
        });
    });

    test('E2E: Rapid Checkout (Failure - Real API No Backend)', async ({ userFlow, loginFlow }) => {
        const expectedData = {
            status: 'Premium',
            permissions: 'Full',
            balance: '$1,000.00',
            region: 'EU-West'
        };

        // Simulating data mismatch (in reality this would come from the API)
        const actualData = {
            status: 'Basic',
            permissions: 'Viewer',
            balance: '$0.00',
            region: 'EU-West'
        };

        await BDR.Given('Background: Attempting API setup with data mismatch', async () => {
            // "Rich Diagnostics": using the built-in BDR comparison method
            const { attachCompareTable } = await import('../src/bdr/tables');
            await attachCompareTable('Diagnostic Comparison (Expected vs Actual)', expectedData, actualData);

            await userFlow.login('failed_user');
        });

        await BDR.When('This step will never be reached', async () => {
            await loginFlow.open();
        });
    });
});
